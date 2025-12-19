'use client';

import OnlineStatus from './OnlineStatus';

export default function ChatHeader({ user, isOnline }) {
  if (!user) return null;

  return (
    <div className="glass-effect border-b border-gray-200 dark:border-dark-700 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white dark:ring-dark-800">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <OnlineStatus isOnline={isOnline} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
            {user.username}
          </h3>
          <div className="flex items-center space-x-2 mt-0.5">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

