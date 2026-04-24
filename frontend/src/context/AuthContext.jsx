// src/context/AuthContext.js
// Global authentication state management using React Context

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMe } from "../api/auth";

const AuthContext = createContext(null);

// Storage keys for persisting auth state across page refreshes
const TOKEN_KEY = "taskflow_token";
const USER_KEY = "taskflow_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true); // True while verifying stored token

  // On app load, verify stored token by fetching current user profile
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMe();
        setUser(data.data.user);
      } catch {
        // Token invalid or expired - clear storage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Store token and user in state and localStorage after successful auth
  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }, []);

  // Clear all auth state and storage
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easy access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
