// src/pages/Signup.jsx — Fully Responsive

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { signup as signupApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData]         = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [errors, setErrors]             = useState({});
  const [globalError, setGlobalError]   = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    if (globalError) setGlobalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErrors({}); setGlobalError("");
    try {
      const data = await signupApi(formData);
      login(data.data.user, data.data.token);
      toast.success("Account created! Welcome to TaskFlow.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const response = err.response?.data;
      if (response?.errors) {
        const fieldErrors = {};
        response.errors.forEach(({ field, message }) => { fieldErrors[field] = message; });
        setErrors(fieldErrors);
      } else {
        setGlobalError(response?.message || "Signup failed. Please try again.");
      }
    } finally { setLoading(false); }
  };

  const getStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: "Too short", pct: 20, color: "#E84025" };
    if (pwd.length < 8 || !/\d/.test(pwd)) return { label: "Weak", pct: 45, color: "#D97706" };
    if (pwd.length < 12) return { label: "Fair", pct: 70, color: "#CA8A04" };
    return { label: "Strong", pct: 100, color: "#16A34A" };
  };
  const strength = getStrength(formData.password);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF7", color: "#0A0A0A", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #E84025; color: #FAFAF7; }

        .tf-input {
          width: 100%; padding: 0.85rem 1rem;
          background: #FAFAF7; border: 1.5px solid #D8D4CE;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.875rem; color: #0A0A0A; outline: none; transition: border-color 0.2s;
        }
        .tf-input::placeholder { color: #A0A0A0; }
        .tf-input:focus { border-color: #E84025; }
        .tf-input.error { border-color: #E84025; }

        .tf-btn-main {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          width: 100%; padding: 0.9rem 2rem;
          background: #E84025; color: #FAFAF7;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
          letter-spacing: 0.02em; border: 2px solid #E84025; cursor: pointer; transition: background 0.2s;
        }
        .tf-btn-main:hover:not(:disabled) { background: #C93520; border-color: #C93520; }
        .tf-btn-main:disabled { opacity: 0.6; cursor: not-allowed; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(250,250,247,0.3); border-top-color: #FAFAF7; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }

        .auth-header { padding: 1.25rem 2.5rem; }
        .auth-main   { padding: 4rem 1.5rem; }
        .auth-box    { width: 100%; max-width: 420px; }

        @media (max-width: 480px) {
          .auth-header { padding: 1rem 1.25rem; }
          .auth-main   { padding: 2.5rem 1.25rem; }
          .auth-h1     { font-size: 2.4rem !important; }
        }
      `}</style>

      <header className="auth-header" style={{ borderBottom: "1.5px solid #E5E2DC", display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", color: "inherit" }}>
          <div style={{ width: 28, height: 28, background: "#E84025", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L5.5 10.5L12 3.5" stroke="#FAFAF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.02em" }}>TaskFlow</span>
        </Link>
      </header>

      <main className="auth-main" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="auth-box">
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#E84025", marginBottom: "1.5rem" }}>— Create account</div>
          <h1 className="auth-h1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "3rem", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
            Start<br /><em style={{ fontStyle: "italic", color: "#E84025" }}>shipping.</em>
          </h1>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.875rem", fontWeight: 300, color: "#5A5A5A", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            Free forever. No credit card needed.
          </p>
          <div style={{ height: "1.5px", background: "#0A0A0A", marginBottom: "2.5rem" }} />

          {globalError && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1rem", border: "1.5px solid #E84025", background: "rgba(232,64,37,0.04)", marginBottom: "1.5rem" }}>
              <AlertCircle size={14} style={{ color: "#E84025", flexShrink: 0 }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.8rem", color: "#E84025" }}>{globalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5A5A5A", marginBottom: "0.5rem" }}>Full name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className={`tf-input${errors.name ? " error" : ""}`} />
              {errors.name && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#E84025", marginTop: "0.35rem" }}>{errors.name}</p>}
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5A5A5A", marginBottom: "0.5rem" }}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className={`tf-input${errors.email ? " error" : ""}`} />
              {errors.email && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#E84025", marginTop: "0.35rem" }}>{errors.email}</p>}
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5A5A5A", marginBottom: "0.5rem" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required placeholder="Min. 6 chars with a number" className={`tf-input${errors.password ? " error" : ""}`} style={{ paddingRight: "3rem" }} />
                <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#A0A0A0", display: "flex", alignItems: "center" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {strength && (
                <div style={{ marginTop: "0.5rem" }}>
                  <div style={{ height: 3, background: "#E5E2DC", width: "100%" }}>
                    <div style={{ height: "100%", width: `${strength.pct}%`, background: strength.color, transition: "width 0.3s, background 0.3s" }} />
                  </div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#A0A0A0", marginTop: "0.3rem", letterSpacing: "0.08em" }}>{strength.label}</p>
                </div>
              )}
              {errors.password && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#E84025", marginTop: "0.35rem" }}>{errors.password}</p>}
            </div>
            <button type="submit" disabled={loading} className="tf-btn-main" style={{ marginTop: "0.5rem" }}>
              {loading ? <><span className="spinner" /> Creating account…</> : "Create account →"}
            </button>
          </form>

          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.8rem", color: "#5A5A5A", marginTop: "2rem", textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#E84025", fontWeight: 600, textDecoration: "none" }}>Sign in →</Link>
          </p>
        </div>
      </main>

      <div style={{ height: "1.5px", background: "#E5E2DC" }} />
      <footer style={{ padding: "1.25rem 2.5rem", display: "flex", justifyContent: "center" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#A0A0A0", letterSpacing: "0.1em" }}>
          © {new Date().getFullYear()} TaskFlow — Built with React & Node.js
        </p>
      </footer>
    </div>
  );
};

export default Signup;