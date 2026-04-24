// src/components/ProtectedRoute.jsx
// Editorial redesign — warm white loading screen (matches Landing)

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=JetBrains+Mono:wght@400&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        `}</style>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: 28, height: 28, background: "#E84025", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L5.5 10.5L12 3.5" stroke="#FAFAF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "1rem", color: "#0A0A0A", animation: "pulse 2s ease-in-out infinite" }}>
            TaskFlow
          </span>
        </div>

        {/* Spinner */}
        <div style={{ width: 24, height: 24, border: "2px solid #E5E2DC", borderTopColor: "#E84025", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />

        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#A0A0A0" }}>
          Loading…
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;