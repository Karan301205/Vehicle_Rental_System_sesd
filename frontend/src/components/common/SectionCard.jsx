export function SectionCard({ children, className = "" }) {
  return <div className={`rounded-[28px] border border-line bg-panel p-6 shadow-card ${className}`}>{children}</div>;
}

