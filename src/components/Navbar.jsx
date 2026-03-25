import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      {/* 🐶 Logo */}
      <h2 style={{ color: "#6c5ce7", margin: 0 }}>
        🐶 PawTrack
      </h2>

      {/* 🔗 Navigation Links */}
      <div style={{ display: "flex", gap: "25px" }}>
        <NavLink
          to="/dashboard"
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "#6c5ce7" : darkMode ? "#ccc" : "#555",
            fontWeight: isActive ? "bold" : "normal",
            borderBottom: isActive ? "2px solid #6c5ce7" : "none",
            paddingBottom: "4px",
            transition: "0.2s"
          })}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/add-dog"
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "#6c5ce7" : darkMode ? "#ccc" : "#555",
            fontWeight: isActive ? "bold" : "normal",
            borderBottom: isActive ? "2px solid #6c5ce7" : "none",
            paddingBottom: "4px",
            transition: "0.2s"
          })}
        >
          Add Dog
        </NavLink>
      </div>

      {/* 🌙 Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: "8px 14px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #6c5ce7, #a29bfe)",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          transition: "0.3s"
        }}
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </div>
  );
}

export default Navbar;