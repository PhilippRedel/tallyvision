import { Breadcrumb, Button, Collapse, Layout } from 'antd';
import { StarOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';

import { AppContext } from '../context/AppContext';
import { ioHost, SocketContext } from '../context/SocketContext';
import Container from '../components/Container';
import ContestantDetails from '../components/ContestantDetails';
import ScoreTable from '../components/ScoreTable';
import SiderClientsTable from '../components/SiderClientsTable';
import SiderHeading from '../components/SiderHeading';

export default function Host() {

  // variables
  const { Content, Footer, Sider } = Layout;
  const { Panel } = Collapse;

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

  // functions
  const calculateAwards = () => {
    ioHost.emit('hostAwardsCalculate');
  }

  useEffect(() => {
    ioHost.on('appBallot', setBallot);

    ioHost.on('appClients', setClients);

    ioHost.on('appConnected', (data) => {
      setApp(data);

      console.log('[App] Connected as host:', data);
    });

    ioHost.on('appScores', setScores);

    return () => ioHost.disconnect();
  }, []);

  return (
    <Container viewport="desktop">
      <SocketContext.Provider value={ioHost.connect()}>
        <AppContext.Provider value={{ app: app, ballot: ballot }}>
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
        </AppContext.Provider>
      </SocketContext.Provider>
    </Container>
  );
}
