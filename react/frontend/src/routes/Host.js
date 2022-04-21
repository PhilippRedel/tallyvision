import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';

import { SocketContext } from '../context/SocketContext';
import HostDashboard from '../components/HostDashboard';
import Preview from '../components/Preview';

import '../App.less';

const socket = io('http://localhost:3030/host').connect();

export default function Client() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    socket.on('appClientsTable', (clients) => {
      setClients(clients);
    });

    socket.on('appRegistered', (client) => {
      console.log('[App] Registered client:', client);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <Preview viewport="host">
        <HostDashboard clients={clients} />
      </Preview>
    </SocketContext.Provider>
  );
}
