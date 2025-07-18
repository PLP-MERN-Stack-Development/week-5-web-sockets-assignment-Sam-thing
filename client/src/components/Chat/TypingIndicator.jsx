import React from 'react';

const TypingIndicator = ({ typingUsers }) => {
  if (!typingUsers || typingUsers.length === 0) {
    return null;
  }

  const getTypingText = () => {
    const names = typingUsers.map(user => user.username);

    if (names.length === 1) {
      return `${names[0]} is typing...`;
    } else if (names.length === 2) {
      return `${names[0]} and ${names[1]} are typing...`;
    } else {
      return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]} are typing...`;
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-2 bg-gray-100 border-t border-gray-300">
      <div className="flex items-center space-x-2">
        {/* Animated dots */}
        <div className="flex space-x-1">
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:200ms]"></span>
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:400ms]"></span>
        </div>

        {/* Typing text */}
        <span className="text-sm text-gray-700">{getTypingText()}</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
