import { useContext } from 'react';
import { Button, Divider, Form, Rate } from 'antd';
import { ClientSocket } from '../context/ClientSocket';

export default function BallotForm({ categories }) {

  // variables
  const socket = useContext(ClientSocket);

  // functions
  const ratingError = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const ratingSubmit = (values) => {
    console.log('Submitting rating:', values);

    socket.emit('clientRatingSubmit', values);
  };

  // component
  return (
    <Form
      autoComplete="off"
      className="tv-ratingForm"
      name="tv_ratingForm"
      onFinish={ratingSubmit}
      onFinishFailed={ratingError}
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
            />
          </Form.Item>
        </div>
      ))}
      <Button block htmlType="submit" size="large" type="primary">Vote</Button>
    </Form>
  );
}
