import { useEffect, useState } from 'react';

import { AppContext } from '../context/App';
import { AwardsIO, SocketContext } from '../context/Socket';
import AwardTabs from '../components/AwardTabs';

export default function Awards() {

  // variables
  const [categories, setCategories] = useState([]);
  const [connected, setConnected] = useState(false);
  const [scoresCategory, setScoresCategory] = useState([]);
  const [scoresGNBP, setScoresGNBP] = useState([]);
  const [scoresTotal, setScoresTotal] = useState([]);

  useEffect(() => {
    AwardsIO.on('appConnected', (data) => {
      setCategories(data.categories);
      
      console.log('[App] Connected as awards:', data);
    });

    AwardsIO.on('appScoresCategory', (data) => {
      setScoresCategory(data);
      
      console.log('[App] Scores:', data);
    });

    AwardsIO.on('appScoresGNBP', (data) => {
      setScoresGNBP(data);
      
      console.log('[App] Scores:', data);
    });

    AwardsIO.on('appScoresTotal', (data) => {
      setScoresTotal(data);
      
      console.log('[App] Scores:', data);
    });

    AwardsIO.on('connect', () => {
      setConnected(AwardsIO.connected);      
    });

    AwardsIO.on('disconnect', () => {
      setConnected(AwardsIO.connected);
    });

    return () => AwardsIO.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{
      connected: connected,
      socket: AwardsIO,
    }}>
      <AppContext.Provider value={{
        categories: categories,
        scoresCategory: scoresCategory,
        scoresGNBP: scoresGNBP,
        scoresTotal: scoresTotal,
      }}>
        <AwardTabs />
      </AppContext.Provider>
    </SocketContext.Provider>
  )
}
