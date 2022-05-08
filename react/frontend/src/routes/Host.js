import { Breadcrumb, Button, Card, Collapse, Layout, Tabs } from 'antd';
import {
  ControlOutlined, StarOutlined, TrophyOutlined, UserOutlined
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';

import { AppContext } from '../context/AppContext';
import { ioHost, SocketContext } from '../context/SocketContext';
import AuthForm from '../components/AuthForm';
import Container from '../components/Container';
import ContestantDetails from '../components/ContestantDetails';
import ScoreTable from '../components/ScoreTable';
import SiderClientsTable from '../components/SiderClientsTable';
import SiderHeading from '../components/SiderHeading';

export default function Host() {

  // variables
  const { Content, Footer, Sider } = Layout;
  const { Panel } = Collapse;
  const { TabPane } = Tabs;

  // states
  const [app, setApp] = useState({
    categories: [],
    db: '',
    version: '',
  });
  const [ballot, setBallot] = useState({
    contestant: {},
    open: false,
  });
  const [clients, setClients] = useState([]);
  const [scores, setScores] = useState([]);
  const [view, setView] = useState('tab_auth');

  // functions
  const calculateAwards = () => {
    ioHost.emit('hostAwardsCalculate');
  }

  useEffect(() => {
    ioHost.on('appBallot', setBallot);

    ioHost.on('appClients', setClients);

    ioHost.on('appConnected', (data) => {
      setApp(data);
      setView('tab_control');

      console.log('[App] Connected as host:', data);
    });

    ioHost.on('appScores', setScores);

    return () => ioHost.disconnect();
  }, []);

  return (
    <Container viewport="desktop">
      <SocketContext.Provider value={ioHost}>
        <AppContext.Provider value={{ app: app, ballot: ballot }}>
          <Tabs
            activeKey={view}
            animated
            centered
            className="tv-navTabs"
            onTabClick={setView}
          >
            <TabPane
              disabled={ioHost.connected}
              key="tab_auth"
              tab="HOST"
            >
              <Container className="tv-container--nopad" viewport="mobile">
                <Card bordered={false}>
                  <AuthForm />
                </Card>
              </Container>
            </TabPane>
            {ioHost.connected &&
              <TabPane
                disabled={!ioHost.connected}
                key="tab_control"
                tab={<ControlOutlined />}
              >
                <Layout className="tv-hostLayout__outer">
                  <Sider className="tv-hostLayout__sider" width={240}>
                    <Collapse
                      defaultActiveKey={['panel_clients', 'panel_ballot']}
                      expandIconPosition="right"
                      ghost
                    >
                      <Panel
                        header={
                          <SiderHeading
                            count={clients.length}
                            icon={<UserOutlined />}
                            title="Clients"
                          />
                        }
                        key="panel_clients"
                      >
                        <SiderClientsTable dataSource={clients} />
                      </Panel>
                      <Panel
                        header={
                          <SiderHeading
                            count={ballot.open ? 'Open' : 'Closed'}
                            icon={<StarOutlined />}
                            title="Ballot"
                          />
                        }
                        key="panel_ballot"
                      >
                        <ContestantDetails contestant={ballot.contestant} />
                      </Panel>
                      <Panel
                        header={
                          <SiderHeading
                            icon={<TrophyOutlined />}
                            title="Awards"
                          />
                        }
                        key="panel_awards"
                      >
                        <Button
                          block
                          ghost
                          onClick={calculateAwards}
                          type="primary"
                        >
                          Calculate
                        </Button>
                      </Panel>
                    </Collapse>
                  </Sider>
                  <Layout className="tv-hostLayout__inner">
                    <Content className="tv-hostLayout__content">
                      <Breadcrumb>
                        <Breadcrumb.Item>DB</Breadcrumb.Item>
                        <Breadcrumb.Item>{app.db}</Breadcrumb.Item>
                      </Breadcrumb>
                      <ScoreTable dataSource={scores} host />
                      <Footer className="tv-hostLayout__footer">
                        Version <span className="ver">{app.version}</span>
                      </Footer>
                    </Content>
                  </Layout>
                </Layout>
              </TabPane>
            }
          </Tabs>
        </AppContext.Provider>
      </SocketContext.Provider>
    </Container>
  );
}
