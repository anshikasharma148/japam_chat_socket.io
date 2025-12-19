'use client';

import { useState, useEffect } from 'react';
import { messagesAPI } from '@/lib/api';

export const useChatHistory = (userId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadHistory = async () => {
    if (!userId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await messagesAPI.getMessages(userId);
      setMessages(response.data.data.messages || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load chat history');
      console.error('Error loading chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  return {
    messages,
    loading,
    error,
    loadHistory,
    addMessage,
    setMessages,
  };
};

