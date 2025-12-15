import React from 'react';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { useChat } from '../../context/ChatContext';

const ChatTrigger = () => {
  const { isChatOpen, unreadCount, dispatch } = useChat();

  const handleToggleChat = () => {
    dispatch({ type: 'TOGGLE_CHAT' });
  };

  return (
    <>
      {/* Chat Trigger Button */}
      <button
        onClick={handleToggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 z-40 group"
      >
        {isChatOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <>
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </>
        )}
        
        {/* Tooltip */}
        {!isChatOpen && (
          <div className="absolute right-16 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Butuh bantuan? Chat dengan kami
          </div>
        )}
      </button>
    </>
  );
};

export default ChatTrigger;