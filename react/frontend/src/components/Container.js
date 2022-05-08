export default function Container({ children, className, viewport = '' }) {

  // component
  return (
    <div className={`tv-container tv-container--${viewport} ${className}`}>
      {children}
    </div>
  );
}
