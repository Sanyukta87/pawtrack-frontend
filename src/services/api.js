import axios from "axios";

const API = axios.create({
  baseURL: "https://pawtrack-backend-5bbx.onrender.com",
});
// 🔐 Token interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN BEING SENT:", token);

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;