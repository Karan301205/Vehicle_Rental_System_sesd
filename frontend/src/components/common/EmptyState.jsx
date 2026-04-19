export function EmptyState({ title, description }) {
  return (
    <div className="rounded-[28px] border border-dashed border-line bg-white/70 p-10 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}

