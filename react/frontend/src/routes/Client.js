import { CookiesProvider } from 'react-cookie';
import { ProfileOutlined, StarOutlined } from '@ant-design/icons';
import { Card, Tabs } from 'antd';
import { useCookies } from 'react-cookie';
import React, { useEffect, useState } from 'react';

import { AppContext } from '../context/AppContext';
import { ioClient, SocketContext } from '../context/SocketContext';
import Ballot from '../components/Ballot';
import Container from '../components/Container';
import RegistrationForm from '../components/RegistrationForm';
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
  const [view, setView] = useState('tab_auth');

  // cookies
  const [cookies, setCookie] = useCookies(['client']);

  useEffect(() => {
    ioClient.on('appBallot', (data) => {
      setBallot(data);

      if (data.open) {
        setView('tab_ballot');
      } else {
        setView('tab_scores');
      }
      
      console.log('[App] Ballot:', data);
    });

    ioClient.on('appBallotScore', (data) => {
      setBallotScore(data);
      
      console.log('[App] Ballot score:', data);
    });

    ioClient.on('appConnected', (data) => {
      setApp(data);
      setView('tab_scores');
      
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
              className="tv-navTabs"
              onTabClick={setView}
            >
              <TabPane
                disabled={ioClient.connected}
                key="tab_auth"
                tab={app.name}
              >
                <Card bordered={false}>
                  <RegistrationForm />
                </Card>
              </TabPane>
              {ioClient.connected &&
                <>
                  <TabPane
                    disabled={!ioClient.connected}
                    key="tab_scores"
                    tab={<ProfileOutlined />}
                  >
                    <ScoreTable dataSource={scores} />
                  </TabPane>
                  <TabPane
                    disabled={!ioClient.connected || !ballot.open}
                    key="tab_ballot"
                    tab={<StarOutlined />}
                  >
                    <Ballot />
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
