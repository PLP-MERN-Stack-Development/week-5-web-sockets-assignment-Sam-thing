import React, { useState, useRef, useEffect } from 'react';

const MessageInput = ({
  onSendMessage,
  onStartTyping,
  onStopTyping,
  placeholder = "Type a message..."
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      handleStopTyping();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    handleStartTyping();
  };

  const handleStartTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      onStartTyping();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      onStopTyping();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white border-t border-gray-200 p-3">
      <form
        onSubmit={handleSubmit}
        className="flex items-end space-x-2"
      >
        <div className="relative flex-grow">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            rows="1"
            maxLength="1000"
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="button"
            onClick={() => console.log('Emoji picker clicked')}
            className="absolute right-2 top-2 text-xl hover:scale-110 transition"
          >
            😊
          </button>
        </div>

        <button
          type="submit"
          disabled={!message.trim()}
          className={`px-3 py-2 rounded-lg text-white transition ${
            message.trim()
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          📨
        </button>
      </form>

      <div className="flex items-center justify-between mt-2 px-1">
        <button
          type="button"
          onClick={() => console.log('File upload clicked')}
          className="text-xl hover:scale-110 transition"
        >
          📎
        </button>
        <div className="text-xs text-gray-500">
          <span className={message.length > 900 ? 'text-red-500 font-medium' : ''}>
            {message.length}/1000
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
