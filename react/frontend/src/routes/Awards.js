import { CrownOutlined, FrownOutlined, TrophyOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';

import { ioHost, SocketContext } from '../context/SocketContext';
import Container from '../components/Container';
import ScoreTable from '../components/ScoreTable';

import '../App.less';

export default function Awards() {

  // variables
  const { TabPane } = Tabs;

  // states
  const [app, setApp] = useState({
    categories: [],
    db: '',
    version: '',
  });
  const [view, setView] = useState('view_awards');

  useEffect(() => {
    ioHost.on('appConnected', (data) => {
      setApp(data);

      console.log('[App] Connected as host:', data);
    });

    return () => ioHost.disconnect();
  }, []);

  return (
    <Container viewport="desktop">
      <SocketContext.Provider value={ioHost.connect()}>
          <Tabs
            activeKey={view}
            centered
            className="tv-awardsTabs"
            onTabClick={setView}
          >
            <TabPane
              key="view_awards"
              tab={<TrophyOutlined />}
            >
              ...
            </TabPane>
            {app.categories.map((category) => (
              <TabPane
                key={`view_${category.key}`}
                tab={category.label}
              >
                <ScoreTable />
              </TabPane>
            ))}
            <TabPane
              key="view_gnbp"
              tab={<FrownOutlined />}
            >
              <ScoreTable />
            </TabPane>
            <TabPane
              key="view_total"
              tab={<CrownOutlined />}
            >
              <ScoreTable />
            </TabPane>
          </Tabs>
      </SocketContext.Provider>
    </Container>
  );
}
