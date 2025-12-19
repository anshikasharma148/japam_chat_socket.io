'use client';

import OnlineStatus from './OnlineStatus';

export default function ChatHeader({ user, isOnline }) {
  if (!user) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <OnlineStatus isOnline={isOnline} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{user.username}</h3>
          <p className="text-xs text-gray-500">
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
    </div>
  );
}

