import { Table } from 'antd';

import ContestantHeading from './ContestantHeading';

export default function AwardTable({ dataSource, total }) {

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
      render: (value, record) => (
        <span className="tv-txt--hidden">
          <ContestantHeading contestant={record} />
        </span>
      ),
      title: 'Contestant',
    },
    {
      align: 'left',
      className: 'tv-col--min tv-col--nowrap',
      dataIndex: 'representative',
      render: (value) => (
        <span className="tv-txt--hidden">{value}</span>
      ),
      title: 'Representative',
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

  // functions
  const rowReveal = (event) => {
    var row = event.currentTarget;
    var rowHidden = row.getElementsByClassName('tv-txt--hidden');

    while (rowHidden.length > 0) {
      rowHidden[0].classList.remove('tv-txt--hidden');
    }
  }

  return (
    <Table
      bordered={false}
      className="tv-table tv-table--awards"
      columns={columns}
      dataSource={dataSource}
      locale={{ emptyText: 'No contestants found' }}
      pagination={false}
      onRow={() => ({
        onClick: rowReveal,
      })}
    />
  );
}
