'use client';

import OnlineStatus from './OnlineStatus';

export default function ChatList({ 
  users, 
  chats, 
  selectedUserId, 
  onSelectUser, 
  currentUserId,
  loading 
}) {
  if (loading) {
    return (
      <div className="w-80 bg-gray-50 border-r border-gray-200 p-4">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  // Combine chats and users for display
  const displayList = chats && chats.length > 0 
    ? chats.map(chat => ({
        id: chat.otherUser.id,
        username: chat.otherUser.username,
        email: chat.otherUser.email,
        isOnline: chat.otherUser.isOnline,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
      }))
    : users || [];

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {displayList.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No users available</p>
          </div>
        ) : (
          displayList.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedUserId === user.id ? 'bg-primary-50 border-l-4 border-l-primary-600' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <OnlineStatus isOnline={user.isOnline} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-800 truncate">
                        {user.username}
                      </p>
                    </div>
                    {user.lastMessage && (
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {user.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

