import { Badge } from 'antd';

export default function PanelHeading({ count, icon, title }) {
  return (
    <div className="tv-panelHeading">
      <span className="tv-panelHeading__icon">
        {icon}
      </span>
      <span className="tv-panelHeading__title">
        {title}
      </span>
      <span className="tv-panelHeading__badge">
        <Badge count={count} />
      </span>
    </div>
  );
}
