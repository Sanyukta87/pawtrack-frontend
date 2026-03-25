import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const { darkMode } = useTheme();
  const [dogs, setDogs] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // 🔐 GET ROLE
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const res = await API.get("/dogs");
        setDogs(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDogs();
  }, []);

  // 🔍 Filter
  const filteredDogs = dogs.filter((dog) =>
    dog.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        backgroundColor: darkMode ? "#0f172a" : "#f8fafc",
        color: darkMode ? "#e2e8f0" : "#1e293b",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: "25px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600" }}>
          🐶 PawTrack Dashboard
        </h1>
        <p style={{ color: "gray", fontSize: "14px" }}>
          Manage and track stray dogs efficiently
        </p>
      </div>

      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "25px",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search dogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        {/* 👑 ONLY ADMIN CAN SEE */}
        {role === "admin" && (
          <button onClick={() => navigate("/add-dog")} style={buttonStyle}>
            ➕ Add Dog
          </button>
        )}
      </div>

      {/* STATS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <div style={statBox}>🐶 Total: {dogs.length}</div>
        <div style={statBox}>
          💉 Vaccinated: {dogs.filter((d) => d.vaccinated).length}
        </div>
        <div style={statBox}>
          ✂️ Sterilized: {dogs.filter((d) => d.sterilized).length}
        </div>
        <div style={statBox}>
          📍 Areas: {[...new Set(dogs.map((d) => d.location))].length}
        </div>
      </div>

      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredDogs.map((dog) => (
          <div key={dog._id} style={cardStyle}>
            <h2 style={{ color: "#6366f1" }}>{dog.name}</h2>

            <p>📍 {dog.location}</p>
            <p>🎨 {dog.color}</p>
            <p>👤 {dog.gender}</p>

            {/* BADGES */}
            <div style={{ marginTop: "10px" }}>
              <span
                style={{
                  ...badge,
                  backgroundColor: dog.vaccinated ? "#22c55e" : "#ef4444",
                }}
              >
                {dog.vaccinated ? "Vaccinated" : "Not Vaccinated"}
              </span>

              <span
                style={{
                  ...badge,
                  backgroundColor: dog.sterilized ? "#3b82f6" : "#6b7280",
                }}
              >
                {dog.sterilized ? "Sterilized" : "Not Sterilized"}
              </span>
            </div>

            {/* QR */}
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <Link to={`/dog/${dog._id}`}>
                <img
                  src={dog.qrCode}
                  alt="QR"
                  width="120"
                  style={{ cursor: "pointer" }}
                />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 PREMIUM FLOATING BUTTON (ALL USERS) */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end group">
        <span className="mb-2 px-3 py-1 text-sm bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition">
          Scan QR
        </span>

        <button
          onClick={() => navigate("/scan")}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                     text-white p-4 rounded-full shadow-2xl 
                     hover:scale-110 hover:shadow-pink-500/40 
                     transition-all duration-300"
        >
          📷
        </button>
      </div>
    </div>
  );
}

/* STYLES */
const inputStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  minWidth: "220px",
  outline: "none",
};

const buttonStyle = {
  padding: "12px 18px",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "500",
  boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
};

const statBox = {
  padding: "15px",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  fontWeight: "500",
};

const cardStyle = {
  backgroundColor: "white",
  padding: "18px",
  borderRadius: "14px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
};

const badge = {
  color: "white",
  padding: "5px 10px",
  borderRadius: "6px",
  marginRight: "8px",
  fontSize: "12px",
};

export default Dashboard;