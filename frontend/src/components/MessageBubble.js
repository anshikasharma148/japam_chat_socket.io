'use client';

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
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-opacity ${
          isOwn
            ? 'bg-primary-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        } ${isSending ? 'opacity-60' : ''}`}
      >
        <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
        <div
          className={`text-xs mt-1 flex items-center space-x-1 ${
            isOwn ? 'text-primary-100' : 'text-gray-500'
          }`}
        >
          <span>{formattedTime}</span>
          {isOwn && (
            <span className="ml-1">
              {isSending ? (
                <span className="text-primary-200">⏳</span>
              ) : message.isRead ? (
                <span className="text-blue-200">✓✓</span>
              ) : (
                <span className="text-primary-200">✓</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

