'use client';

import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow({ 
  messages, 
  currentUserId, 
  receiverId,
  receiverUser,
  onSendMessage, 
  loading,
  isTyping = false
}) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!currentUserId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800">
        <div className="text-center animate-fade-in">
          <div className="text-8xl mb-6 animate-bounce-subtle">💬</div>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            Welcome to Japam Chat
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Select a user from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Chat Header */}
      {receiverUser && (
        <ChatHeader user={receiverUser} isOnline={receiverUser.isOnline} />
      )}
      
      {/* Messages Area */}
      <div 
        ref={messagesContainerRef} 
        className="flex-1 overflow-y-auto px-2 py-4 space-y-1 bg-pattern"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center animate-pulse">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center animate-fade-in">
              <div className="text-6xl mb-4 animate-bounce-subtle">👋</div>
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No messages yet
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Start the conversation by sending a message!
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} disabled={loading} receiverId={receiverId} />
    </div>
  );
}

