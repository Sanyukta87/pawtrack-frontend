import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddDog from "./pages/AddDog";
import DogDetails from "./pages/DogDetails";
import QRScanner from "./pages/QRScanner";

// import Navbar from "./components/Navbar"; // 👈 temporarily comment

function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}

      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ROLE BASED */}
        <Route path="/vet" element={<Dashboard />} />
        <Route path="/volunteer" element={<Dashboard />} />

        <Route path="/add-dog" element={<AddDog />} />
        <Route path="/dog/:id" element={<DogDetails />} />
        <Route path="/scan" element={<QRScanner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;