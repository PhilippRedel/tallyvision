import { Col, Rate, Row, Typography } from 'antd';
import { useContext } from 'react';

import { AppContext } from '../context/AppContext';

export default function RatingSummary({ values }) {

  // variables
  const { app } = useContext(AppContext);
  const { Text, Title } = Typography;

  return (
    <div className="tv-ratingSummary">
      <Row justify="center">
        <Title className="tv-ratingSummary__total" level={1}>
          {values.total}
        </Title>
      </Row>
      <Row gutter={[32, 16]}>
        {app.categories.map((category) => (
          <Col key={category.key} xs={12}>
            <Text>
              {category.label}
            </Text>
            <Rate
              count={category.max}
              disabled
              value={values[`cat_${category.key}`]}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
