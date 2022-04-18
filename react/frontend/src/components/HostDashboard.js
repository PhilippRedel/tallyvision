import { Layout, Menu, Breadcrumb, Badge } from 'antd';
import {
  QuestionOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ContestantDetails from './ContestantDetails';
import StatusTitle from './StatusTitle';
import ContestantTable from './ContestantTable';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function HostDashboard({ categories, contestants }) {

  // variables
  const columns = [
    {
      align: 'left',
      dataIndex: ['artist', 'country', 'title'],
      key: 'contestant',
      render: (value, record) => (
        <ContestantDetails contestant={record} />
      ),
      showSorterTooltip: false,
      sorter: (a, b) => a.country.localeCompare(b.country),
      title: 'Contestant',
    },
    {
      align: 'center',
      className: 'tv-column__votes',
      dataIndex: 'votes',
      key: 'votes',
      showSorterTooltip: false,
      sorter: (a, b) => a.total - b.total,
      title: 'Votes',
    },
    {
      align: 'center',
      className: 'tv-column__total',
      dataIndex: 'total',
      key: 'total',
      showSorterTooltip: false,
      sorter: (a, b) => a.total - b.total,
      title: 'Total',
    },
  ];

  // component
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        Host Dashboard
        <Menu
          defaultOpenKeys={['sub1', 'sub2']}
          mode="inline"
          selectable={false}
          theme="dark"
        >
          <SubMenu key="sub1" icon={<UserOutlined />} title={<StatusTitle status={3} title="Clients" />}>
            <Menu.Item key="1">
              <Badge status="success" /> Dan
            </Menu.Item>
            <Menu.Item key="2">
              <Badge status="error" /> Marty
            </Menu.Item>
            <Menu.Item key="3">
              <Badge status="success" /> Zach
            </Menu.Item>
          </SubMenu>
          <SubMenu icon={<StarOutlined />} key="sub2" title={<StatusTitle status="Closed" title="Voting" />}>
            <Menu.Item key="4">
              <ContestantDetails contestant={
                {
                  country: 'Country',
                  code: 'gb',
                  artist: 'Artist',
                  title: 'Title',
                  representative: '',
                }
              } />
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="5" icon={<QuestionOutlined />}>
            Option
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <ContestantTable categories={categories} columns={columns} contestants={contestants} />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
}