import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AddDog() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    color: "",
    gender: "",
    vaccinated: false,
    sterilized: false,
    earNotch: false,
    notes: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/dogs/add", formData);
      alert("Dog Added 🐶");
      navigate("/dashboard");
    } catch (err) {
      alert("Error ❌");
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
          : "linear-gradient(135deg, #74b9ff, #a29bfe)"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "400px",
          padding: "25px",
          borderRadius: "16px",
          background: darkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.2)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          color: "white"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          ➕ Add Dog
        </h2>

        <input name="name" placeholder="Name" onChange={handleChange} style={input} />
        <input name="location" placeholder="Location" onChange={handleChange} style={input} />
        <input name="color" placeholder="Color" onChange={handleChange} style={input} />

        <select name="gender" onChange={handleChange} style={input}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <div style={{ margin: "10px 0" }}>
          <label><input type="checkbox" name="vaccinated" onChange={handleChange} /> Vaccinated</label><br />
          <label><input type="checkbox" name="sterilized" onChange={handleChange} /> Sterilized</label><br />
          <label><input type="checkbox" name="earNotch" onChange={handleChange} /> Ear Notch</label>
        </div>

        <textarea name="notes" placeholder="Notes..." onChange={handleChange} style={input} />

        <button style={button}>Add Dog</button>
      </form>
    </div>
  );
}

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "none"
};

const button = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#6c5ce7",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  marginTop: "10px"
};

export default AddDog;