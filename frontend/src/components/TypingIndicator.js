'use client';

export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 px-4 py-3 animate-fade-in">
      <div className="flex items-center space-x-1 bg-white dark:bg-dark-700 rounded-2xl px-4 py-2 shadow-md">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400 ml-2 font-medium">typing...</span>
      </div>
    </div>
  );
}

