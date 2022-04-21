import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';

import { SocketContext } from '../context/SocketContext';
import ClientBallot from '../components/ClientBallot';
import ClientRegistration from '../components/ClientRegistration';
import ClientScorecard from '../components/ClientScorecard';
import Preview from '../components/Preview';

import '../App.less';

const socket = io('http://localhost:3030/client');

export default function Client() {
  const [categories, setCategories] = useState([]);
  const [contestants, setContestants] = useState([]);

  useEffect(() => {
    socket.on('appRegistered', (client) => {
      console.log('[App] Registered client:', client);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <Preview>
        <ClientRegistration />
      </Preview>

      {/*
      <Divider orientation="left">Client ballot</Divider>
      <div className="tv-preview tv-preview--client">
        <ClientBallot
          categories={categories}
          contestant={{
            country: 'Country',
            code: 'gb',
            artist: 'Artist',
            title: 'Title',
            representative: '',
          }}
        />
      </div>
      
      <Divider orientation="left">Client scorecard</Divider>
      <div className="tv-preview tv-preview--client">
        <ClientScorecard
          categories={categories}
          contestants={contestants}
        />
      </div>
      */}
    </SocketContext.Provider>
  );
}
