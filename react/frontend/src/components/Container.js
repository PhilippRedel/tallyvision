export default function Container({ children, viewport = '' }) {

  // component
  return (
    <div className={`tv-container tv-container--${viewport}`}>
      {children}
    </div>
  );
}
