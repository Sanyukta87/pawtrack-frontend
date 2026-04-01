import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import API from "../services/api";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "volunteer",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/api/auth/signup", form);
      toast.success(response.data.msg || "Signup successful");
      navigate("/verify-email", {
        state: {
          email: form.email,
          verificationRequired: Boolean(response.data.verificationRequired),
          verificationUrl: response.data.verificationUrl || "",
        },
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md border-white/70 bg-white/90 backdrop-blur">
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            PawTrack
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Join the team and start tracking dogs professionally.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSignup}>
          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <Input
            type="password"
            label="Password"
            placeholder="Create a password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <Input
            as="select"
            label="Role"
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
          >
            <option value="volunteer">Volunteer</option>
            <option value="vet">Vet / Hospital</option>
            <option value="admin">Admin</option>
          </Input>

          <Button type="submit" className="w-full" loading={loading}>
            Sign up
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button
            className="font-semibold text-emerald-700 transition hover:text-emerald-600"
            onClick={() => navigate("/login")}
            type="button"
          >
            Login
          </button>
        </p>
      </Card>
    </div>
  );
}

export default Signup;
