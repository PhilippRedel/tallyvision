import { Col, Row, Table } from 'antd';

import ContestantDetails from './ContestantDetails';
import RatingSummary from './RatingSummary';

export default function ClientScorecard({ categories, contestants }) {

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
      className: 'tv-column__total',
      dataIndex: 'total',
      key: 'total',
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
      columns={columns}
      dataSource={contestants}
      expandable={{
        expandedRowRender: (record) => (
          <div className="">
            <Row gutter={[16, 16]}>
              {categories.map((category) => (
                <Col key={category.key} md={6} xs={12}>
                  <RatingSummary
                    category={category}
                    value={Math.floor(Math.random() * category.max)}
                  />
                </Col>
              ))}
            </Row>
          </div>
        ),
        // rowExpandable: (record) => record.total,
      }}
      id="clientScorecard"
      pagination={false}
    />
  );
}
