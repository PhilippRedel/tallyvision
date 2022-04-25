import { Breadcrumb, Layout, Collapse } from 'antd';
import { StarOutlined, UserOutlined } from '@ant-design/icons';

import ContestantDetails from './ContestantDetails';
import ContestantTable from './ContestantTable';
import SiderClientsTable from './SiderClientsTable';
import SiderHeader from './SiderHeader';

const { Content, Footer, Header, Sider } = Layout;
const { Panel } = Collapse;

export default function HostDashboard({ categories, clients, scoreData }) {

  // component
  return (
    <Layout className="tv-hostDashboard">
      <Sider className="tv-hostDashboard__sider" width={240}>
        <Collapse
          defaultActiveKey={['key_clients', 'key_voting']}
          expandIconPosition="right"
          ghost
        >
          <Panel
            className="tv-hostSider__clients"
            header={<SiderHeader count={clients.length} icon={<UserOutlined />} title="Clients" />}
            key="key_clients"
          >
            <SiderClientsTable clients={clients} />
          </Panel>
          <Panel
            className="tv-hostSider__voting"
            header={<SiderHeader count="Closed" icon={<StarOutlined />} title="Voting" />}
            key="key_voting"
          >
            <ContestantDetails contestant={{}} />
          </Panel>
        </Collapse>
      </Sider>
      <Layout>
        <Header className="tv-hostDashboard__header" />
        <Content className="tv-hostDashboard__content">
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>DB</Breadcrumb.Item>
            <Breadcrumb.Item>2022-04-20.db</Breadcrumb.Item>
          </Breadcrumb>
          <ContestantTable categories={categories} dataSource={scoreData} host />
        </Content>
        <Footer className="tv-hostDashboard__footer">
          Version 22.04.22
        </Footer>
      </Layout>
    </Layout>
  );
}