import { Col, Row, Skeleton, Typography } from 'antd';

export default function ContestantDetails({ contestant }) {

  // variables
  const { Text, Title } = Typography;

  return (
    <Row className="tv-contestantDetails" wrap={false}>
      <Skeleton
        avatar={{ size: 32 }}
        loading={contestant.key ? false : true}
        paragraph={{ rows: 1 }}
        title
      >
        <Col className="tv-contestantDetails__flag">
          <img
            alt="Flag"
            src={process.env.PUBLIC_URL + '/media/flags/' + contestant.key + '.svg'}
          />
        </Col>
        <Col className="tv-contestantDetails__content" flex="auto">
          <Title level={5}>
            {contestant.country}
          </Title>
          <Text type="secondary">
            {contestant.artist} – "{contestant.title}"
          </Text>
        </Col>
      </Skeleton>
    </Row>
  );
}
