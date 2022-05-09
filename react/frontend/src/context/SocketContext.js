import { io } from 'socket.io-client';
import React from 'react';

export const ioAwards = io('http://192.168.10.170:3030/awards', {
  autoConnect: false,
});
export const ioClient = io('http://192.168.10.170:3030/client', {
  autoConnect: false,
});
export const ioHost = io('http://192.168.10.170:3030/host', {
  autoConnect: false,
});
export const SocketContext = React.createContext();
