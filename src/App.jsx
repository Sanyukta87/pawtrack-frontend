import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddDog from "./pages/AddDog";
import DogDetails from "./pages/DogDetails";
import Scanner from "./pages/Scanner";
import DogsPage from "./pages/DogsPage";

// import Navbar from "./components/Navbar"; // optional

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "18px",
            background: "#0f172a",
            color: "#fff",
            boxShadow: "0 16px 35px rgba(15,23,42,0.18)",
          },
          success: {
            style: {
              background: "#14532d",
            },
          },
          error: {
            style: {
              background: "#7f1d1d",
            },
          },
        }}
      />
      {/* <Navbar /> */}

      <Routes>
        {/* 🔐 Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 👥 Role Dashboards */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/vet" element={<Dashboard />} />
        <Route path="/volunteer" element={<Dashboard />} />

        {/* 🐶 Dog System */}
        <Route path="/dogs" element={<DogsPage />} />   {/* ✅ FIXED */}
        <Route path="/add-dog" element={<AddDog />} />
        <Route path="/dog/:dogId" element={<DogDetails />} />
        {/* 📷 QR Scanner */}
        <Route path="/scan" element={<Scanner />} />

        {/* 🚨 Alerts (placeholder for now) */}
        <Route path="/alerts" element={<div>Alerts Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
