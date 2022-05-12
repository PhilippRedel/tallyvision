import { ControlOutlined } from '@ant-design/icons';
import { Badge, Card, Tabs } from 'antd';
import { useContext, useEffect, useState } from 'react';

import { SocketContext } from '../context/Socket';
import Container from './Container';
import ControlPanel from './ControlPanel';
import HostAuthForm from './HostAuthForm';

const { TabPane } = Tabs;

export default function HostTabs() {

  // variables
  const [tab, setTab] = useState('tab_auth');
  const { connected, socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on('connect', () => {
      setTab('tab_control');
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
      className="tv-tabs tv-tabs--host"
      onTabClick={setTab}
    >
      <TabPane
        disabled={connected}
        key="tab_auth"
        tab={<Badge
          status={(connected ? 'success' : 'error')}
          text="host"
        />}
      >
        <Container view="mobile">
          <Card bordered={false}>
            <HostAuthForm />
          </Card>
        </Container>
      </TabPane>
      {connected && <>
        <TabPane
          key="tab_control"
          tab={<ControlOutlined />}
        >
          <Container view="desktop">
            <ControlPanel />
          </Container>
        </TabPane>
      </>}
    </Tabs>
  );
}
