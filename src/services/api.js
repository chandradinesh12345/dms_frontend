import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
  },
  // withCredentials: true, // ONLY when using Sanctum
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 GLOBAL AUTH FAILURE HANDLER
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

   if ((status === 401 || status === 403) && localStorage.getItem("token")) {
  localStorage.clear();
  toast.error("Session expired. Please login again.");
  window.location.href = "/";
}


    return Promise.reject(error);
  }
);

export default api;
