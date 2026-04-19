export function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) {
  const variants = {
    primary: "bg-ink text-white hover:opacity-90",
    secondary: "border border-line bg-white text-ink hover:bg-stone-50",
    subtle: "bg-stone-200/70 text-ink hover:bg-stone-200"
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

