import { Divider, Rate } from 'antd';

export default function BallotRate({ category }) {
  return (
    <div className="tv-ballotRate">
      <Divider className="tv-ballotRate--title">
        {category.title}
      </Divider>
      <Rate count={category.max} />
    </div>
  );
}
