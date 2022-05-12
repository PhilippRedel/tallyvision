import { Breadcrumb, Button, Collapse, Layout } from 'antd';
import { StarOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons';
import { useContext } from 'react';

import { AppContext } from '../context/App';
import { SocketContext } from '../context/Socket';
import ClientTable from './ClientTable';
import ContestantHeading from './ContestantHeading';
import PanelHeading from './PanelHeading';
import ScoreTable from './ScoreTable';

const { Content, Footer, Sider } = Layout;
const { Panel } = Collapse;

export default function HostController() {

  // variables
  const { ballot, clients, db, version } = useContext(AppContext);
  const {socket } = useContext(SocketContext);

  // functions
  const calculateAwards = () => {
    socket.emit('hostAwardsCalculate');
  }

  return (
    <div className="tv-controlPanel">
      <Layout>
        <Sider className="tv-controlPanel__sider" width={240}>
          <Collapse
            defaultActiveKey={['panel_clients', 'panel_ballot']}
            expandIconPosition="right"
            ghost
          >
            <Panel
              header={
                <PanelHeading
                  count={clients.length}
                  icon={<UserOutlined />}
                  title="Clients"
                />
              }
              key="panel_clients"
            >
              <ClientTable />
            </Panel>
            <Panel
              header={
                <PanelHeading
                  count={ballot.open ? 'Open' : 'Closed'}
                  icon={<StarOutlined />}
                  title="Ballot"
                />
              }
              key="panel_ballot"
            >
              <ContestantHeading contestant={ballot.contestant} />
            </Panel>
            <Panel
              header={
                <PanelHeading
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
        <Layout className="tv-controlPanel__wrapper">
          <Content className="tv-controlPanel__content">
            <Breadcrumb>
              <Breadcrumb.Item>DB</Breadcrumb.Item>
              <Breadcrumb.Item>{db}</Breadcrumb.Item>
            </Breadcrumb>
            <ScoreTable host />
            <Footer className="tv-controlPanel__footer">
              Version {version}
            </Footer>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
