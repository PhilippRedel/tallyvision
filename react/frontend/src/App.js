import { SocketContext } from './context/SocketContext';
import React, { useState, useEffect } from 'react';

import './App.less';

const socket = io('http://localhost:3030/client');

export default function App() {
  const [categories, setCategories] = useState([]);
  const [contestants, setContestants] = useState([]);

  useEffect(() => {
    return () => socket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      ...
    </SocketContext.Provider>
  );
}
