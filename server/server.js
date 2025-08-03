const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS Config for both REST and Socket.IO
const allowedOrigins = [
  'http://localhost:5173',
  'https://week-5-web-sockets-assignment-sam-thing.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check route
app.get('/health', (req, res) => res.status(200).send('OK'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// WebSocket setup
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS (Socket.IO)"));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Enhanced in-memory data stores with room support
const users = {}; // socketId -> { username, id, currentRoom, isOnline }
const rooms = {}; // roomId -> { users: Set, messages: [] }
const typingUsers = {}; // socketId -> username
const roomTypingUsers = {}; // roomId -> Set of usernames

// Initialize default rooms
const defaultRooms = ['nexus', 'matrix', 'cyber', 'neon', 'quantum'];
defaultRooms.forEach(roomId => {
  rooms[roomId] = {
    users: new Set(),
    messages: []
  };
  roomTypingUsers[roomId] = new Set();
});

// WebSocket logic
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('user_join', (username) => {
    const defaultRoom = 'nexus';
    
    // Create user object
    users[socket.id] = { 
      username, 
      id: socket.id, 
      currentRoom: defaultRoom,
      isOnline: true 
    };
    
    // Join default room
    socket.join(defaultRoom);
    if (!rooms[defaultRoom]) {
      rooms[defaultRoom] = { users: new Set(), messages: [] };
    }
    rooms[defaultRoom].users.add(socket.id);
    
    // Broadcast updated user list
    broadcastUserList();
    
    // Send system message to room
    const systemMessage = {
      type: 'system',
      content: `${username} joined the nexus`,
      timestamp: new Date().toISOString(),
      id: Date.now() + Math.random(),
      room: defaultRoom
    };
    
    socket.to(defaultRoom).emit('receive_message', systemMessage);
    
    console.log(`${username} joined room: ${defaultRoom}`);
  });

  socket.on('join_room', (roomId) => {
    const user = users[socket.id];
    if (!user) return;

    const oldRoom = user.currentRoom;
    
    // Leave old room
    if (oldRoom && rooms[oldRoom]) {
      socket.leave(oldRoom);
      rooms[oldRoom].users.delete(socket.id);
      
      // Remove from typing users in old room
      if (roomTypingUsers[oldRoom]) {
        roomTypingUsers[oldRoom].delete(user.username);
        io.to(oldRoom).emit('typing_users', Array.from(roomTypingUsers[oldRoom]));
      }
      
      // Send leave message to old room
      const leaveMessage = {
        type: 'system',
        content: `${user.username} left the room`,
        timestamp: new Date().toISOString(),
        id: Date.now() + Math.random(),
        room: oldRoom
      };
      socket.to(oldRoom).emit('receive_message', leaveMessage);
    }

    // Join new room
    socket.join(roomId);
    user.currentRoom = roomId;
    
    // Initialize room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = { users: new Set(), messages: [] };
      roomTypingUsers[roomId] = new Set();
    }
    rooms[roomId].users.add(socket.id);

    // Send join message to new room
    const joinMessage = {
      type: 'system',
      content: `${user.username} joined the room`,
      timestamp: new Date().toISOString(),
      id: Date.now() + Math.random(),
      room: roomId
    };
    socket.to(roomId).emit('receive_message', joinMessage);

    // Send recent messages from this room to the user
    if (rooms[roomId].messages.length > 0) {
      const recentMessages = rooms[roomId].messages.slice(-50); // Last 50 messages
      socket.emit('room_history', { room: roomId, messages: recentMessages });
    }

    broadcastUserList();
    console.log(`${user.username} joined room: ${roomId}`);
  });

  socket.on('leave_room', (roomId) => {
    const user = users[socket.id];
    if (!user) return;

    socket.leave(roomId);
    
    if (rooms[roomId]) {
      rooms[roomId].users.delete(socket.id);
    }

    // Remove from typing users
    if (roomTypingUsers[roomId]) {
      roomTypingUsers[roomId].delete(user.username);
      io.to(roomId).emit('typing_users', Array.from(roomTypingUsers[roomId]));
    }

    // Send leave message
    const leaveMessage = {
      type: 'system',
      content: `${user.username} left the room`,
      timestamp: new Date().toISOString(),
      id: Date.now() + Math.random(),
      room: roomId
    };
    socket.to(roomId).emit('receive_message', leaveMessage);

    broadcastUserList();
  });

  socket.on('send_message', (messageData) => {
    const user = users[socket.id];
    if (!user) return;

    const roomId = user.currentRoom;
    
    const message = {
      ...messageData,
      id: messageData.id || Date.now() + Math.random(),
      username: user.username, // Use server-side username for security
      senderId: socket.id,
      timestamp: new Date().toISOString(), // Server timestamp
      room: roomId,
      type: 'message'
    };

    // Store message in room
    if (!rooms[roomId]) {
      rooms[roomId] = { users: new Set(), messages: [] };
    }
    rooms[roomId].messages.push(message);
    
    // Keep only last 100 messages per room
    if (rooms[roomId].messages.length > 100) {
      rooms[roomId].messages.shift();
    }

    // Send message only to users in the same room
    socket.to(roomId).emit('receive_message', message);
    
    console.log(`Message in room ${roomId} from ${user.username}:`, message.content);
  });

  socket.on('typing', (isTyping) => {
    const user = users[socket.id];
    if (!user) return;

    const roomId = user.currentRoom;
    
    if (!roomTypingUsers[roomId]) {
      roomTypingUsers[roomId] = new Set();
    }

    if (isTyping) {
      roomTypingUsers[roomId].add(user.username);
    } else {
      roomTypingUsers[roomId].delete(user.username);
    }

    // Send typing indicator only to users in the same room
    socket.to(roomId).emit('typing_users', Array.from(roomTypingUsers[roomId]));
  });

  socket.on('private_message', ({ to, message }) => {
    const sender = users[socket.id];
    const messageData = {
      id: Date.now() + Math.random(),
      sender: sender?.username || 'Anonymous',
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
    };
    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      const roomId = user.currentRoom;
      
      // Remove from room
      if (rooms[roomId]) {
        rooms[roomId].users.delete(socket.id);
      }
      
      // Remove from typing users
      if (roomTypingUsers[roomId]) {
        roomTypingUsers[roomId].delete(user.username);
        io.to(roomId).emit('typing_users', Array.from(roomTypingUsers[roomId]));
      }
      
      // Send disconnect message to room
      if (roomId) {
        const disconnectMessage = {
          type: 'system',
          content: `${user.username} disconnected`,
          timestamp: new Date().toISOString(),
          id: Date.now() + Math.random(),
          room: roomId
        };
        socket.to(roomId).emit('receive_message', disconnectMessage);
      }
      
      // Clean up user data
      delete users[socket.id];
      delete typingUsers[socket.id];
      
      broadcastUserList();
      console.log(`${user.username} disconnected from room: ${roomId}`);
    }
  });

  // Helper function to broadcast user list
  function broadcastUserList() {
    const userList = Object.values(users).map(user => ({
      id: user.id,
      username: user.username,
      isOnline: user.isOnline,
      currentRoom: user.currentRoom
    }));
    
    io.emit('user_list', userList);
  }
});

// Default root route
app.get('/', (req, res) => {
  res.send("✅ WebSocket Server is Live! Visit the frontend to chat.");
});

// API endpoint to get room info (optional)
app.get('/api/rooms', (req, res) => {
  const roomInfo = Object.keys(rooms).map(roomId => ({
    id: roomId,
    userCount: rooms[roomId].users.size,
    messageCount: rooms[roomId].messages.length
  }));
  res.json(roomInfo);
});

// Crash test route (optional)
app.get('/crash-test', (req, res) => {
  throw new Error('💥 Intentional crash for Sentry test');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Export app (optional for testing or advanced setups)
module.exports = { app, server, io };