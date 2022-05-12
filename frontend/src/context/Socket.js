import { createContext } from 'react';
import { io } from 'socket.io-client';

const AwardsIO = io('http://192.168.10.170:3030/awards');
const ClientIO = io('http://192.168.10.170:3030/client', {
  autoConnect: false,
  multiplex: false,
});
const HostIO = io('http://192.168.10.170:3030/host', {
  autoConnect: false,
  multiplex: false,
});
const SocketContext = createContext();

export { AwardsIO, ClientIO, HostIO, SocketContext };
