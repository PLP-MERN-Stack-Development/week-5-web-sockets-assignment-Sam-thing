// socketSetup.js
const users = {};
const messages = [];
const typingUsers = {};
const rooms = {}; 

const socketSetup = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins the chat
    socket.on('user_join', (username) => {
      users[socket.id] = { username, id: socket.id };
      io.emit('user_list', Object.values(users));
      io.emit('user_joined', { username, id: socket.id });
      console.log(`${username} joined the chat`);
    });
    
    // Handle room creation
    socket.on('create_room', (roomData) => {
      rooms[roomData.id] = {
        ...roomData,
        createdAt: new Date().toISOString(),
        members: []
      };
      
      // Broadcast the new room to all clients
      io.emit('room_created', roomData);
      console.log(`Room created: ${roomData.name} (${roomData.id})`);
    });

    // Handle joining a room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      if (rooms[roomId]) {
        const username = users[socket.id]?.username;
        if (username && !rooms[roomId].members.includes(username)) {
          rooms[roomId].members.push(username);
        }
      }
      console.log(`${users[socket.id]?.username} joined room: ${roomId}`);
    });

    // Handle leaving a room
    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      if (rooms[roomId]) {
        const username = users[socket.id]?.username;
        rooms[roomId].members = rooms[roomId].members.filter(member => member !== username);
      }
      console.log(`${users[socket.id]?.username} left room: ${roomId}`);
    });

    // Send room list when requested
    socket.on('get_rooms', () => {
      socket.emit('rooms_list', Object.values(rooms));
    });

    // Modified message handling to support rooms
    socket.on('send_message', (messageData) => {
      const message = {
        ...messageData,
        id: Date.now(),
        sender: users[socket.id]?.username || 'Anonymous',
        senderId: socket.id,
        timestamp: new Date().toISOString(),
        room: messageData.room || 'general' // Default room
      };

      messages.push(message);
      if (messages.length > 100) messages.shift();

      // Send to specific room or broadcast to all
      if (messageData.room) {
        io.to(messageData.room).emit('receive_message', message);
      } else {
        io.emit('receive_message', message);
      }
    });

    // Rest of your existing code...
    
    // Typing indicator
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

    // Private message
    socket.on('private_message', ({ to, message }) => {
      const messageData = {
        id: Date.now(),
        sender: users[socket.id]?.username || 'Anonymous',
        senderId: socket.id,
        message,
        timestamp: new Date().toISOString(),
        isPrivate: true,
      };

      socket.to(to).emit('private_message', messageData);
      socket.emit('private_message', messageData);
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      const { username } = users[socket.id] || {};
      if (username) {
        io.emit('user_left', { username, id: socket.id });
        console.log(`${username} left the chat`);
        
        // Remove user from all rooms
        Object.values(rooms).forEach(room => {
          room.members = room.members.filter(member => member !== username);
        });
      }

      delete users[socket.id];
      delete typingUsers[socket.id];

      io.emit('user_list', Object.values(users));
      io.emit('typing_users', Object.values(typingUsers));
    });
  });
};

module.exports = socketSetup;