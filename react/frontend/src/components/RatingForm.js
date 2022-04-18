import { Button, Divider, Form, Rate } from 'antd';

export default function RatingForm({ categories, onFinish, onFinishFailed }) {

  // component
  return (
    <Form
      className="tv-ratingForm"
      name="tv_ratingForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
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
