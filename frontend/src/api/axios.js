// src/api/axios.js
// Configured Axios instance with auth token injection and error handling

import axios from "axios";

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second request timeout
});

// Request interceptor: attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("taskflow_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token expiry globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or invalid, clear storage and redirect to login
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || "";
      if (
        message.includes("expired") ||
        message.includes("invalid") ||
        message.includes("No token")
      ) {
        localStorage.removeItem("taskflow_token");
        localStorage.removeItem("taskflow_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
