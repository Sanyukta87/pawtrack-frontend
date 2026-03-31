import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/api/auth/login", {
        email,
        password,
      });

      const { token, role, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful");

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
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md border-white/70 bg-white/90 backdrop-blur">
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            PawTrack
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage dogs, reports, and health records.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <Button type="submit" className="w-full" loading={loading}>
            Login
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <button
            className="font-semibold text-sky-700 transition hover:text-sky-600"
            onClick={() => navigate("/signup")}
            type="button"
          >
            Sign up
          </button>
        </p>
      </Card>
    </div>
  );
}

export default Login;
