import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://pawtrack-backend-5bbx.onrender.com";

const API = axios.create({
  baseURL: rawBaseUrl.replace(/\/+$/, ""),
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
