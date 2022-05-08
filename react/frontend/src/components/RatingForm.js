import { Button, Divider, Form, Modal, Rate } from 'antd';
import { useContext } from 'react';

import { AppContext } from '../context/AppContext';
import { SocketContext } from '../context/SocketContext';

export default function RatingForm() {

  // variables
  const { app, ballot } = useContext(AppContext);
  const socket = useContext(SocketContext);
  const textCancel = ['Ne', 'Nein', 'Nej', 'Ni', 'No', 'Non'];
  const textOK = ['Ano', 'Da', 'Ja', 'Oui', 'Sì', 'Tak'];

  // functions
  const confirmBallot = (values) => {
    var total = 0;

    for (var cat_key in values) {
      total += values[cat_key];
    }

    if (total > 0) {
      submitBallot(values);
    } else {
      Modal.confirm({
        cancelText: textRandom(textCancel),
        okText: `${textRandom(textOK)}, this sucks!`,
        title: 'Nul points?',
        onOk() {
          submitBallot(values);
        },
        onCancel() {
          console.log('[Client] Cancelled nul points:', ballot.contestant.key);
        },
      });
    }
  }

  const submitBallot = (values) => {
    socket.emit('clientBallotSubmit', values);

    console.log('[Client] Submitted ballot:', [ballot.contestant.key, values]);
  };

  const textRandom = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // form
  const [form] = Form.useForm();

  // component
  return (
    <Form
      className="tv-form tv-form__rating"
      form={form}
      name="form_rating"
      onFinish={confirmBallot}
    >
      {app.categories.map((category) => (
        <div className="tv-form__category" key={category.key}>
          <Divider>
            {category.label}
          </Divider>
          <Form.Item
            initialValue={0}
            name={`cat_${category.key}`}
            required
          >
            <Rate
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
