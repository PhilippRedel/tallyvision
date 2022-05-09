import { Button, Divider, Form, Modal, Rate } from 'antd';
import { useContext, useEffect } from 'react';

import { AppContext } from '../context/AppContext';
import { SocketContext } from '../context/SocketContext';

export default function RatingForm() {

  // variables
  const [form] = Form.useForm();
  const { app, ballot } = useContext(AppContext);
  const labels = [
    {
      cancel: 'Nein',
      ok: 'Ja',
    },
    {
      cancel: 'Nej',
      ok: 'Já',
    },
    {
      cancel: 'No',
      ok: 'Sì',
    },
    {
      cancel: 'No',
      ok: 'Sí',
    },
    {
      cancel: 'Non',
      ok: 'Oui',
    },
    {
      cancel: 'Piss Off',
      ok: 'Deffo',
    },
  ];
  const socket = useContext(SocketContext);

  // functions
  const ballotConfirm = (values) => {
    var sumValues = 0;
    var text = labels[Math.floor(Math.random() * labels.length)];

    for (var cat_key in values) {
      sumValues += values[cat_key];
    }

    if (sumValues > 0) {
      ballotSubmit(values);
    } else {
      Modal.confirm({
        cancelText: text.cancel,
        okText: text.ok,
        onOk() {
          ballotSubmit(values);
        },
        title: 'Nul points?',
      });
    }
  }

  const ballotSubmit = (values) => {
    socket.emit('clientBallotSubmit', values);

    console.log('[Client] Submitted ballot:', [ballot.contestant.key, values]);
  };

  useEffect(() => {
    socket.on('appBallot', form.resetFields);
  }, []);

  // component
  return (
    <Form
      className="tv-form tv-form__rating"
      form={form}
      name="form_rating"
      onFinish={ballotConfirm}
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
