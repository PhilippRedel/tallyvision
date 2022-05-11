import { Table } from 'antd';
import { useContext } from 'react';

import { AppContext } from '../context/App';
import BallotSwitch from './BallotSwitch';
import ContestantHeading from './ContestantHeading';
import ScoreSummary from './ScoreSummary';

export default function ScoreTable({ host }) {

  // variables
  const columns = [
    {
      align: 'left',
      dataIndex: 'code',
      key: 'code',
      render: (value, record) => (
        <ContestantHeading contestant={record} />
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
  const { scores } = useContext(AppContext);

  return (
    <Table
      bordered={false}
      className="tv-table tv-table--score"
      columns={columns}
      dataSource={scores}
      expandable={host
        ? false
        : {
          expandedRowRender: (record) => (
            <ScoreSummary values={record} />
          ),
          expandRowByClick: true,
          rowExpandable: (record) => record.total !== undefined,
          showExpandColumn: false,
        }}
      locale={{ emptyText: 'No contestants found' }}
      pagination={false}
    />
  );
}
