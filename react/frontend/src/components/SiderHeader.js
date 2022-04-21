import { Badge } from 'antd';

export default function StatusTitle({ count, icon, title }) {
  return (
    <div className="tv-siderTitle">
      <span className="tv-siderTitle__icon">
        {icon}
      </span>
      <span className="tv-siderTitle__title">
        {title}
      </span>
      <span className="tv-siderTitle__badge">
        <Badge count={count} />
      </span>
    </div>
  );
}
