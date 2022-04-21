import { Badge, Table } from 'antd';
import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons';

export default function SiderClientsTable({ clients }) {

  // variables
  const columns = [
    {
      align: 'left',
      key: 'col_client',
      render: (value, record) => (
        <Badge
          status={(record.connected ? 'success' : 'error')}
          text={record.name}
        />
      ),
      title: 'Client',
    },
    {
      align: 'center',
      className: 'tv-column__voted tv-column--nowrap',
      dataIndex: 'voted',
      key: 'col_voted',
      render: (value) => (
        value ? <CheckCircleFilled /> : <LoadingOutlined />
      ),
      title: 'Voted',
    },
  ];

  // component
  return (
    <Table
      bordered={false}
      className="tv-siderClientsTable"
      columns={columns}
      dataSource={clients}
      rowKey={(record) => `name_${record.name}`}
      pagination={false}
      showHeader={false}
      size="small"
    />
  );
}
