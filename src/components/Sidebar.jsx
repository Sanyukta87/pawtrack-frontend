import { Link } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "Dashboard" },
  { to: "/dogs", label: "Dogs", icon: "Dogs" },
  { to: "/add-dog", label: "Add Dog", icon: "Add" },
  { to: "/alerts", label: "Alerts", icon: "Alerts" },
];

function Sidebar() {
  return (
    <div className="fixed h-screen w-64 border-r border-slate-800 bg-slate-950/95 p-5 text-white shadow-2xl backdrop-blur">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
          PawTrack
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
          Admin Panel
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Manage records, vaccinations, and alerts.
        </p>
      </div>

      <ul className="mt-8 space-y-3 text-base">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-slate-200 transition hover:bg-slate-900 hover:text-sky-300"
              to={item.to}
            >
              <span>{item.label}</span>
              <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
                {item.icon}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
