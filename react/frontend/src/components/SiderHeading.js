import { Badge } from 'antd';

export default function SiderHeading({ count, icon, title }) {

  // component
  return (
    <div className="tv-siderHeading">
      <span className="tv-siderHeading__icon">
        {icon}
      </span>
      <span className="tv-siderHeading__title">
        {title}
      </span>
      <span className="tv-siderHeading__badge">
        <Badge count={count} />
      </span>
    </div>
  );
}
