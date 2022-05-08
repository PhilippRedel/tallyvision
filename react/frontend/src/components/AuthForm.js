import { Button, Form, Input, Typography } from 'antd';
import { useContext } from 'react';

import { SocketContext } from '../context/SocketContext';

export default function AuthForm() {

  // variables
  const { Title } = Typography;
  const socket = useContext(SocketContext);

  // functions
  const submitAuth = (values) => {
    socket.auth = {
      pin: parseInt(values.pin),
    };

    socket.connect();
  };

  // form
  const [form] = Form.useForm();
  const pinValue = Form.useWatch('pin', form);

  // component
  return (
    <Form
      autoComplete="off"
      className="tv-form tv-form__auth"
      form={form}
      layout="vertical"
      name="form_auth"
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
          maxLength={4}
          size="large"
          type="password"
        />
      </Form.Item>
      <Button
        block
        disabled={pinValue ? false : true}
        htmlType="submit"
        size="large"
        type="primary"
      >
        Connect
      </Button>
    </Form>
  );
}
