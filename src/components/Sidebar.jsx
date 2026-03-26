import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed shadow-lg">
      <h2 className="text-2xl font-bold mb-8">🐶 PawTrack</h2>

      <ul className="space-y-4 text-lg">
        <li>
          <Link
            to="/admin"   // ✅ FIXED (was "/")
            className="hover:text-pink-400 cursor-pointer"
          >
            📊 Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/dogs"
            className="hover:text-pink-400 cursor-pointer"
          >
            🐕 Dogs
          </Link>
        </li>

        <li>
          <Link
            to="/add-dog"
            className="hover:text-pink-400 cursor-pointer"
          >
            ➕ Add Dog
          </Link>
        </li>   

        
        <li>
          <Link
            to="/alerts"
            className="hover:text-pink-400 cursor-pointer"
          >
            🚨 Alerts
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;