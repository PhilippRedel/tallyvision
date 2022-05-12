import { Button, Form, Input, Typography } from 'antd';
import { useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { SocketContext } from '../context/Socket';

const { Title } = Typography;

export default function ClientAuthForm() {

  // variables
  const [cookies, setCookie] = useCookies(['client']);
  const { socket } = useContext(SocketContext);

  // form
  const [form] = Form.useForm();
  const fieldName = Form.useWatch('first_name', form);

  // functions
  function submitAuth(values) {
    socket.auth = {
      name: values.first_name.toLowerCase(),
    };

    socket.connect();
  };

  useEffect(() => {
    socket.on('appConnected', (data) => {
      setCookie('tv_client_name', data.name, { path: '/' });
    });
  }, [setCookie, socket]);

  return (
    <Form
      autoComplete="off"
      className="tv-form tv-form--auth"
      form={form}
      initialValues={{ first_name: cookies.tv_client_name }}
      layout="vertical"
      name="form_clientAuth"
      onFinish={submitAuth}
      requiredMark={false}
    >
      <Form.Item
        label={<Title level={5}>Name</Title>}
        name="first_name"
        rules={[
          {
            message: 'Enter your name to join or reconnect',
            required: true,
          },
        ]}
      >
        <Input
          autoFocus
          maxLength={12}
          showCount
          size="large"
        />
      </Form.Item>
      <Button
        block
        disabled={fieldName ? false : true}
        htmlType="submit"
        size="large"
        type="primary"
      >
        Join
      </Button>
    </Form>
  );
}
