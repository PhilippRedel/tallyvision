import { CrownOutlined, FrownOutlined, TrophyOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';

import { AppContext } from '../context/AppContext';
import { ioHost, SocketContext } from '../context/SocketContext';
import AwardsTable from '../components/AwardsTable';
import Container from '../components/Container';

export default function Awards() {

  // variables
  const { TabPane } = Tabs;

  // states
  const [app, setApp] = useState({
    categories: [],
    db: '',
    version: '',
  });
  const [awardsCategory, setAwardsCategory] = useState([]);
  const [awardsGNBP, setAwardsGNBP] = useState([]);
  const [awardsTotal, setAwardsTotal] = useState([]);
  const [view, setView] = useState('view_awards');

  useEffect(() => {
    ioHost.on('appAwardsCategory', (data) => {
      setAwardsCategory(data);

      console.log('[App] Category awards:', data);
    });

    ioHost.on('appAwardsGNBP', (data) => {
      setAwardsGNBP(data);

      console.log('[App] GNBP awards:', data);
    });

    ioHost.on('appAwardsTotal', (data) => {
      setAwardsTotal(data);

      console.log('[App] Total awards:', data);
    });

    ioHost.on('appConnected', (data) => {
      setApp(data);

      console.log('[App] Connected as host:', data);
    });

    return () => ioHost.disconnect();
  }, []);

  return (
    <Container viewport="television">
      <SocketContext.Provider value={ioHost.connect()}>
        <AppContext.Provider value={{ app: app }}>
          <Tabs
            activeKey={view}
            animated
            centered
            className="tv-awardsTabs"
            onTabClick={setView}
          >
            <TabPane
              key="view_awards"
              tab={<TrophyOutlined />}
            >
              <div className="tv-awardsBanner">
                <div className="tv-awardsBanner__image">
                  <img
                    alt="People's choice awards trophy"
                    src={process.env.PUBLIC_URL + '/media/trophy.gif'}
                  />
                </div>
                <div className="tv-awardsBanner__text">
                  {/*}
                  <div class="sign">
                    P<span class="fast-flicker">e</span>ople's
                  </div>
                  <div class="sign">
                    Choice
                  </div>
                  <div class="sign">
                    Awa<span class="fast-flicker">r</span>ds 202<span class="flicker">2</span>
                  </div>
                  */}
                  <div class="sign">
                    People's
                  </div>
                  <div class="sign">
                    Choice
                  </div>
                  <div class="sign">
                    Awards 2022
                  </div>
                </div>
              </div>
            </TabPane>
            {app.categories.map((category) => (
              <TabPane
                key={`view_${category.key}`}
                tab={category.label}
              >
                <AwardsTable dataSource={awardsCategory[category.key]} />
              </TabPane>
            ))}
            <TabPane
              key="view_gnbp"
              tab={<FrownOutlined />}
            >
              <AwardsTable dataSource={awardsGNBP} />
            </TabPane>
            <TabPane
              key="view_total"
              tab={<CrownOutlined />}
            >
              <AwardsTable
                categories={app.categories}
                dataSource={awardsTotal}
                total 
              />
            </TabPane>
          </Tabs>
        </AppContext.Provider>
      </SocketContext.Provider>
    </Container>
  );
}
