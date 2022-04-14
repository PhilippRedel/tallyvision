import { Col, Row, Typography } from 'antd';

export default function ContestantDetails({ contestant }) {
  const { Text, Title } = Typography;

  return (
    <Row className="tv-contestantDetails">
      <Col className="tv-contestantDetails__flag">
        <img alt="" src={process.env.PUBLIC_URL + '/media/flags/' + contestant.code + '.svg'} width="48px" />
      </Col>
      <Col className="tv-contestantDetails__content">
        <Title level={5}>
          {contestant.country}
        </Title>
        <Text type="secondary">
          {[contestant.artist, contestant.title].join(' – ')}
        </Text>
      </Col>
    </Row>
  );
}
