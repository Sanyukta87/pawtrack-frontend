import axios from "axios";

const API = axios.create({
  baseURL: "https://pawtrack-backend-5bbx.onrender.com"
});

export default API;