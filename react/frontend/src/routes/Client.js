import { useEffect, useState } from 'react';

import { AppContext } from '../context/App';
import { ClientIO, SocketContext } from '../context/Socket';
import ClientTabs from '../components/ClientTabs';

export default function Client() {

  // variables
  const [ballot, setBallot] = useState({
    contestant: {},
    open: false,
  });
  const [ballotScore, setBallotScore] = useState({});
  const [categories, setCategories] = useState([]);
  const [connected, setConnected] = useState(false);
  const [scores, setScores] = useState([]);
  const [name, setName] = useState('tallyvision');

  useEffect(() => {
    ClientIO.on('appBallot', (data) => {
      setBallot(data);
      
      console.log('[App] Ballot:', data);
    });

    ClientIO.on('appBallotScore', (data) => {
      setBallotScore(data);
      
      console.log('[App] Ballot score:', data);
    });

    ClientIO.on('appConnected', (data) => {
      setCategories(data.categories);
      setName(data.name);
      
      console.log('[App] Connected as client:', data.name);
    });

    ClientIO.on('appScores', (data) => {
      setScores(data);
      
      console.log('[App] Scores:', data);
    });

    ClientIO.on('connect', () => {
      setConnected(ClientIO.connected);      
    });

    ClientIO.on('disconnect', () => {
      setConnected(ClientIO.connected);
      setName('tallyvision');
    });

    return () => ClientIO.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{
      connected: connected,
      socket: ClientIO,
    }}>
      <AppContext.Provider value={{
        ballot: ballot,
        ballotScore: ballotScore,
        categories: categories,
        name: name,
        scores: scores,
      }}>
        <ClientTabs />
      </AppContext.Provider>
    </SocketContext.Provider>
  )
}
