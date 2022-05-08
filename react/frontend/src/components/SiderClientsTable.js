import { Badge, Table } from 'antd';
import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { useContext } from 'react';

import { AppContext } from '../context/AppContext';

export default function SiderClientsTable({ dataSource }) {

  // variables
  const { ballot } = useContext(AppContext);
  const columns = [
    {
      align: 'left',
      className: 'tv-col__name',
      key: 'col_name',
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
      className: 'tv-col__voted tv-col--nowrap',
      dataIndex: 'voted',
      key: 'col_voted',
      render: (value) => {
        if (ballot.open) {
          return value ? <CheckCircleFilled /> : <LoadingOutlined />
        }
      },
      title: 'Voted',
    },
  ];

  // component
  return (
    <Table
      bordered={false}
      className="tv-siderClientsTable"
      columns={columns}
      dataSource={dataSource}
      locale={{ emptyText: 'No clients connected' }}
      pagination={false}
      rowKey={(record) => `name_${record.name}`}
      showHeader={false}
      size="small"
    />
  );
}
