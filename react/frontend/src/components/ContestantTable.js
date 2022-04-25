import { Col, Row, Table } from 'antd';

import ContestantDetails from './ContestantDetails';
import RatingSummary from './RatingSummary';

export default function ContestantTable({ categories, dataSource, host }) {

  // variables
  const columns = [
    {
      align: 'left',
      dataIndex: 'country',
      key: 'country',
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
      showSorterTooltip: false,
      sorter: (a, b) => (a.votes ? a.votes : 0) - (b.votes ? b.votes : 0),
      title: 'Votes',
    }] : []),
    {
      align: 'center',
      className: 'tv-column--nowrap',
      dataIndex: 'total',
      showSorterTooltip: false,
      sorter: (a, b) => (a.total ? a.total : 0) - (b.total ? b.total : 0),
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
      dataSource={dataSource}
      /* expandable={{
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
        rowExpandable: (record) => record.total,
      }} */
      pagination={false}
    />
  );
}
