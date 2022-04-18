import { Button, Form, Input, Typography } from 'antd';

export default function RegistrationForm({ onFinish, onFinishFailed }) {
  const { Title } = Typography;

  // component
  return (
    <Form
      className="tv-registrationForm"
      layout='vertical'
      name="tv_registrationForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      requiredMark={false}
    >
      <Form.Item
        label={<Title level={5}>Name</Title>}
        name="name"
        rules={[
          {
            message: 'Enter your name to join or reconnect',
            required: true,
          }
        ]}
      >
        <Input maxLength={12} showCount size="large" />
      </Form.Item>
      <Button block htmlType="submit" size="large" type="primary">Join</Button>
    </Form>
  );
}
