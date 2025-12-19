'use client';

export default function OnlineStatus({ isOnline }) {
  return (
    <div
      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-dark-800 shadow-sm ${
        isOnline 
          ? 'bg-green-500 animate-pulse' 
          : 'bg-gray-400 dark:bg-gray-500'
      }`}
      title={isOnline ? 'Online' : 'Offline'}
    />
  );
}

