import { Button, Form } from 'antd';

export default function GNBB({ onFinish, onFinishFailed }) {
  return (
    <Form
      className="tv-GNBB"
      name="tv_GNBB"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Button htmlType="submit" type="link">
        <img alt="" src={process.env.PUBLIC_URL + '/media/gnbb.png'} />
      </Button>
    </Form>
  );
}
