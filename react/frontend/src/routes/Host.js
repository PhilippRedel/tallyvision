import { useEffect, useState } from 'react';

import { AppContext } from '../context/App';
import { HostIO, SocketContext } from '../context/Socket';
import HostTabs from '../components/HostTabs';

export default function Host() {

  // variables
  const [app, setApp] = useState({
    db: '',
    version: '',
  });
  const [ballot, setBallot] = useState({
    contestant: {},
    open: false,
  });
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [connected, setConnected] = useState(false);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    HostIO.on('appBallot', (data) => {
      setBallot(data);
      
      console.log('[App] Ballot:', data);
    });

    HostIO.on('appClients', (data) => {
      setClients(data);
      
      console.log('[App] Clients:', data);
    });

    HostIO.on('appConnected', (data) => {
      setApp({
        db: data.db,
        version: data.version,
      });
      setCategories(data.categories);
      
      console.log('[App] Connected as host:', data);
    });

    HostIO.on('appScores', (data) => {
      setScores(data);
      
      console.log('[App] Scores:', data);
    });

    HostIO.on('connect', () => {
      setConnected(HostIO.connected);      
    });

    HostIO.on('disconnect', () => {
      setConnected(HostIO.connected);
    });

    return () => HostIO.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{
      connected: connected,
      socket: HostIO,
    }}>
      <AppContext.Provider value={{
        ballot: ballot,
        categories: categories,
        db: app.db,
        clients: clients,
        scores: scores,
        version: app.version,
      }}>
        <HostTabs />
      </AppContext.Provider>
    </SocketContext.Provider>
  )
}
