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
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={disabled}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}

