import { Col, Rate, Row, Typography } from 'antd';

export default function RatingSummary({ categories, dataSource }) {

  // variables
  const { Text, Title } = Typography;

  return (
    <div className="tv-ratingSummary">
      <Row justify="center">
        <Title className="tv-ratingSummary__total" level={1}>
          {dataSource.total}
        </Title>
      </Row>
      <Row gutter={[32, 16]}>
        {categories.map((category) => (
          <Col key={category.key} xs={12}>
            <Text>
              {category.label}
            </Text>
            <Rate
              count={category.max}
              disabled
              value={dataSource[`cat_${category.key}`]}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
