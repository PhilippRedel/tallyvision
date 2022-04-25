import { Breadcrumb, Layout, Collapse } from 'antd';
import { io } from 'socket.io-client';
import { StarOutlined, UserOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';

import { SocketContext } from '../context/SocketContext';
import Preview from '../components/Preview';
import SiderClientsTable from '../components/SiderClientsTable';
import SiderHeading from '../components/SiderHeading';

import '../App.less';

const { Content, Footer, Header, Sider } = Layout;
const { Panel } = Collapse;
const socket = io('http://localhost:3030/host').connect();

export default function Client() {
  const [appData, setAppData] = useState({
    categories: [],
    database: '',
    version: '',
  });
  const [clients, setClients] = useState([]);
  const [scoreData, setScoreData] = useState([]);

  useEffect(() => {
    socket.on('appClients', (clients) => {
      setClients(clients);
    });

    socket.on('appConnected', (data) => {
      setAppData(data);

      console.log('[App] Connected as host:', data);
    });

    socket.on('appScoreData', (scoreData) => {
      setScoreData(scoreData);      
    });

    return () => socket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <Preview viewport="desktop">
        <Layout className="tv-host">
          <Sider className="tv-host__sider" width={240}>
            <Collapse
              defaultActiveKey={['key_clients', 'key_voting']}
              expandIconPosition="right"
              ghost
            >
              <Panel
                className="tv-hostSider__clients"
                header={<SiderHeading count={clients.length} icon={<UserOutlined />} title="Clients" />}
                key="key_clients"
              >
                <SiderClientsTable dataSource={clients} />
              </Panel>
              <Panel
                className="tv-hostSider__voting"
                header={<SiderHeading count="Closed" icon={<StarOutlined />} title="Voting" />}
                key="key_voting"
              >
                ...
              </Panel>
            </Collapse>
          </Sider>
          <Layout>
            <Header className="tv-host__header" />
            <Content className="tv-host__content">
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>DB</Breadcrumb.Item>
                <Breadcrumb.Item>{appData.database}</Breadcrumb.Item>
              </Breadcrumb>
            </Content>
            <Footer className="tv-host__footer">
              Version <span className="ver">{appData.version}</span>
            </Footer>
          </Layout>
        </Layout>
      </Preview>
    </SocketContext.Provider>
  );
}
