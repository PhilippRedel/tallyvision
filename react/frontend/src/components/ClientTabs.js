import { ProfileOutlined, StarOutlined } from '@ant-design/icons';
import { Badge, Card, Tabs } from 'antd';
import { useContext, useEffect, useState } from 'react';

import { AppContext } from '../context/App';
import { SocketContext } from '../context/Socket';
import Ballot from './Ballot';
import ClientAuthForm from './ClientAuthForm';
import Container from './Container';
import ScoreTable from './ScoreTable';

const { TabPane } = Tabs;

export default function ClientTabs() {

  // variables
  const [tab, setTab] = useState('tab_auth');
  const { connected, socket } = useContext(SocketContext);
  const { ballot, name } = useContext(AppContext);

  useEffect(() => {
    socket.on('appBallot', (data) => {
      if (data.open) {
        setTab('tab_ballot');
      } else {
        setTab('tab_scores');
      }
    });

    socket.on('connect', () => {
      setTab('tab_scores');
    });

    socket.on('disconnect', () => {
      setTab('tab_auth');
    });
  }, [socket]);

  return (
    <Tabs
      activeKey={tab}
      animated
      centered
      className="tv-tabs tv-tabs--client"
      onTabClick={setTab}
    >
      <TabPane
        disabled={connected}
        key="tab_auth"
        tab={<Badge
          status={(connected ? 'success' : 'error')}
          text={name}
        />}
      >
        <Container view="mobile">
          <Card bordered={false}>
            <ClientAuthForm />
          </Card>
        </Container>
      </TabPane>
      {connected &&
        <>
          <TabPane
            key="tab_scores"
            tab={<ProfileOutlined />}
          >
            <Container view="mobile">
              <ScoreTable />
            </Container>
          </TabPane>
          <TabPane
            disabled={!ballot.open}
            key="tab_ballot"
            tab={<StarOutlined />}
          >
            <Container view="mobile">
              <Ballot />
            </Container>
          </TabPane>
        </>
      }
    </Tabs>
  );
}
