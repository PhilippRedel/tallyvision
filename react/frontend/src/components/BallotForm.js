import { Button, Divider, Form, Modal, Rate } from 'antd';
import { useContext, useEffect } from 'react';

import { AppContext } from '../context/App';
import { SocketContext } from '../context/Socket';

export default function BallotForm() {

  // variables
  const { ballot, ballotScore, categories } = useContext(AppContext);
  const { socket } = useContext(SocketContext);
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

  // form
  const [form] = Form.useForm();

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

    // console.log('[Client] Submitted ballot:', [ballot.contestant.key, values]);
  };

  useEffect(() => {
    form.resetFields();
  }, [ballot, form]);

  return (
    <Form
      className="tv-form tv-form--ballot"
      form={form}
      initialValues={ballotScore}
      name="form_ballot"
      onFinish={ballotConfirm}
    >
      {categories.map((category) => (
        <div key={category.key}>
          <Divider>
            {category.label}
          </Divider>
          <Form.Item
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
