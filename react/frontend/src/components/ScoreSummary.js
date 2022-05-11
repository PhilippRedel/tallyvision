import { Col, Rate, Row, Typography } from 'antd';
import { useContext } from 'react';

import { AppContext } from '../context/App';

const { Text, Title } = Typography;

export default function ScoreSummary({ values }) {

  // variables
  const { categories } = useContext(AppContext);

  return (
    <div className="tv-scoreSummary">
      <Row justify="center">
        <Title className="tv-scoreSummary__total" level={1}>
          {values.total}
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
              value={values[`cat_${category.key}`]}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
