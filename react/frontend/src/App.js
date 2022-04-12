import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [response, setResponse] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:3030/client', {
      autoConnect: true,
    });

    socket.on('clientFoo', (data) => {
      setResponse(data);
    });
  }, []);

  return (
    <pre>{response}</pre>
  );
}

export default App;
