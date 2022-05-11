export default function Container({ children, view = '' }) {
  return (
    <div className={`tv-container tv-container--${view}`}>
      {children}
    </div>
  );
}
