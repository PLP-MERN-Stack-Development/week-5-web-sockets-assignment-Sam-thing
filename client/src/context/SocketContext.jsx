import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ user, children }) => {
  const socket = useRef(null);
  const [messagesByRoom, setMessagesByRoom] = useState({}); // Store messages by room
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('nexus');

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat_messages_by_room');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessagesByRoom(parsedMessages);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
        localStorage.removeItem('chat_messages_by_room');
      }
    }
  }, []);

  // Save messages to localStorage whenever messagesByRoom changes
  useEffect(() => {
    if (Object.keys(messagesByRoom).length > 0) {
      try {
        localStorage.setItem('chat_messages_by_room', JSON.stringify(messagesByRoom));
      } catch (error) {
        console.error('Error saving messages to localStorage:', error);
      }
    }
  }, [messagesByRoom]);

  useEffect(() => {
    if (!user) return;

    socket.current = io('http://localhost:5000');

    socket.current.on('connect', () => {
      socket.current.emit('user_join', user.username);
      // When connecting, join the current room
      socket.current.emit('join_room', currentRoom);
    });

    // Listen for room creation events
    socket.current.on('room_created', (roomData) => {
      console.log('New room created:', roomData);
    });

    // Listen for room list updates
    socket.current.on('rooms_list', (roomsList) => {
      // Handle receiving the full rooms list if needed
      console.log('Rooms list:', roomsList);
    });

    socket.current.on('user_list', setOnlineUsers);
    
    socket.current.on('receive_message', (msg) => {
      const targetRoom = msg.room || currentRoom;
      
      setMessagesByRoom((prev) => {
        const roomMessages = prev[targetRoom] || [];
        
        // Check for duplicates
        const messageExists = roomMessages.some(existingMsg => 
          existingMsg.id === msg.id || 
          (existingMsg.content === msg.content && 
           existingMsg.username === msg.username && 
           Math.abs(new Date(existingMsg.timestamp) - new Date(msg.timestamp)) < 1000)
        );
        
        if (messageExists) {
          return prev;
        }
        
        return {
          ...prev,
          [targetRoom]: [...roomMessages, msg]
        };
      });
    });
    
    socket.current.on('typing_users', setTypingUsers);
    
    return () => {
      socket.current.disconnect();
    };
  }, [user, currentRoom]);

  // Get messages for current room
  const getCurrentRoomMessages = () => {
    return messagesByRoom[currentRoom] || [];
  };

  // Send message
  const sendMessage = (content) => {
    const msg = {
      ...content,
      username: user.username,
      timestamp: content.timestamp || new Date().toISOString(),
      id: content.id || Date.now() + Math.random(),
      room: currentRoom, // Add room to message
    };
    
    // Add to local messages immediately
    setMessagesByRoom((prev) => ({
      ...prev,
      [currentRoom]: [...(prev[currentRoom] || []), msg]
    }));
    
    // Send to server
    socket.current.emit('send_message', msg);
  };

  // Switch rooms
  const switchRoom = (roomId) => {
    if (socket.current && currentRoom !== roomId) {
      socket.current.emit('leave_room', currentRoom);
      socket.current.emit('join_room', roomId);
    }
    setCurrentRoom(roomId);
  };

  const startTyping = () => {
    socket.current.emit('typing', true);
  };

  const stopTyping = () => {
    socket.current.emit('typing', false);
  };

  const clearMessages = (roomId = null) => {
    if (roomId) {
      // Clear specific room
      setMessagesByRoom(prev => {
        const updated = { ...prev };
        delete updated[roomId];
        return updated;
      });
    } else {
      // Clear all messages
      setMessagesByRoom({});
      localStorage.removeItem('chat_messages_by_room');
    }
  };

    const createRoom = (roomData) => {
      if (socket.current) {
        socket.current.emit('create_room', roomData);
      }
    };


  return (
    <SocketContext.Provider
      value={{
        messages: getCurrentRoomMessages(), // Current room messages
        messagesByRoom, // All messages by room
        onlineUsers,
        createRoom,
        typingUsers,
        currentRoom,
        sendMessage,
        switchRoom,
        startTyping,
        stopTyping,
        clearMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};