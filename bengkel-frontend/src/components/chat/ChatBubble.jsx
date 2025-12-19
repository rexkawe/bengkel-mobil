import React from 'react';

const ChatBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isUser 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
      }`}>
        <div className="text-sm">{message.text}</div>
        <div className={`text-xs mt-1 ${
          isUser ? 'text-accent-200' : 'text-gray-500'
        }`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;