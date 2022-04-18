import React, { useState, useEffect } from 'react';
import { ClientSocket, socket } from './context/ClientSocket';

// ...
import { Divider } from 'antd';

// ...
import ClientBallot from './components/ClientBallot';
import ClientRegistration from './components/ClientRegistration';
import ClientScorecard from './components/ClientScorecard';

// ...
import HostDashboard from './components/HostDashboard';

import './App.less';

function App() {
  const [categories, setCategories] = useState([]);
  const [contestants, setContestants] = useState([]);

  useEffect(() => {
    socket.on('appCountBallot', (values) => {
      console.log('[App] Counted ballot:', values);
    });
    
    socket.on('getCategories', (data) => {
      setCategories(data);
    });

    socket.on('getContestants', (data) => {
      setContestants(data);
    });
  }, []);

  return (
    <ClientSocket.Provider value={socket}>
      <Divider orientation="left">Client registration</Divider>
      <div className="tv-uiPreview tv-uiPreview__client">
        <ClientRegistration />
      </div>

      <Divider orientation="left">Client ballot</Divider>
      <div className="tv-uiPreview tv-uiPreview__client">
        <ClientBallot
          categories={categories}
          contestant={
            {
              country: 'Country',
              code: 'gb',
              artist: 'Artist',
              title: 'Title',
              representative: '',
            }
          }
        />
      </div>
      
      <Divider orientation="left">Client scorecard</Divider>
      <div className="tv-uiPreview tv-uiPreview__client">
        <ClientScorecard
          categories={categories}
          contestants={contestants}
        />
      </div>

      <Divider orientation="left">Host dashboard</Divider>
      <div className="tv-uiPreview tv-uiPreview__host">
        <HostDashboard />
      </div>
    </ClientSocket.Provider>
  );
}

export default App;
