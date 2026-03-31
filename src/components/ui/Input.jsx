function Input({
  as = "input",
  className = "",
  label,
  helperText,
  ...props
}) {
  const Component = as;

  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
      <Component
        className={`w-full rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.05)] outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 ${className}`}
        {...props}
      />
      {helperText && <span className="text-xs text-slate-500">{helperText}</span>}
    </label>
  );
}

export default Input;
