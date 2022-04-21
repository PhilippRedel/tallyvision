import { Breadcrumb, Layout, Collapse } from 'antd';
import { StarOutlined, UserOutlined } from '@ant-design/icons';

import ContestantDetails from './ContestantDetails';
import ContestantTable from './ContestantTable';
import SiderClientsTable from './SiderClientsTable';
import SiderHeader from './SiderHeader';

const { Content, Footer, Header, Sider } = Layout;
const { Panel } = Collapse;

export default function HostDashboard({ categories, clients, contestants }) {

  // component
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={240}>
        <div style={{ color: '#fff', height: '64px' }}></div>
        <Collapse
          className="tv-hostSider__collapse"
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
            header={<SiderHeader count="Open" icon={<StarOutlined />} title="Voting" />}
            key="key_voting"
          >
            <ContestantDetails
              contestant={{
                country: 'Country',
                code: 'gb',
                artist: 'Artist',
                title: 'Title',
                representative: '',
              }}
            />
          </Panel>
        </Collapse>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <ContestantTable categories={categories} contestants={contestants} host />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
}