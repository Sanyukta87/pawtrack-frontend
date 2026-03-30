import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://pawtrack-backend-5bbx.onrender.com";

const API = axios.create({
  baseURL: rawBaseUrl.replace(/\/+$/, ""),
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
