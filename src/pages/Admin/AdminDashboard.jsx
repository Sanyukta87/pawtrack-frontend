import React from "react";
import Navbar from "../../components/Navbar";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const data = [
    { name: "Vaccinated", value: 3 },
    { name: "Due Soon", value: 1 },
    { name: "Overdue", value: 1 },
    { name: "Attention", value: 1 },
  ];

  const COLORS = ["#22c55e", "#eab308", "#ef4444", "#ec4899"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100">
      
      {/* Navbar */}
      <Navbar />

      <div className="p-6 md:p-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            👑 Admin Dashboard
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10">
          {[
            { label: "Total Dogs", value: 4 },
            { label: "Vaccinated", value: 3 },
            { label: "Overdue", value: 1 },
            { label: "Due Soon", value: 1 },
            { label: "Attention", value: 1 },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl shadow-md"
            >
              <p className="text-gray-500 text-sm">{item.label}</p>
              <h2 className="text-2xl font-bold">{item.value}</h2>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-lg mb-10">
          <h2 className="text-lg font-semibold mb-4">📊 Dog Overview</h2>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" outerRadius={100} label>
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;