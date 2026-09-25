import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [incomingNotification, setIncomingNotification] = useState(null);
  useEffect(() => {
    const getSocketServerUrl = () => {
      const envSocketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;
      if (envSocketUrl && envSocketUrl.trim() !== '') {
        return envSocketUrl.trim().replace(/\/api\/?$/, '').replace(/\/$/, '');
      }

      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return 'http://localhost:5000';
        }
        return 'https://skillswaplive.onrender.com';
      }

      return 'https://skillswaplive.onrender.com';
    };

    const socketUrl = getSocketServerUrl();
    const socketInstance = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      // console.log('[Socket] Connected to server:', socketInstance.id);
      if (user?._id) {
        socketInstance.emit('user-online', user._id);
      }
    });

    socketInstance.on('user-status-changed', ({ userId, isOnline }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (isOnline) {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        return next;
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Update online user state whenever logged-in user changes
  useEffect(() => {
    if (socket && user?._id) {
      socket.emit('user-online', user._id);
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        incomingNotification,
        setIncomingNotification,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  return context;
};
