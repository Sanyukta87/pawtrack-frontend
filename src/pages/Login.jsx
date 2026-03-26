import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const { darkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const res = await API.post("/api/auth/login", {
  email,
  password,
});

      const { token, role, user } = res.data;

      // 🔥 STORE EVERYTHING CLEANLY
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful 🔥");

      // 🚀 ROLE BASED REDIRECT
      switch (role) {
        case "admin":
          navigate("/admin");
          break;
        case "vet":
          navigate("/vet");
          break;
        case "volunteer":
          navigate("/volunteer");
          break;
        default:
          navigate("/");
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: darkMode
          ? "linear-gradient(135deg, #1e1e2f, #121212)"
          : "linear-gradient(135deg, #6c5ce7, #a29bfe)",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "320px",
          padding: "30px",
          borderRadius: "16px",
          backdropFilter: "blur(10px)",
          background: darkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          textAlign: "center",
          color: "white",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>🐶 PawTrack</h2>
        <p style={{ marginBottom: "20px", fontSize: "14px" }}>
          Welcome back 👋
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button style={buttonStyle} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* SIGNUP NAVIGATION */}
        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#ffeaa7", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
  color: "black", // 👈 ADD THIS
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#fd79a8",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "10px",
};

export default Login;