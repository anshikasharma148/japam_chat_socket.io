'use client';

import MessageStatus from './MessageStatus';

export default function MessageBubble({ message, isOwn }) {
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    // Show date if not today
    if (messageDate.getTime() !== today.getTime()) {
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      return `${day} ${month}, ${hours}:${minutes}`;
    }
    
    return `${hours}:${minutes}`;
  };

  const formattedTime = formatTime(message.createdAt);
  const isSending = message.isSending;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3 px-4 message-enter group`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl transition-all duration-200 ${
          isOwn
            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-md shadow-lg hover:shadow-xl'
            : 'bg-white dark:bg-dark-700 text-gray-800 dark:text-gray-100 rounded-bl-md shadow-md hover:shadow-lg border border-gray-100 dark:border-dark-600'
        } ${isSending ? 'opacity-60' : 'opacity-100'}`}
      >
        <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <div
          className={`text-xs mt-1.5 flex items-center justify-end space-x-1 ${
            isOwn ? 'text-primary-50' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <span className="font-medium">{formattedTime}</span>
          {isOwn && (
            <MessageStatus isRead={message.isRead} isSending={isSending} />
          )}
        </div>
      </div>
    </div>
  );
}

