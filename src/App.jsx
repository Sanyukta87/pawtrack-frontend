import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddDog from "./pages/AddDog";
import DogDetails from "./pages/DogDetails";
import Scanner from "./pages/Scanner";
import DogsPage from "./pages/DogsPage";
import Lookup from "./pages/Lookup";
import VerifyEmail from "./pages/VerifyEmail";

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

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vet"
          element={
            <ProtectedRoute allowedRoles={["vet"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/volunteer" element={<Lookup />} />

        <Route
          path="/dogs"
          element={
            <ProtectedRoute allowedRoles={["admin", "vet"]}>
              <DogsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-dog"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddDog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dog/:dogId"
          element={
            <ProtectedRoute allowedRoles={["admin", "vet"]}>
              <DogDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/lookup" element={<Lookup />} />
        <Route
          path="/scan"
          element={
            <ProtectedRoute allowedRoles={["admin", "vet"]}>
              <Scanner />
            </ProtectedRoute>
          }
        />
        <Route path="/alerts" element={<div>Alerts Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
