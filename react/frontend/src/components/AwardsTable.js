import { Table } from 'antd';

import ContestantDetails from './ContestantDetails';

export default function AwardsTable({ dataSource, total }) {

  // variables
  const columns = [
    {
      align: 'center',
      className: 'tv-col--nowrap',
      key: 'place',
      render: (value, record, index) => (
        <strong>{index + 1}</strong>
      ),
      title: '#',
    },
    {
      align: 'left',
      dataIndex: 'code',
      key: 'code',
      render: (value, record) => (
        <span className="tv-txt--hidden">
          <ContestantDetails contestant={record} />
        </span>
      ),
      title: 'Contestant',
    },
    ...(total ? [
      {
        align: 'center',
        className: 'tv-col--min tv-col--nowrap',
        dataIndex: 'total',
        render: (value) => (
          <span className="tv-txt--hidden">{value}</span>
        ),
        title: 'Total',
      },
    ] : [
      {
        align: 'center',
        className: 'tv-col--min tv-col--nowrap',
        dataIndex: 'score',
        render: (value) => (
          <span className="tv-txt--hidden">{value}</span>
        ),
        title: 'Score',
      },
    ]),
  ];

  // component
  return (
    <Table
      bordered={false}
      className="tv-awardsTable"
      columns={columns}
      dataSource={dataSource}
      locale={{ emptyText: 'No contestants found' }}
      pagination={false}
      onRow={() => ({
        onClick: (event) => {
          var row = event.currentTarget;
          var rowHidden = row.getElementsByClassName('tv-txt--hidden');

          while (rowHidden.length > 0) {
            rowHidden[0].classList.remove('tv-txt--hidden');
          }
        },
      })}
    />
  );
}
