import { Button, Divider, Form, Rate } from 'antd';
import { useContext } from 'react';

import { BallotContext } from '../context/BallotContext';
import { SocketContext } from '../context/SocketContext';

export default function RatingForm({ categories }) {

  // variables
  const { ballot } = useContext(BallotContext);
  const socket = useContext(SocketContext);

  // functions
  const submitBallot = (values) => {
    socket.emit('clientBallotSubmit', values);

    console.log('[Client] Submitted ballot:', [ballot.contestant.code, values]);
  };

  // component
  return (
    <Form
      className="tv-ratingForm"
      name="tv_ratingForm"
      onFinish={submitBallot}
    >
      {categories.map((category) => (
        <div className="tv-ratingForm__category" key={category.key}>
          <Divider className="tv-ratingForm__title">
            {category.label}
          </Divider>
          <Form.Item
            initialValue={0}
            name={`cat_${category.key}`}
            required
          >
            <Rate
              className="tv-ratingForm__rating"
              count={category.max}
              disabled={!ballot.open}
            />
          </Form.Item>
        </div>
      ))}
      <Button
        block
        disabled={!ballot.open}
        htmlType="submit"
        size="large"
        type="primary"
      >
        Vote
      </Button>
    </Form>
  );
}
