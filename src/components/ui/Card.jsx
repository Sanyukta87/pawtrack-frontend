function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-white/70 bg-white/88 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
