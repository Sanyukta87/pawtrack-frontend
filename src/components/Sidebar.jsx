function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed shadow-lg">
      <h2 className="text-2xl font-bold mb-8">🐶 PawTrack</h2>

      <ul className="space-y-4 text-lg">
        <li className="hover:text-pink-400 cursor-pointer">📊 Dashboard</li>
        <li className="hover:text-pink-400 cursor-pointer">🐕 Dogs</li>
        <li className="hover:text-pink-400 cursor-pointer">🚨 Alerts</li>
      </ul>
    </div>
  );
}

export default Sidebar;