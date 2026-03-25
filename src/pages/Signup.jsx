import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "volunteer",
  });

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/signup", form);
      alert("Signup successful 🎉");
      navigate("/login");
    } catch (err) {
      alert("Signup failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-500 to-blue-500">
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl w-80 shadow-xl text-center">

        <h2 className="text-xl font-bold mb-4">🐶 PawTrack Signup</h2>

        <form onSubmit={handleSignup}>

          <input
            placeholder="Name"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full p-3 mb-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            placeholder="Email"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full p-3 mb-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full p-3 mb-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {/* ✅ SINGLE ROLE DROPDOWN */}
          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
            className="w-full p-3 mb-4 rounded-xl border bg-white/80"
          >
            <option value="volunteer">Volunteer</option>
            <option value="vet">Vet / Hospital</option>
            <option value="admin">Admin</option>
          </select>

          <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-xl hover:scale-105 transition">
            Signup
          </button>
        </form>

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;