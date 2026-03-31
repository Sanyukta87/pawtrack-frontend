const VARIANT_STYLES = {
  neutral: "border border-slate-200 bg-slate-100/90 text-slate-700",
  success: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border border-amber-200 bg-amber-50 text-amber-700",
  danger: "border border-rose-200 bg-rose-50 text-rose-700",
  info: "border border-sky-200 bg-sky-50 text-sky-700",
};

function Badge({ children, className = "", variant = "neutral" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
