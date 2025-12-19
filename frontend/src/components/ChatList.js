'use client';

import { useState, useMemo } from 'react';
import OnlineStatus from './OnlineStatus';
import SearchBar from './SearchBar';
import UnreadBadge from './UnreadBadge';

export default function ChatList({ 
  users, 
  chats, 
  selectedUserId, 
  onSelectUser, 
  currentUserId,
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <div className="w-80 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 flex flex-col">
        <div className="p-6">
          <div className="h-6 bg-gray-200 dark:bg-dark-700 rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-dark-700 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Combine chats and users for display
  const allItems = useMemo(() => {
    const chatItems = chats && chats.length > 0 
      ? chats.map(chat => ({
          id: chat.otherUser.id,
          username: chat.otherUser.username,
          email: chat.otherUser.email,
          isOnline: chat.otherUser.isOnline,
          lastMessage: chat.lastMessage,
          lastMessageAt: chat.lastMessageAt,
          unreadCount: 0, // TODO: Calculate from messages
        }))
      : [];
    
    // Add users that don't have chats yet
    const userItems = users || [];
    const chatUserIds = new Set(chatItems.map(item => item.id));
    const newUsers = userItems.filter(user => !chatUserIds.has(user.id));
    
    return [...chatItems, ...newUsers];
  }, [chats, users]);

  // Filter by search term
  const displayList = useMemo(() => {
    if (!searchTerm.trim()) return allItems;
    
    const term = searchTerm.toLowerCase();
    return allItems.filter(item => 
      item.username.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term)
    );
  }, [allItems, searchTerm]);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-80 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-dark-700 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-dark-700 dark:to-dark-800">
        <h2 className="text-2xl font-bold gradient-text">Chats</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {displayList.length} {displayList.length === 1 ? 'conversation' : 'conversations'}
        </p>
      </div>
      
      <SearchBar onSearch={setSearchTerm} />
      
      <div className="flex-1 overflow-y-auto">
        {displayList.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-500 dark:text-gray-400">No conversations found</p>
            {searchTerm && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Try a different search term
              </p>
            )}
          </div>
        ) : (
          displayList.map((user, index) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className={`p-4 border-b border-gray-100 dark:border-dark-700 cursor-pointer transition-all duration-200 animate-slide-up group ${
                selectedUserId === user.id 
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-dark-700 dark:to-dark-600 border-l-4 border-l-primary-500 shadow-sm' 
                  : 'hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform group-hover:scale-110 ${
                    selectedUserId === user.id 
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600' 
                      : 'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <OnlineStatus isOnline={user.isOnline} />
                  {user.unreadCount > 0 && <UnreadBadge count={user.unreadCount} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`font-semibold truncate ${
                      selectedUserId === user.id 
                        ? 'text-primary-700 dark:text-primary-300' 
                        : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {user.username}
                    </p>
                    {user.lastMessageAt && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                        {formatTime(user.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  {user.lastMessage ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {user.lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                      No messages yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

