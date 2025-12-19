'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { getSocket } from '@/lib/socket';

export default function MessageInput({ onSendMessage, disabled, receiverId }) {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (socket && receiverId) {
        socket.emit('typing_stop', { receiverId });
      }
    };
  }, [receiverId, socket]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      // Stop typing indicator
      if (socket && receiverId) {
        socket.emit('typing_stop', { receiverId });
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);

    // Emit typing start
    if (socket && receiverId && e.target.value.trim()) {
      socket.emit('typing_start', { receiverId });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        if (socket && receiverId) {
          socket.emit('typing_stop', { receiverId });
        }
      }, 3000);
    } else if (socket && receiverId && !e.target.value.trim()) {
      // Stop typing if message is empty
      socket.emit('typing_stop', { receiverId });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-effect border-t border-gray-200 dark:border-dark-700 p-4 shadow-lg">
      <div className="flex items-end space-x-3">
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors flex-shrink-0">
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-dark-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none max-h-32 overflow-y-auto transition-all duration-200"
            style={{ minHeight: '48px' }}
          />
          <div className="absolute right-3 bottom-3 flex items-center space-x-2">
            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex-shrink-0 ripple-effect"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}

