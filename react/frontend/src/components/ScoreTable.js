import { Table } from 'antd';

import BallotSwitch from './BallotSwitch';
import ContestantDetails from './ContestantDetails';
import RatingSummary from './RatingSummary';

export default function ScoreTable({ categories, dataSource, host }) {

  // variables
  const columns = [
    {
      align: 'left',
      dataIndex: 'code',
      key: 'code',
      render: (value, record) => (
        <ContestantDetails contestant={record} />
      ),
      showSorterTooltip: false,
      sorter: (a, b) => a.country.localeCompare(b.country),
      title: 'Contestant',
    },
    ...(host ? [
      {
        align: 'center',
        className: 'tv-col--min tv-col--nowrap',
        key: 'ballot',
        render: (value, record) => (
          <BallotSwitch dataTarget={record} />
        ),
        title: 'Ballot',
      },
      {
        align: 'center',
        className: 'tv-col--min tv-col--nowrap',
        dataIndex: 'votes',
        title: 'Votes',
      },
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
        className: 'tv-col--nowrap',
        dataIndex: 'total',
        showSorterTooltip: false,
        sorter: (a, b) => (a.total ? a.total : 0) - (b.total ? b.total : 0),
        title: 'Total',
      },
    ]),
  ];

  // component
  return (
    <Table
      bordered={false}
      className="tv-scoreTable"
      columns={columns}
      dataSource={dataSource}
      expandable={host
        ? false
        : {
          expandedRowRender: (record) => (
            <RatingSummary values={record} xs={12} />
          ),
          expandRowByClick: true,
          expandedRowClassName: () => 'debug',
          rowExpandable: (record) => record.total,
          showExpandColumn: false,
        }}
      locale={{ emptyText: 'No contestants found' }}
      pagination={false}
    />
  );
}
