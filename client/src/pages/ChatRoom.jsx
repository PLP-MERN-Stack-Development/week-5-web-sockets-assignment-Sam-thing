import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext.jsx';
import MessageList from '../components/Chat/MessageList.jsx';
import MessageInput from '../components/Chat/MessageInput.jsx';
import UserList from '../components/Chat/UserList.jsx';
import RoomList from '../components/Chat/RoomList.jsx';
import TypingIndicator from '../components/Chat/TypingIndicator.jsx';

const ChatRoom = ({ user, onLogout }) => {
  const { 
    messages, 
    onlineUsers, 
    currentRoom, 
    typingUsers, 
    sendMessage, 
    sendPrivateMessage,
    joinRoom,
    startTyping,
    stopTyping
  } = useSocket();

  const [showUserList, setShowUserList] = useState(false);
  const [showRoomList, setShowRoomList] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rooms] = useState([
    { id: 'general', name: 'General', type: 'public' },
    { id: 'random', name: 'Random', type: 'public' },
    { id: 'tech', name: 'Tech Talk', type: 'public' },
    { id: 'gaming', name: 'Gaming', type: 'public' }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content) => {
    if (selectedUser) {
      sendPrivateMessage(content, selectedUser.id);
    } else {
      sendMessage(content, currentRoom);
    }
  };

  const handleRoomChange = (roomId) => {
    joinRoom(roomId);
    setSelectedUser(null);
    setShowRoomList(false);
  };

  const handlePrivateChat = (user) => {
    setSelectedUser(user);
    setShowUserList(false);
  };

  const handleBackToRoom = () => {
    setSelectedUser(null);
  };

  const getRoomName = () => {
    if (selectedUser) {
      return `Private chat with ${selectedUser.username}`;
    }
    const room = rooms.find(r => r.id === currentRoom);
    return room ? room.name : 'General';
  };

  return (
    <div className="chat-room">
      {/* Header */}
      <div className="chat-header flex items-center justify-between px-4 py-2 bg-white border-b shadow-sm">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          {/* Room Menu Toggle */}
          <button
            className="text-xl font-bold text-gray-700 hover:text-blue-600"
            onClick={() => setShowRoomList(!showRoomList)}
          >
            ☰
          </button>

          {/* Room Info */}
          <div>
            <h3 className="font-semibold text-lg">
              {getRoomName()}
            </h3>
            <span className="text-sm text-gray-500">
              {selectedUser
                ? selectedUser.isOnline ? 'Online' : 'Offline'
                : `${onlineUsers.length} users online`}
            </span>
          </div>

          {/* Back to Room */}
          {selectedUser && (
            <button
              onClick={handleBackToRoom}
              className="ml-3 text-blue-600 hover:underline text-sm"
            >
              ← Back to {rooms.find(r => r.id === currentRoom)?.name}
            </button>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Toggle User List */}
          <button
            className="relative text-xl text-gray-600 hover:text-blue-600"
            onClick={() => setShowUserList(!showUserList)}
          >
            👥
            <span className="absolute -top-2 -right-2 text-xs bg-blue-600 text-white rounded-full px-1">
              {onlineUsers.length}
            </span>
          </button>

          {/* User Info & Logout */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-700">👋 {user.username}</span>
            <button
              onClick={onLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>


      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Room List Sidebar */}
        {showRoomList && (
          <div className="sidebar room-sidebar">
            <RoomList 
              rooms={rooms}
              currentRoom={currentRoom}
              onRoomSelect={handleRoomChange}
            />
          </div>
        )}

        {/* Messages Area */}
        <div className="messages-container">
          <MessageList 
            messages={messages}
            currentUser={user}
            selectedUser={selectedUser}
          />
          <div ref={messagesEndRef} />
          <TypingIndicator typingUsers={typingUsers} />
        </div>

        {/* Users List Sidebar */}
        {showUserList && (
          <div className="sidebar user-sidebar">
            <UserList 
              users={onlineUsers}
              currentUser={user}
              onPrivateChat={handlePrivateChat}
            />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="chat-input-container">
        <MessageInput 
          onSendMessage={handleSendMessage}
          onStartTyping={startTyping}
          onStopTyping={stopTyping}
          placeholder={
            selectedUser ? 
              `Message ${selectedUser.username}...` : 
              `Type a message in ${getRoomName()}...`
          }
        />
      </div>
    </div>
  );
};

export default ChatRoom;