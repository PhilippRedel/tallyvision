import { CookiesProvider } from 'react-cookie';
import { ProfileOutlined, StarOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { useCookies } from 'react-cookie';
import React, { useEffect, useState } from 'react';

import { AppContext } from '../context/AppContext';
import { ioClient, SocketContext } from '../context/SocketContext';
import ClientBallot from '../components/ClientBallot';
import ClientRegistration from '../components/ClientRegistration';
import Container from '../components/Container';
import ScoreTable from '../components/ScoreTable';

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

  // cookies
  const [cookies, setCookie] = useCookies(['client']);

  useEffect(() => {
    ioClient.on('appBallot', (data) => {
      setBallot(data);

      if (data.open) {
        setView('view_ballot');
      } else {
        setView('view_scores');
      }
      
      console.log('[App] Ballot:', data);
    });

    ioClient.on('appBallotScore', (data) => {
      setBallotScore(data);
      
      console.log('[App] Ballot score:', data);
    });

    ioClient.on('appConnected', (data) => {
      setApp(data);
      setView('view_scores');
      
      console.log('[App] Connected as client:', data.name);
    });

    ioClient.on('appScores', (data) => {
      setScores(data);
      
      console.log('[App] Scores:', data);
    });

    return () => ioClient.disconnect();
  }, []);

  useEffect(() => {
    ioClient.on('appConnected', (data) => {
      setCookie('tv_client_name', data.name, { path: '/' });
    });
  }, [setCookie]);

  return (
    <Container viewport="mobile">
      <CookiesProvider>
        <SocketContext.Provider value={ioClient}>
          <AppContext.Provider value={{
            app: app,
            ballot: ballot,
            ballotScore: ballotScore,
          }}>
            <Tabs
              activeKey={view}
              animated
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
              {ioClient.connected &&
                <>
                  <TabPane
                    disabled={!ioClient.connected}
                    key="view_scores"
                    tab={<ProfileOutlined />}
                  >
                    <ScoreTable dataSource={scores} />
                  </TabPane>
                  <TabPane
                    disabled={!ioClient.connected || !ballot.open}
                    key="view_ballot"
                    tab={<StarOutlined />}
                  >
                    <ClientBallot />
                  </TabPane>
                </>
              }
            </Tabs>
          </AppContext.Provider>
        </SocketContext.Provider>
      </CookiesProvider>
    </Container>
  );
}
