import { Breadcrumb, Collapse, Layout } from 'antd';
import { StarOutlined, UserOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';

import { BallotContext } from '../context/BallotContext';
import { ioHost, SocketContext } from '../context/SocketContext';
import Container from '../components/Container';
import ContestantDetails from '../components/ContestantDetails';
import ScoreTable from '../components/ScoreTable';
import SiderClientsTable from '../components/SiderClientsTable';
import SiderHeading from '../components/SiderHeading';

import '../App.less';

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
        <BallotContext.Provider value={ballot}>
          <Layout className="tv-hostLayout__outer">
            <Sider className="tv-hostLayout__sider" width={240}>
              <Collapse
                defaultActiveKey={['key_clients', 'key_voting']}
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
                  key="key_clients"
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
                  key="key_voting"
                >
                  <ContestantDetails contestant={ballot.contestant} />
                </Panel>
              </Collapse>
            </Sider>
            <Layout className="tv-hostLayout__inner">
              <Content className="tv-hostLayout__content">
                <Breadcrumb>
                  <Breadcrumb.Item>DB</Breadcrumb.Item>
                  <Breadcrumb.Item>{app.db}</Breadcrumb.Item>
                </Breadcrumb>
                <ScoreTable
                  categories={app.categories}
                  dataSource={scores}
                  host
                />
                <Footer className="tv-hostLayout__footer">
                  Version <span className="ver">{app.version}</span>
                </Footer>
              </Content>
            </Layout>
          </Layout>
        </BallotContext.Provider>
      </SocketContext.Provider>
    </Container>
  );
}
