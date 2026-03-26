import { useEffect, useState } from "react";
import API from "../../services/api";
import Sidebar from "../../components/Sidebar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

function AdminDashboard() {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDog, setEditDog] = useState(null);

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/dogs");
      setDogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDog = async (id) => {
    if (!window.confirm("Delete this dog?")) return;

    try {
      await API.delete(`/dogs/${id}`);
      setDogs(dogs.filter((dog) => dog._id !== id));
    } catch {
      alert("Delete failed ❌");
    }
  };

  const updateDog = async () => {
    try {
      await API.put(`/dogs/update/${editDog._id}`, editDog);
      alert("Updated ✅");
      setEditDog(null);
      fetchDogs();
    } catch {
      alert("Update failed ❌");
    }
  };

  // 🔥 PRIORITY SORT
  const priorityOrder = {
    attention: 1,
    overdue: 2,
    dueSoon: 3,
    none: 4,
  };

  const processedDogs = [...dogs].sort((a, b) => {
    return (
      (priorityOrder[a.alertStatus] || 4) -
      (priorityOrder[b.alertStatus] || 4)
    );
  });

  // 📊 STATS
  const total = dogs.length;
  const vaccinated = dogs.filter((d) => d.vaccinated).length;
  const overdue = dogs.filter((d) => d.alertStatus === "overdue").length;
  const dueSoon = dogs.filter((d) => d.alertStatus === "dueSoon").length;
  const attention = dogs.filter((d) => d.alertStatus === "attention").length;

  const chartData = [
    { name: "Vaccinated", value: vaccinated },
    { name: "Overdue", value: overdue },
    { name: "Due Soon", value: dueSoon },
    { name: "Attention", value: attention },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#facc15", "#ec4899"];

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="ml-64 w-full min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-purple-100 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            👑 Admin Dashboard
          </h1>

          <button
            onClick={fetchDogs}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition"
          >
            🔄 Refresh
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          <StatCard title="Total Dogs" value={total} />
          <StatCard title="Vaccinated" value={vaccinated} color="green" />
          <StatCard title="Overdue" value={overdue} color="red" />
          <StatCard title="Due Soon" value={dueSoon} color="yellow" />
          <StatCard title="Attention" value={attention} color="pink" />
        </div>

        {/* CHART */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-12 w-full max-w-xl">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            📊 Dog Overview
          </h2>

          <PieChart width={300} height={250}>
            <Pie data={chartData} dataKey="value" outerRadius={90}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* DOG CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedDogs.map((dog) => (
            <div
              key={dog._id}
              className={`p-5 rounded-2xl shadow-md transition hover:scale-105 hover:shadow-xl
              ${
                dog.alertStatus === "overdue"
                  ? "bg-red-100 border border-red-400"
                  : dog.alertStatus === "dueSoon"
                  ? "bg-yellow-100 border border-yellow-400"
                  : dog.alertStatus === "attention"
                  ? "bg-pink-100 border border-pink-400"
                  : "bg-white/70 backdrop-blur-md"
              }`}
            >
              <h2 className="text-lg font-bold mb-2">
                🐕 {dog.name}
              </h2>

              <p className="text-gray-600 mb-2">
                📍 {dog.location}
              </p>

              <p className="text-sm mb-2">
                {dog.vaccinated
                  ? "✅ Vaccinated"
                  : "⚠️ Not Vaccinated"}
              </p>

              {dog.alertStatus !== "none" && (
                <p className="text-sm text-red-600 font-semibold">
                  {dog.alertMessage}
                </p>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditDog(dog)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteDog(dog._id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EDIT MODAL */}
        {editDog && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
              <h2 className="text-xl font-bold mb-4">
                Edit Dog
              </h2>

              <input
                value={editDog.name}
                onChange={(e) =>
                  setEditDog({ ...editDog, name: e.target.value })
                }
                className="w-full p-2 border rounded mb-3"
              />

              <input
                value={editDog.location}
                onChange={(e) =>
                  setEditDog({ ...editDog, location: e.target.value })
                }
                className="w-full p-2 border rounded mb-3"
              />

              <div className="flex justify-between">
                <button
                  onClick={() => setEditDog(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={updateDog}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
    pink: "text-pink-600",
  };

  return (
    <div className="bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow text-center hover:scale-105 transition">
      <h3 className="text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold ${colors[color] || ""}`}>
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;