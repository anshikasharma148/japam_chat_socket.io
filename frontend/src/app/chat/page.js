'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getSocket } from '@/lib/socket';
import { messagesAPI, usersAPI } from '@/lib/api';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function ChatPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAllUsers();
      setUsers(response.data.data.users);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChats = useCallback(async () => {
    try {
      const response = await messagesAPI.getChatsList();
      setChats(response.data.data.chats);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  }, []);

  const loadMessages = async (userId) => {
    if (!userId) return;
    
    setMessagesLoading(true);
    try {
      const response = await messagesAPI.getMessages(userId);
      setMessages(response.data.data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const updateUserStatus = useCallback((userId, isOnline) => {
    // Update users list
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isOnline } : user
      )
    );

    // Update chats list
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.otherUser.id === userId
          ? {
              ...chat,
              otherUser: { ...chat.otherUser, isOnline },
            }
          : chat
      )
    );
  }, []);

  const setupSocketListeners = useCallback(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      const newMessage = data.message;
      
      // Convert IDs to strings for comparison
      const currentReceiverId = selectedUserId?.toString();
      const messageSenderId = newMessage.senderId?.toString();
      const messageReceiverId = newMessage.receiverId?.toString();
      const currentUserIdStr = user?.id?.toString();
      
      // If message is from currently selected user and I'm the receiver, add to messages
      if (currentReceiverId === messageSenderId && messageReceiverId === currentUserIdStr) {
        setMessages((prev) => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      }
      
      // Refresh chats list to update last message
      loadChats();
    };

    const handleMessageSent = (data) => {
      const newMessage = data.message;
      
      // Convert IDs to strings for comparison
      const currentReceiverId = selectedUserId?.toString();
      const messageReceiverId = newMessage.receiverId?.toString();
      const messageSenderId = newMessage.senderId?.toString();
      const currentUserIdStr = user?.id?.toString();
      
      // Add sent message to current messages if it's for the selected user
      if (currentReceiverId === messageReceiverId && messageSenderId === currentUserIdStr) {
        setMessages((prev) => {
          // Remove temporary message and add real one
          const filtered = prev.filter(msg => !msg.isSending);
          // Check if message already exists to avoid duplicates
          const exists = filtered.some(msg => msg.id === newMessage.id);
          if (exists) return filtered;
          return [...filtered, newMessage];
        });
      }
      
      // Refresh chats list
      loadChats();
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('message_sent', handleMessageSent);

    // Handle online/offline status updates
    socket.on('user_online', (data) => {
      updateUserStatus(data.userId, true);
    });

    socket.on('user_offline', (data) => {
      updateUserStatus(data.userId, false);
    });

    // Handle typing indicators
    socket.on('user_typing', (data) => {
      if (data.isTyping) {
        setTypingUsers((prev) => ({
          ...prev,
          [data.userId]: true,
        }));
      } else {
        setTypingUsers((prev) => {
          const updated = { ...prev };
          delete updated[data.userId];
          return updated;
        });
      }
    });

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_sent', handleMessageSent);
      socket.off('user_online');
      socket.off('user_offline');
      socket.off('user_typing');
    };
  }, [selectedUserId, user, loadChats, updateUserStatus]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
      loadChats();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const cleanup = setupSocketListeners();
      return cleanup;
    }
  }, [isAuthenticated, setupSocketListeners]);

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
    loadMessages(userId);
  };

  const handleSendMessage = (content) => {
    const socket = getSocket();
    if (!socket || !selectedUserId) return;

    // Optimistically add message to UI
    const tempMessage = {
      id: `temp-${Date.now()}`,
      senderId: user?.id,
      receiverId: selectedUserId,
      content: content,
      isRead: false,
      createdAt: new Date().toISOString(),
      isSending: true
    };
    
    setMessages((prev) => [...prev, tempMessage]);

    socket.emit('send_message', {
      receiverId: selectedUserId,
      content: content,
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-dark-900 overflow-hidden">
      {/* Header */}
      <header className="glass-effect border-b border-gray-200 dark:border-dark-700 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg">
              💬
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Japam Chat</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Real-time messaging</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <DarkModeToggle />
          <div className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-700">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user?.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex overflow-hidden">
        <ChatList
          users={users}
          chats={chats}
          selectedUserId={selectedUserId}
          onSelectUser={handleSelectUser}
          currentUserId={user?.id}
          loading={loading}
        />
        <div className="flex-1 flex flex-col">
          <ChatWindow
            messages={messages}
            currentUserId={user?.id}
            receiverId={selectedUserId}
            receiverUser={users.find(u => u.id === selectedUserId) || chats.find(c => c.otherUser.id === selectedUserId)?.otherUser}
            onSendMessage={handleSendMessage}
            loading={messagesLoading}
            isTyping={typingUsers[selectedUserId] || false}
          />
        </div>
      </div>
    </div>
  );
}

