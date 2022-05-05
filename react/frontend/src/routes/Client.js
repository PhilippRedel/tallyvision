import { Tabs } from 'antd';
import { ProfileOutlined, StarOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

import { BallotContext } from '../context/BallotContext';
import { ioClient, SocketContext } from '../context/SocketContext';
import ClientBallot from '../components/ClientBallot';
import ClientRegistration from '../components/ClientRegistration';
import Container from '../components/Container';
import ScoreTable from '../components/ScoreTable';

import '../App.less';

export default function Client() {

  // variables
  const { TabPane } = Tabs;

  // states
  const [app, setApp] = useState({
    categories: [],
    name: 'TALLYVISION',
  });
  const [ballot, setBallot] = useState({
    contestant: {},
    open: false,
  });
  const [ballotScore, setBallotScore] = useState({});
  const [scores, setScores] = useState([]);
  const [view, setView] = useState('view_registration');

  useEffect(() => {
    ioClient.on('appBallot', (data) => {
      setBallot(data);

      if (data.open) {
        setView('view_ballot');
      } else {
        setView('view_scoretable');
      }
      
      console.log('[App] Ballot:', data);
    });

    ioClient.on('appBallotScore', (data) => {
      setBallotScore(data);
      
      console.log('[App] Ballot score:', data);
    });

    ioClient.on('appConnected', (data) => {
      setApp(data);
      setView('view_scoretable');
      
      console.log('[App] Connected as client:', data.name);
    });

    ioClient.on('appScores', (data) => {
      setScores(data);
      
      console.log('[App] Scores:', data);
    });

    return () => ioClient.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={ioClient}>
      <BallotContext.Provider value={{
        ballot: ballot,
        ballotScore: ballotScore
      }}>
        <Container viewport="mobile">
          <Tabs
            activeKey={view}
            centered
            className="tv-clientTabs"
            onTabClick={setView}
          >
            <TabPane
              disabled={ioClient.connected}
              key="view_registration"
              tab={app.name}
            >
              <ClientRegistration />
            </TabPane>
            <TabPane
              disabled={!ioClient.connected}
              key="view_scoretable"
              tab={<ProfileOutlined />}
            >
              <ScoreTable categories={app.categories} dataSource={scores} />
            </TabPane>
            <TabPane
              disabled={!ioClient.connected || !ballot.open}
              key="view_ballot"
              tab={<StarOutlined />}
            >
              <ClientBallot categories={app.categories} />
            </TabPane>
          </Tabs>
        </Container>
      </BallotContext.Provider>
    </SocketContext.Provider>
  );
}
