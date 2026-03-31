const VARIANT_STYLES = {
  primary:
    "border border-sky-500 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-[0_16px_30px_rgba(14,165,233,0.24)] hover:-translate-y-0.5 hover:from-sky-600 hover:via-cyan-500 hover:to-emerald-600 focus:ring-sky-200 disabled:border-slate-300 disabled:bg-slate-300 disabled:shadow-none",
  secondary:
    "border border-sky-100 bg-white/90 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/80 focus:ring-sky-100 disabled:text-slate-400",
  danger:
    "border border-rose-500 bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_16px_30px_rgba(244,63,94,0.22)] hover:-translate-y-0.5 hover:from-rose-600 hover:to-pink-600 focus:ring-rose-200 disabled:border-rose-300 disabled:bg-rose-300 disabled:shadow-none",
};

function Button({
  children,
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed ${VARIANT_STYLES[variant]} ${className}`}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;
