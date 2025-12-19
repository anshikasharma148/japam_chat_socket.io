'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getSocket } from '@/lib/socket';
import { messagesAPI, usersAPI } from '@/lib/api';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';

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

  const loadChats = async () => {
    try {
      const response = await messagesAPI.getChatsList();
      setChats(response.data.data.chats);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

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

  const updateUserStatus = (userId, isOnline) => {
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
  };

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
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Japam Chat</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-700 font-medium">{user?.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
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

