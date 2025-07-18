import React from 'react';

const RoomList = ({ rooms, currentRoom, onRoomSelect }) => {
  const getRoomIcon = (roomId) => {
    const icons = {
      'general': '💬',
      'random': '🎲',
      'tech': '💻',
      'gaming': '🎮',
      'music': '🎵',
      'movies': '🎬',
      'books': '📚',
      'sports': '⚽'
    };
    return icons[roomId] || '🏠';
  };

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700">Channels</h3>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto">
        {rooms.map((room) => (
          <div 
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 transition ${
              currentRoom === room.id ? 'bg-blue-100' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-xl">{getRoomIcon(room.id)}</div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">{room.name}</span>
                <span className="text-xs text-gray-500 capitalize">{room.type}</span>
              </div>
            </div>

            {currentRoom === room.id && (
              <span className="text-blue-500 text-lg">●</span>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          <span className="text-lg">+</span>
          <span className="text-sm font-medium">Create Room</span>
        </button>
      </div>
    </div>
  );
};

export default RoomList;
