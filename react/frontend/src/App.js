import React, { useState, useEffect } from 'react';
import { ClientSocket, socket } from './context/ClientSocket';

// ...
import { Divider } from 'antd';

// ...
import ClientBallot from './components/ClientBallot';
import ClientScorecard from './components/ClientScorecard';

import './App.less';

function App() {
  const [categories, setCategories] = useState([]);
  const [contestants, setContestants] = useState([]);

  useEffect(() => {
    socket.on('appBallotTally', (data) => {
      console.log(data);
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
      <Divider orientation="left">Client ballot</Divider>
      <div className="tv-uiPreview">
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
      <div className="tv-uiPreview">
        <ClientScorecard
          categories={categories}
          contestants={contestants}
        />
      </div>
    </ClientSocket.Provider>
  );
}

export default App;
