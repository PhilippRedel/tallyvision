import { Rate, Typography } from 'antd';

export default function ScorecardRate({ category, value = 0 }) {
  const { Text } = Typography;

  return (
    <div className="tv-scorecardRate">
      <Text className="tv-scorecardRate--title" strong>
        {category.title}
      </Text>
      <Rate count={category.max} disabled={true} value={value} />
    </div>
  );
}
