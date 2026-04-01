import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import API from "../services/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingLink, setPendingLink] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");

      if (!token) {
        const pendingState = location.state || {};

        setStatus("pending");
        setPendingEmail(pendingState.email || "");
        setPendingLink(pendingState.verificationUrl || "");
        setMessage(
          pendingState.verificationRequired
            ? "Your account was created. Verify your email before logging in."
            : "Verification token is missing."
        );
        return;
      }

      try {
        const response = await API.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        setStatus("success");
        setMessage(response.data.msg || "Email verified successfully.");
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.msg || "Verification link is invalid or expired."
        );
      }
    };

    verify();
  }, [location.state, searchParams]);

  return (
    <div className="app-shell flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md border-white/70 bg-white/90 text-center backdrop-blur">
        <span className="section-chip">
          {status === "success" ? "Verified" : status === "error" ? "Error" : "Checking"}
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Email Verification
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-500">{message}</p>
        {status === "pending" && pendingEmail && (
          <p className="mt-3 text-sm font-medium text-slate-700">
            Pending verification for <span className="font-semibold">{pendingEmail}</span>
          </p>
        )}
        {status === "pending" && pendingLink && (
          <a
            className="mt-4 block break-all text-sm font-medium text-sky-700 underline"
            href={pendingLink}
            rel="noreferrer"
            target="_blank"
          >
            Open verification link
          </a>
        )}
        <div className="mt-6">
          <Button
            className="w-full"
            onClick={() => navigate(status === "success" ? "/login" : "/signup")}
          >
            {status === "success" ? "Go to Login" : "Back"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default VerifyEmail;
