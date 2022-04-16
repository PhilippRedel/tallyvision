import { Col, Row, Typography } from 'antd';

export default function ContestantDetails({ contestant }) {
  const { Text, Title } = Typography;

  return (
    <Row className="tv-contestantDetails" wrap={false}>
      <Col className="tv-contestantDetails__flag" flex="2.875rem">
        <img alt="" src={process.env.PUBLIC_URL + '/media/flags/' + contestant.code + '.svg'} />
      </Col>
      <Col className="tv-contestantDetails__content" flex="auto">
        <Title level={5}>
          {contestant.country}
        </Title>
        <Text type="secondary">
          {contestant.artist} – "{contestant.title}"
        </Text>
      </Col>
    </Row>
  );
}
