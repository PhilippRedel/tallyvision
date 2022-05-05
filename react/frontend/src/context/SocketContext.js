import { io } from 'socket.io-client';
import React from 'react';

export const ioClient = io('http://localhost:3030/client', {
  autoConnect: false,
});
export const ioHost = io('http://localhost:3030/host');
export const SocketContext = React.createContext();
