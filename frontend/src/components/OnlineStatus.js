'use client';

export default function OnlineStatus({ isOnline }) {
  return (
    <div
      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
        isOnline ? 'bg-green-500' : 'bg-gray-400'
      }`}
      title={isOnline ? 'Online' : 'Offline'}
    />
  );
}

