import React from 'react';
import { io } from 'socket.io-client';

export const socket = io('http://localhost:3030/client', {
  autoConnect: false,
});

export const ClientSocket = React.createContext();
