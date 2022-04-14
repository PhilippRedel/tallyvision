import { Rate, Typography } from 'antd';

export default function RatingSummary({ category, value = 0 }) {
  const { Text } = Typography;

  return (
    <div className="tv-ratingSummary">
      <Text className="tv-ratingSummary__title">
        {category.label}
      </Text>
      <Rate
        className="tv-ratingSummary__rating"
        count={category.max}
        disabled
        value={value}
      />
    </div>
  );
}
