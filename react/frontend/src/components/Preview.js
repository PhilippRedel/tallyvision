export default function Preview({ children, viewport = 'mobile' }) {
  return (
    <div className={`tv-preview tv-preview--${viewport}`}>
      {children}
    </div>
  );
}
