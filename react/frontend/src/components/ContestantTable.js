import { Col, Row, Table } from 'antd';

import ContestantDetails from './ContestantDetails';
import RatingSummary from './RatingSummary';

export default function ContestantTable({ categories, contestants, host }) {

  // variables
  const columns = [
    {
      align: 'left',
      dataIndex: ['artist', 'country', 'title'],
      key: 'col_contestant',
      render: (value, record) => (
        <ContestantDetails contestant={record} />
      ),
      showSorterTooltip: false,
      sorter: (a, b) => a.country.localeCompare(b.country),
      title: 'Contestant',
    },
    ...(host ? [{
      align: 'center',
      className: 'tv-column--nowrap',
      dataIndex: 'votes',
      key: 'col_votes',
      showSorterTooltip: false,
      sorter: (a, b) => a.total - b.total,
      title: 'Votes',
    }] : []),
    {
      align: 'center',
      className: 'tv-column--nowrap',
      dataIndex: 'total',
      key: 'col_total',
      showSorterTooltip: false,
      sorter: (a, b) => a.total - b.total,
      title: 'Total',
    },
    Table.EXPAND_COLUMN,
  ];

  // component
  return (
    <Table
      bordered={false}
      className="tv-contestantTable"
      columns={columns}
      dataSource={contestants}
      expandable={{
        expandedRowRender: () => (
          <Row className="" gutter={[16, 16]}>
            {categories.map((category) => (
              <Col key={category.key} md={6} xs={12}>
                <RatingSummary
                  category={category}
                  value={Math.floor(Math.random() * category.max)}
                />
              </Col>
            ))}
          </Row>
        ),
        // rowExpandable: (record) => record.total,
      }}
      pagination={false}
    />
  );
}
