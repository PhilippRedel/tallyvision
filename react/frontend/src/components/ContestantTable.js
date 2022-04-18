import { Col, Row, Table } from 'antd';

import RatingSummary from './RatingSummary';

export default function ContestantTable({ categories, columns, contestants }) {

  columns.push(Table.EXPAND_COLUMN);

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
