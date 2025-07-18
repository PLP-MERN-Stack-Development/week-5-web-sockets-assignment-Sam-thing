import React from 'react';

const UserList = ({ users, currentUser, onPrivateChat }) => {
  const getInitials = (username) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (username) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="w-64 h-full bg-white border-l border-gray-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700">
          Online Users ({users.length})
        </h3>
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto">
        {users.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-4">
            No other users online
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              onClick={() => onPrivateChat(user)}
              className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
            >
              {/* Avatar */}
              <div
                className="w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold text-sm"
                style={{ backgroundColor: getAvatarColor(user.username) }}
              >
                {getInitials(user.username)}
              </div>

              {/* User Info */}
              <div className="flex-1 ml-3">
                <p className="text-sm font-medium text-gray-800">{user.username}</p>
                <div className="flex items-center space-x-1 text-xs text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                  <span>Online</span>
                </div>
              </div>

              {/* Chat button */}
              <button
                className="text-xl hover:text-blue-600 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrivateChat(user);
                }}
                title={`Start private chat with ${user.username}`}
              >
                💬
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer with current user */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center space-x-3">
        <div
          className="w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold text-sm"
          style={{ backgroundColor: getAvatarColor(currentUser.username) }}
        >
          {getInitials(currentUser.username)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{currentUser.username}</p>
          <p className="text-xs text-gray-500">That's you!</p>
        </div>
      </div>
    </div>
  );
};

export default UserList;
