import React from "react";
import dayjs from "dayjs";

const Message = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-sm text-sm ${
          isOwnMessage
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p>{message.content}</p>
        <span className="block text-xs mt-1 text-right opacity-70">
          {dayjs(message.timestamp).format("HH:mm")}
        </span>
      </div>
    </div>
  );
};

export default Message;
