import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddDog from "./pages/AddDog";
import DogDetails from "./pages/DogDetails";
import QRScanner from "./pages/QRScanner";
import DogsPage from "./pages/DogsPage";

// import Navbar from "./components/Navbar"; // optional

function App() {
  return (
    <BrowserRouter>
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
        <Route path="/dog/:id" element={<DogDetails />} />

        {/* 📷 QR Scanner */}
        <Route path="/scan" element={<QRScanner />} />

        {/* 🚨 Alerts (placeholder for now) */}
        <Route path="/alerts" element={<div>Alerts Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;