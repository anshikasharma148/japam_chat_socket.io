'use client';

export default function MessageBubble({ message, isOwn }) {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formattedTime = formatTime(message.createdAt);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn
            ? 'bg-primary-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm break-words">{message.content}</p>
        <div
          className={`text-xs mt-1 ${
            isOwn ? 'text-primary-100' : 'text-gray-500'
          }`}
        >
          {formattedTime}
          {isOwn && message.isRead && (
            <span className="ml-1">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
}

