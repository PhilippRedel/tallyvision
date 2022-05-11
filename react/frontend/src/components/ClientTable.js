import { Badge, Table } from 'antd';
import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { useContext } from 'react';

import { AppContext } from '../context/App';

export default function ClientTable() {

  // variables
  const { ballot, clients } = useContext(AppContext);
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

  return (
    <Table
      bordered={false}
      className="tv-clientTable"
      columns={columns}
      dataSource={clients}
      locale={{ emptyText: 'No clients connected' }}
      pagination={false}
      rowKey={(record) => `name_${record.name}`}
      showHeader={false}
      size="small"
    />
  );
}
