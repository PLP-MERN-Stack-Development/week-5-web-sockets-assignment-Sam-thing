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

// const Sentry = require('@sentry/node');
// Sentry.init({
//   dsn: process.env.SENTRY_DSN,
//   tracesSampleRate: 1.0,
// });
// app.use(Sentry.Handlers.requestHandler());

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});


app.get('/health', (req, res) => res.status(200).send('OK'));


// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// In-memory stores (for demo only)
const users = {};
const messages = [];
const typingUsers = {};

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id };
    io.emit('user_list', Object.values(users));
    io.emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined`);
  });

  socket.on('send_message', (messageData) => {
    const message = {
      ...messageData,
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      timestamp: new Date().toISOString(),
    };
    messages.push(message);
    if (messages.length > 100) messages.shift();
    io.emit('receive_message', message);
  });

  socket.on('typing', (isTyping) => {
    const username = users[socket.id]?.username;
    if (username) {
      if (isTyping) {
        typingUsers[socket.id] = username;
      } else {
        delete typingUsers[socket.id];
      }
      io.emit('typing_users', Object.values(typingUsers));
    }
  });

  socket.on('private_message', ({ to, message }) => {
    const sender = users[socket.id];
    const messageData = {
      id: Date.now(),
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
      io.emit('user_left', { username: user.username, id: socket.id });
      delete users[socket.id];
      delete typingUsers[socket.id];
      io.emit('user_list', Object.values(users));
      io.emit('typing_users', Object.values(typingUsers));
      console.log(`${user.username} disconnected`);
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Serve the frontend build
app.get("/", (req, res) => {
  res.send("✅ WebSocket Server is Live! Visit the frontend to chat.");
});


// Error handling
app.get('/crash-test', (req, res) => {
  throw new Error('💥 Intentional crash for Sentry test');
});

module.exports = { app, server, io };
