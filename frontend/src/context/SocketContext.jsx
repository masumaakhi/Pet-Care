import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5250/api';
const SOCKET_URL = API_BASE.replace(/\/?api\/?$/, '').replace(/\/$/, '');

function joinRoomsForUser(socketInstance) {
  const userStr = localStorage.getItem('user');
  if (!userStr) return;
  try {
    const user = JSON.parse(userStr);
    if (user?.id) {
      socketInstance.emit('join:user', user.id);
      if (user.role === 'volunteer') {
        socketInstance.emit('join:volunteer', user.id);
      }
      if (user.role === 'admin') {
        socketInstance.emit('join:admin');
      }
    }
  } catch (_) {}
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 8,
      reconnectionDelay: 1000,
    });

    const onConnect = () => {
      setSocket(s);
      joinRoomsForUser(s);
    };

    s.on('connect', onConnect);
    if (s.connected) {
      onConnect();
    }

    return () => {
      s.off('connect', onConnect);
      s.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketContext;
