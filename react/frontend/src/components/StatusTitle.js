import { Badge } from 'antd';

export default function StatusTitle({ status, style, title }) {
  return (
    <span className="tv-badgeTitle">
      {title} <Badge count={status} style={style} />
    </span>
  );
}
