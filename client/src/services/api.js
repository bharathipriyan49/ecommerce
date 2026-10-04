import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce-qc17.onrender.com/api",
});

export default api;