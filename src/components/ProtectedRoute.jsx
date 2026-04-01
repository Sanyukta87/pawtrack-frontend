import { Navigate } from "react-router-dom";

const parseJwtPayload = (token) => {
  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

function ProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !role) {
    return <Navigate replace to="/login" />;
  }

  const payload = parseJwtPayload(token);

  if (!payload?.exp || payload.exp * 1000 <= Date.now()) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    return <Navigate replace to="/login" />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate replace to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
