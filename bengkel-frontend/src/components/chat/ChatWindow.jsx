import React, { useRef, useEffect } from 'react';
import { 
  XMarkIcon, 
  PaperAirplaneIcon,
  EllipsisHorizontalIcon 
} from '@heroicons/react/24/outline';
import { useChat } from '../../context/ChatContext';
import ChatBubble from './ChatBubble';

const ChatWindow = () => {
  const { 
    isChatOpen, 
    messages, 
    currentMessage, 
    isTyping,
    dispatch,
    sendMessage 
  } = useChat();

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(currentMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const quickReplies = [
    'Jenis servis apa saja?',
    'Berapa harga servis berkala?',
    'Jam operasional?',
    'Cara booking servis?'
  ];

  if (!isChatOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-80 lg:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-4 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="font-bold">A</span>
            </div>
            <div>
              <h3 className="font-semibold">TDY Auto Service Support</h3>
              <div className="flex items-center space-x-1 text-sm text-white text-opacity-80">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: 'CLOSE_CHAT' })}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💬</span>
            </div>
            <p className="font-medium text-primary-600">Halo! Ada yang bisa kami bantu?</p>
            <p className="text-sm mt-1">Tim support kami siap membantu Anda</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none">
              <div className="flex space-x-1">
                <EllipsisHorizontalIcon className="h-5 w-5 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Quick Replies for empty chat */}
        {messages.length === 0 && (
          <div className="space-y-2 mt-4">
            <p className="text-xs text-gray-500 text-center">Pertanyaan umum:</p>
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => sendMessage(reply)}
                className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={currentMessage}
            onChange={(e) => dispatch({ 
              type: 'SET_CURRENT_MESSAGE', 
              payload: e.target.value 
            })}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan Anda..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!currentMessage.trim()}
            className="p-2 bg-accent-500 text-white rounded-full hover:bg-accent-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;