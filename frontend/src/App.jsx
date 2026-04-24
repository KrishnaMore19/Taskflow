// src/App.js
// Root component: sets up routing, auth provider, and global toast notifications

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// Redirect authenticated users away from auth pages to dashboard
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public landing page */}
    <Route path="/" element={<Landing />} />

    {/* Auth pages: redirect to dashboard if already logged in */}
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
    <Route
      path="/signup"
      element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      }
    />

    {/* Protected dashboard: requires valid JWT */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    {/* Catch-all: redirect unknown routes to home */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid #334155",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#8b5cf6", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
