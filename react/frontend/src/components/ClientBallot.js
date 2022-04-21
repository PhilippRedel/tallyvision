import { Card, Col, Row } from 'antd';
import { useContext } from 'react';

import { SocketContext } from '../context/SocketContext';
import ContestantDetails from './ContestantDetails';
import GNBB from './GNBB';
import RatingForm from './RatingForm';
import RatingSummary from './RatingSummary';

export default function ClientBallot({ categories, contestant }) {

  // variables
  const socket = useContext(SocketContext);

  // functions
  const pushGNBB = () => {
    console.log('Pushed GNBB:', contestant.code);
    socket.emit('clientPushGNBB');
  };

  const submitBallot = (values) => {
    console.log('Submitted ballot:', [contestant.code, values]);
    socket.emit('clientSubmitBallot', values);
  };

  // component
  return (
    <div className="tv-clientBallot">
      <Card bordered={false}>
        <ContestantDetails contestant={contestant} />
        <RatingForm categories={categories} onFinish={submitBallot} />
        20
        <Row className="" gutter={[16, 16]}>
          {categories.map((category) => (
            <Col key={category.key} xs={12}>
              <RatingSummary
                category={category}
                value={Math.floor(Math.random() * category.max)}
              />
            </Col>
          ))}
        </Row>
      </Card>
      <GNBB onFinish={pushGNBB} />
    </div>
  );
}
