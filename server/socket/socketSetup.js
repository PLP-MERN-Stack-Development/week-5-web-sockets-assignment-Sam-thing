// socketSetup.js
const users = {};
const messages = [];
const typingUsers = {};

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

    // Public message handling
    socket.on('send_message', (messageData) => {
      const message = {
        ...messageData,
        id: Date.now(),
        sender: users[socket.id]?.username || 'Anonymous',
        senderId: socket.id,
        timestamp: new Date().toISOString(),
      };

      messages.push(message);
      if (messages.length > 100) messages.shift(); // prevent memory bloat

      io.emit('receive_message', message);
    });

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
      }

      delete users[socket.id];
      delete typingUsers[socket.id];

      io.emit('user_list', Object.values(users));
      io.emit('typing_users', Object.values(typingUsers));
    });
  });
};

module.exports = socketSetup;
