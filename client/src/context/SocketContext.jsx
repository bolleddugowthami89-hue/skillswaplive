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
    const envSocketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;
    const socketUrl = envSocketUrl
      ? envSocketUrl.replace(/\/api\/?$/, '')
      : (window.location.port === '5173' || window.location.port === '5174'
          ? 'http://localhost:5000'
          : window.location.origin);
    const socketInstance = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
      withCredentials: true,
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
