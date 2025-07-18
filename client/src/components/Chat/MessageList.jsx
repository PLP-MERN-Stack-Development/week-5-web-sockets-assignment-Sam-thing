import React from "react";
import Message from "./Message.jsx";

const MessageList = ({ messages, currentUser, selectedUser }) => {
  const filteredMessages = selectedUser
    ? messages.filter((msg) =>
        (msg.senderId === selectedUser.id && msg.receiverId === currentUser.id) ||
        (msg.senderId === currentUser.id && msg.receiverId === selectedUser.id)
      )
    : messages.filter((msg) => msg.roomId === currentUser.currentRoom);

  return (
    <div className="flex flex-col gap-2 p-4 overflow-y-auto h-full bg-gray-50">
      {filteredMessages.length === 0 ? (
        <p className="text-center text-gray-400 text-sm">
          No messages yet. Start the conversation!
        </p>
      ) : (
        filteredMessages.map((msg) => (
          <Message
            key={msg.id}
            message={msg}
            isOwnMessage={msg.senderId === currentUser.id}
          />
        ))
      )}
    </div>
  );
};

export default MessageList;
