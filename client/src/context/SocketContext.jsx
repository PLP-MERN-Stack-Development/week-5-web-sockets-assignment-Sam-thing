import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

// Create Context
const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

// Component wrapper
export const SocketProvider = ({ user, children }) => {
  const socket = useRef(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');

  useEffect(() => {
    if (!user) return;

    socket.current = io('https://week-5-web-sockets-assignment-sam-thing-1.onrender.com', {
  query: { userId: user.id },
});

    // Events
    socket.current.on('connect', () => {
      console.log('🔌 Connected to socket server');
      socket.current.emit('joinRoom', { roomId: currentRoom, username: user.username });
    });

    socket.current.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.current.on('onlineUsers', (users) => {
      setOnlineUsers(users.filter((u) => u.id !== user.id));
    });

    socket.current.on('userTyping', ({ username }) => {
      setTypingUsers((prev) =>
        prev.some((u) => u.username === username) ? prev : [...prev, { username }]
      );
    });

    socket.current.on('userStopTyping', ({ username }) => {
      setTypingUsers((prev) => prev.filter((u) => u.username !== username));
    });

    return () => {
      socket.current.disconnect();
      console.log('🔌 Disconnected from socket');
    };
  }, [user]);

  // Send public message
  const sendMessage = (content, roomId = currentRoom) => {
    const msg = {
      content,
      sender: user,
      roomId,
      type: 'public',
      createdAt: new Date().toISOString(),
    };
    socket.current.emit('sendMessage', msg);
    setMessages((prev) => [...prev, msg]);
  };

  // Send private message
  const sendPrivateMessage = (content, recipientId) => {
    const msg = {
      content,
      sender: user,
      recipient: recipientId,
      type: 'private',
      createdAt: new Date().toISOString(),
    };
    socket.current.emit('privateMessage', msg);
    setMessages((prev) => [...prev, msg]);
  };

  // Join a new room
  const joinRoom = (roomId) => {
    socket.current.emit('joinRoom', { roomId, username: user.username });
    setCurrentRoom(roomId);
    setMessages([]); // optionally clear chat
  };

  // Typing indicators
  const startTyping = () => {
    socket.current.emit('typing', { username: user.username });
  };

  const stopTyping = () => {
    socket.current.emit('stopTyping', { username: user.username });
  };

  return (
    <SocketContext.Provider
      value={{
        messages,
        onlineUsers,
        typingUsers,
        currentRoom,
        sendMessage,
        sendPrivateMessage,
        joinRoom,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
