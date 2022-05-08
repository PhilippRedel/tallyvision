import { Button, Form, Input, Typography } from 'antd';
import { useContext } from 'react';
import { useCookies } from 'react-cookie';

import { SocketContext } from '../context/SocketContext';

export default function RegistrationForm() {

  // variables
  const { Title } = Typography;
  const socket = useContext(SocketContext);

  // functions
  const submitRegistration = (values) => {
    socket.auth = {
      name: values.name.toLowerCase(),
    };

    socket.connect();
  };

  // form
  const [form] = Form.useForm();
  const nameValue = Form.useWatch('name', form);

  // cookies
  const [cookies] = useCookies(['client']);

  // component
  return (
    <Form
      autoComplete="off"
      className="tv-form tv-form__registration"
      form={form}
      initialValues={{ name: cookies.tv_client_name }}
      layout="vertical"
      name="form_registration"
      onFinish={submitRegistration}
      requiredMark={false}
    >
      <Form.Item
        label={<Title level={5}>Name</Title>}
        name="name"
        rules={[
          {
            message: 'Enter your name to join or reconnect',
            required: true,
          },
        ]}
      >
        <Input
          maxLength={12}
          showCount
          size="large"
        />
      </Form.Item>
      <Button
        block
        disabled={nameValue ? false : true}
        htmlType="submit"
        size="large"
        type="primary"
      >
        Join
      </Button>
    </Form>
  );
}
