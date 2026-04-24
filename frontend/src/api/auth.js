// src/api/auth.js
// Auth API calls: signup, login, and get current user

import api from "./axios";

// Register a new user account
// Returns { success, token, user, message }
export const signup = async (data) => {
  const response = await api.post("/auth/signup", data);
  // response.data is already the full object from backend
  return { data: response.data };
};

// Login with email and password
// Returns { success, token, user, message }
export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return { data: response.data };
};

// Get the current authenticated user's profile
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return { data: response.data };
};
