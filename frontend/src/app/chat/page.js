'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
      loadChats();
      setupSocketListeners();
    }

    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off('receive_message');
        socket.off('message_sent');
        socket.off('user_online');
        socket.off('user_offline');
        socket.off('user_typing');
      }
    };
  }, [isAuthenticated]);

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

  const setupSocketListeners = () => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('receive_message', (data) => {
      const newMessage = data.message;
      
      // If message is for currently selected user, add to messages
      if (selectedUserId === newMessage.senderId) {
        setMessages((prev) => [...prev, newMessage]);
      }
      
      // Refresh chats list to update last message
      loadChats();
    });

    socket.on('message_sent', (data) => {
      const newMessage = data.message;
      
      // Add sent message to current messages
      if (selectedUserId === newMessage.receiverId) {
        setMessages((prev) => [...prev, newMessage]);
      }
      
      // Refresh chats list
      loadChats();
    });

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

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
    loadMessages(userId);
  };

  const handleSendMessage = (content) => {
    const socket = getSocket();
    if (!socket || !selectedUserId) return;

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
            onSendMessage={handleSendMessage}
            loading={messagesLoading}
            isTyping={typingUsers[selectedUserId] || false}
          />
        </div>
      </div>
    </div>
  );
}

