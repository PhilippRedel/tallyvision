import { Col, Row, Skeleton, Typography } from 'antd';

const { Text, Title } = Typography;

export default function ContestantHeading({ contestant }) {
  return (
    <Row className="tv-contestantHeading" wrap={false}>
      <Skeleton
        avatar={{ size: 32 }}
        loading={contestant.key ? false : true}
        paragraph={{ rows: 1 }}
        title
      >
        <Col className="tv-contestantHeading__flag" flex="32px">
          <img
            alt="Flag icon"
            src={process.env.PUBLIC_URL + '/media/flags/' + contestant.key + '.svg'}
          />
        </Col>
        <Col className="tv-contestantHeading__content" flex="auto">
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
