import { Button, Form, Input, Typography } from 'antd';
import { useContext } from 'react';

import { SocketContext } from '../context/Socket';

const { Title } = Typography;

export default function HostAuthForm() {

  // variables
  const { socket } = useContext(SocketContext);

  // form
  const [form] = Form.useForm();
  const fieldPin = Form.useWatch('pin', form);

  // functions
  const submitAuth = (values) => {
    socket.auth = {
      pin: parseInt(values.pin),
    };

    socket.connect();
  };

  return (
    <Form
      autoComplete="off"
      className="tv-form tv-form--auth"
      form={form}
      layout="vertical"
      name="form_hostAuth"
      onFinish={submitAuth}
      requiredMark={false}
    >
      <Form.Item
        label={<Title level={5}>PIN</Title>}
        name="pin"
        rules={[
          {
            message: 'Enter a PIN to connect as host',
            required: true,
          },
        ]}
      >
        <Input
          autoFocus
          maxLength={4}
          size="large"
          type="password"
        />
      </Form.Item>
      <Button
        block
        disabled={fieldPin ? false : true}
        htmlType="submit"
        size="large"
        type="primary"
      >
        Connect
      </Button>
    </Form>
  );
}
