'use client';

import { useEffect, useState } from 'react';
import { getSocket, initializeSocket } from '@/lib/socket';

export const useSocket = (token) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const socketInstance = initializeSocket(token);
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    return () => {
      socketInstance.off('connect');
      socketInstance.off('disconnect');
    };
  }, [token]);

  return { socket, isConnected };
};

