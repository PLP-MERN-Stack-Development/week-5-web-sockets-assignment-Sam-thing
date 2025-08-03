import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Users, Hash, Send, Settings, LogOut, ArrowLeft, 
  Smile, Paperclip, MoreVertical, Monitor, Gamepad2, Music, 
  BookOpen, Coffee, Palette, Target, Globe, Camera, Rocket,
  Lightbulb, Flame, Star, Sparkles, Theater, Guitar, Plus
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const ChatRoom = ({ user, onLogout }) => {
  const {
    messages,
    onlineUsers,
    typingUsers,
    currentRoom,
    sendMessage,
    switchRoom,
    startTyping,
    stopTyping,
    createRoom,
  } = useSocket();

  const [showUserList, setShowUserList] = useState(false);
  const [showRoomList, setShowRoomList] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('MessageCircle');
  
  const [rooms] = useState([
    { 
      id: 'general', 
      name: 'General', 
      type: 'public', 
      color: 'from-slate-600 to-slate-800', 
      icon: 'MessageCircle', 
      description: 'General discussion' 
    },
    { 
      id: 'random', 
      name: 'Random', 
      type: 'public', 
      color: 'from-emerald-600 to-emerald-800', 
      icon: 'Globe', 
      description: 'Random conversations' 
    },
    { 
      id: 'tech', 
      name: 'Tech Talk', 
      type: 'public', 
      color: 'from-blue-600 to-blue-800', 
      icon: 'Monitor', 
      description: 'Technology discussions' 
    },
    { 
      id: 'gaming', 
      name: 'Gaming', 
      type: 'public', 
      color: 'from-red-600 to-red-800', 
      icon: 'Gamepad2', 
      description: 'Gaming community' 
    },
    { 
      id: 'music', 
      name: 'Music', 
      type: 'public', 
      color: 'from-purple-600 to-purple-800', 
      icon: 'Music', 
      description: 'Share your beats' 
    }
  ]);
  
  const iconComponents = {
    MessageCircle, Monitor, Gamepad2, Music, BookOpen, Coffee, 
    Palette, Target, Globe, Camera, Rocket, Lightbulb, Flame, 
    Star, Sparkles, Theater, Guitar
  };
  
  const availableIcons = [
    'MessageCircle', 'Monitor', 'Gamepad2', 'Music', 'BookOpen', 
    'Coffee', 'Palette', 'Target', 'Globe', 'Camera', 'Rocket', 
    'Lightbulb', 'Flame', 'Star', 'Sparkles', 'Theater', 'Guitar'
  ];
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: Date.now() + Math.random(),
      content: messageInput.trim(),
      username: user?.username || 'You',
      timestamp: new Date().toISOString(),
      type: 'message'
    };
    
    sendMessage(newMessage);
    setMessageInput('');
    setIsTyping(false);
    stopTyping();
  };

  const handleRoomChange = (roomId) => {
    switchRoom(roomId);
    setSelectedUser(null);
    setShowRoomList(false);
  };

  const handlePrivateChat = (chatUser) => {
    setSelectedUser(chatUser);
    setShowUserList(false);
  };

  const handleBackToRoom = () => {
    setSelectedUser(null);
  };

  const getCurrentRoom = () => {
    return rooms.find(r => r.id === currentRoom) || rooms[0];
  };

  const formatTime = (timestamp) => {
    try {
      if (!timestamp) return '--:--';
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '--:--';
      
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      
      if (minutes < 1) return 'just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return '--:--';
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    if (e.target.value && !isTyping) {
      setIsTyping(true);
      startTyping();
    } else if (!e.target.value && isTyping) {
      setIsTyping(false);
      stopTyping();
    }
  };

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;
    
    const roomData = {
      id: newRoomName.toLowerCase().replace(/\s+/g, '-'),
      name: newRoomName.trim(),
      description: newRoomDescription.trim() || 'Custom room',
      icon: selectedIcon,
      type: 'public',
      color: 'from-slate-600 to-slate-800',
      createdBy: user?.username
    };
    
    if (createRoom) {
      createRoom(roomData);
    }
    
    setNewRoomName('');
    setNewRoomDescription('');
    setSelectedIcon('MessageCircle');
    setShowCreateRoom(false);
    
    switchRoom(roomData.id);
  };

  const getIconComponent = (iconName) => {
    const IconComponent = iconComponents[iconName] || MessageCircle;
    return <IconComponent className="w-5 h-5" />;
  };
  
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${showRoomList ? 'w-80' : 'w-20'} bg-slate-800/90 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-500 ease-out flex flex-col shadow-2xl`}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
          <button
            onClick={() => setShowRoomList(!showRoomList)}
            className="w-12 h-12 rounded-2xl bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Hash className="w-6 h-6 text-slate-200" />
          </button>
          {showRoomList && (
            <div className="ml-4">
              <h2 className="font-bold text-xl text-slate-100">Channels</h2>
              <p className="text-sm text-slate-400">Connect & dominate</p>
            </div>
          )}
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-3">
            {rooms.map((room) => {
              const IconComponent = iconComponents[room.icon] || MessageCircle;
              const isActive = currentRoom === room.id;
              
              return (
                <button
                  key={room.id}
                  onClick={() => handleRoomChange(room.id)}
                  className={`w-full group transition-all duration-300 ${
                    showRoomList ? 'p-4' : 'p-3'
                  } rounded-2xl hover:scale-105 transform ${
                    isActive 
                      ? `bg-gradient-to-r ${room.color} shadow-lg shadow-slate-900/50` 
                      : 'bg-slate-700/50 hover:bg-slate-600/50 hover:shadow-md border border-slate-600/50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`${showRoomList ? 'w-12 h-12' : 'w-10 h-10'} rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive ? 'bg-white/20' : 'bg-slate-600/50'
                    }`}>
                      <IconComponent className={`${showRoomList ? 'w-6 h-6' : 'w-5 h-5'} ${
                        isActive ? 'text-white' : 'text-slate-300'
                      }`} />
                    </div>
                    {showRoomList && (
                      <div className="ml-4 text-left flex-1">
                        <div className={`font-semibold text-sm ${
                          isActive ? 'text-white' : 'text-slate-200'
                        }`}>
                          {room.name}
                        </div>
                        <div className={`text-xs mt-1 ${
                          isActive ? 'text-white/80' : 'text-slate-400'
                        }`}>
                          {room.description}
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Create Room Button */}
          {showRoomList && (
            <button
              onClick={() => setShowCreateRoom(true)}
              className="w-full mt-6 p-4 rounded-2xl border-2 border-dashed border-slate-600 hover:border-slate-500 hover:bg-slate-700/30 transition-all duration-300 text-slate-400 hover:text-slate-300 group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-700 group-hover:bg-slate-600 flex items-center justify-center transition-colors duration-300">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="ml-4 text-left">
                  <div className="font-semibold text-sm">Create Channel</div>
                  <div className="text-xs text-slate-500 mt-1">Start something new</div>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* User Profile Section */}
        <div className="border-t border-slate-700/50 p-4 bg-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-600 to-red-700 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-800 rounded-full"></div>
            </div>
            {showRoomList && (
              <div className="ml-4 flex-1">
                <div className="font-bold text-slate-100">{user?.username || 'User'}</div>
                <div className="text-sm text-emerald-400 flex items-center font-medium">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                  Online
                </div>
              </div>
            )}
            <button
              onClick={onLogout}
              className="w-10 h-10 rounded-xl hover:bg-red-900/30 hover:text-red-400 transition-all duration-300 flex items-center justify-center ml-2 text-slate-500"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-20 bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-8 shadow-lg">
          <div className="flex items-center">
            {selectedUser ? (
              <>
                <button
                  onClick={handleBackToRoom}
                  className="mr-4 p-2 rounded-xl hover:bg-slate-700 transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-400" />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-lg font-bold mr-4 shadow-lg">
                  {selectedUser.username[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="font-bold text-xl text-slate-100">{selectedUser.username}</h1>
                  <p className="text-sm text-slate-400 font-medium">
                    {selectedUser.isOnline ? '🟢 Active now' : '⚫ Last seen recently'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${getCurrentRoom().color} flex items-center justify-center text-white shadow-lg mr-4`}>
                  {getIconComponent(getCurrentRoom().icon)}
                </div>
                <div>
                  <h1 className="font-bold text-2xl text-slate-100">{getCurrentRoom().name}</h1>
                  <p className="text-sm text-slate-400 font-medium">
                    🟢 {onlineUsers?.filter(u => u.isOnline).length || 0} members online
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowUserList(!showUserList)}
              className="p-3 rounded-xl hover:bg-slate-700 hover:text-slate-300 transition-all duration-200 text-slate-400"
            >
              <Users className="w-6 h-6" />
            </button>
            <button className="p-3 rounded-xl hover:bg-slate-700 transition-all duration-200 text-slate-400">
              <MoreVertical className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 flex">
          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages?.map((message) => {
                if (!message) return null;

                const messageId = message.id || Math.random();
                const messageContent = message.content || '';
                const messageUsername = message.username || 'Unknown';
                const messageTimestamp = message.timestamp;
                const messageType = message.type || 'message';
                const isOwnMessage = messageUsername === (user?.username || 'You');

                if (messageType === 'system') {
                  return (
                    <div key={messageId} className="flex justify-center">
                      <div className="bg-slate-700/50 px-4 py-2 rounded-full text-sm text-slate-300 font-medium shadow-sm border border-slate-600/50">
                        {messageContent}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={messageId} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}>
                    <div className={`flex max-w-md lg:max-w-lg ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r flex items-center justify-center text-white text-lg font-bold shadow-lg ${
                        isOwnMessage 
                          ? 'from-orange-600 to-red-700 ml-3' 
                          : 'from-slate-600 to-slate-700 mr-3'
                      }`}>
                        {messageUsername[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className={`rounded-3xl px-6 py-4 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:shadow-xl ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-br-lg'
                            : 'bg-slate-700/80 text-slate-100 rounded-bl-lg border border-slate-600/50'
                        }`}>
                          <p className="text-sm leading-relaxed">{messageContent}</p>
                        </div>
                        <div className={`text-xs text-slate-500 mt-2 font-medium ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                          {!isOwnMessage && (
                            <span className="font-semibold text-slate-400">{messageUsername} • </span>
                          )}
                          {formatTime(messageTimestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {typingUsers?.length > 0 && (
                <div className="flex items-center space-x-3 text-slate-400 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="font-medium">{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-slate-700/50 p-6 bg-slate-800/80 backdrop-blur-xl">
              <div className="flex items-center space-x-4">
                <button type="button" className="p-3 text-slate-500 hover:text-orange-500 hover:bg-slate-700/50 rounded-xl transition-all duration-200">
                  <Paperclip className="w-6 h-6" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={handleInputChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                    placeholder={`Message ${selectedUser ? selectedUser.username : getCurrentRoom().name}...`}
                    className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 focus:bg-slate-700/80 transition-all duration-200 backdrop-blur-sm text-slate-100 placeholder-slate-400"
                  />
                </div>
                <button type="button" className="p-3 text-slate-500 hover:text-yellow-500 hover:bg-slate-700/50 rounded-xl transition-all duration-200">
                  <Smile className="w-6 h-6" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-3 bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-2xl hover:from-orange-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Users Sidebar */}
          {showUserList && (
            <div className="w-80 bg-slate-800/80 backdrop-blur-xl border-l border-slate-700/50 overflow-y-auto shadow-xl">
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="font-bold text-xl text-slate-100 mb-2">
                    Members
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">
                    {onlineUsers?.filter(u => u.isOnline).length || 0} online now
                  </p>
                </div>
                <div className="space-y-3">
                  {onlineUsers?.map((onlineUser) => (
                    <button
                      key={onlineUser.id}
                      onClick={() => handlePrivateChat(onlineUser)}
                      className="w-full flex items-center p-4 rounded-2xl hover:bg-slate-700/50 transition-all duration-300 text-left group border border-slate-600/50 hover:border-slate-500 hover:shadow-md transform hover:scale-105"
                    >
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {onlineUser.username[0].toUpperCase()}
                        </div>
                        {onlineUser.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-3 border-slate-800 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="font-bold text-slate-100 group-hover:text-orange-400">{onlineUser.username}</div>
                        <div className="text-sm text-slate-400 font-medium">
                          {onlineUser.isOnline ? '🟢 Online' : '⚫ Offline'}
                        </div>
                      </div>
                    </button>
                  )) || []}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-[480px] max-w-full max-h-[90vh] overflow-y-auto border border-slate-700/50">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">Create Channel</h2>
                  <p className="text-slate-400 text-sm mt-1">Build your empire</p>
                </div>
                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="text-slate-500 hover:text-slate-300 transition-colors p-2 hover:bg-slate-700 rounded-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Channel Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Channel Name
                  </label>
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="e.g. elite-squad"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 focus:bg-slate-700/80 transition-all duration-200 backdrop-blur-sm text-slate-100 placeholder-slate-500"
                    maxLength={50}
                  />
                </div>

                {/* Channel Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={newRoomDescription}
                    onChange={(e) => setNewRoomDescription(e.target.value)}
                    placeholder="What's this channel about?"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 focus:bg-slate-700/80 transition-all duration-200 backdrop-blur-sm text-slate-100 placeholder-slate-500"
                    maxLength={100}
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Choose an Icon
                  </label>
                  <div className="grid grid-cols-8 gap-3 max-h-40 overflow-y-auto p-4 bg-slate-700/50 border border-slate-600/50 rounded-2xl backdrop-blur-sm">
                    {availableIcons.map((iconName) => {
                      const IconComponent = iconComponents[iconName];
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setSelectedIcon(iconName)}
                          className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200 ${
                            selectedIcon === iconName 
                              ? 'bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-lg transform scale-105' 
                              : 'hover:bg-slate-600/50 border border-slate-600/50 text-slate-400 hover:text-orange-400 hover:shadow-md'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-slate-700/50 rounded-2xl p-4 border border-slate-600/50">
                  <div className="text-sm font-semibold text-slate-400 mb-3">Preview:</div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-600 to-red-700 flex items-center justify-center text-white shadow-lg mr-4">
                      {getIconComponent(selectedIcon)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-100">
                        {newRoomName || 'Channel Name'}
                      </div>
                      <div className="text-sm text-slate-400">
                        {newRoomDescription || 'Channel description'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="px-6 py-3 text-slate-300 bg-slate-700/80 rounded-2xl hover:bg-slate-600/80 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRoom}
                  disabled={!newRoomName.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-2xl hover:from-orange-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Create Channel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;