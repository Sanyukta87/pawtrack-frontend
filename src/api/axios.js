import axios from "axios";

const API = axios.create({
 baseURL: "https://pawtrack-backend.onrender.com"
});
export default API;

