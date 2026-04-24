// src/pages/Landing.jsx — Fully Responsive

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MoveRight, Menu, X } from "lucide-react";

/* ─── Animated counter ───────────────────────────────────────────── */
const Counter = ({ target, suffix = "", duration = 1800 }) => {
  const [count, setCount]     = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof target !== "number") return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, target]);

  useEffect(() => {
    if (!started || typeof target !== "number") return;
    let cur = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      cur += step;
      if (cur >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(cur));
    }, 16);
    return () => clearInterval(id);
  }, [started, target, duration]);

  return <span ref={ref}>{typeof target === "number" ? count : target}{suffix}</span>;
};

/* ─── Marquee strip ──────────────────────────────────────────────── */
const Marquee = () => {
  const words = ["Kanban", "Priorities", "Due Dates", "No Bloat", "JWT Auth", "Fast", "Drag & Drop", "Focused"];
  const repeated = [...words, ...words, ...words, ...words];
  return (
    <div style={{ overflow: "hidden", borderTop: "1.5px solid #0A0A0A", borderBottom: "1.5px solid #0A0A0A", backgroundColor: "#0A0A0A" }}>
      <div style={{ display: "flex", animation: "marquee 30s linear infinite", whiteSpace: "nowrap" }}>
        {repeated.map((w, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: "2rem",
            padding: "0.75rem 2rem",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: i % 2 === 0 ? "#FAFAF7" : "#E84025",
          }}>
            {w} <span style={{ color: "#E84025", fontSize: "1rem" }}>×</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Hanging Lamp ───────────────────────────────────────────────── */
const HangingLamp = () => {
  const [isOn, setIsOn]       = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [swingAngle, setSwingAngle] = useState(0);
  const angleRef    = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    let animId;
    const animate = () => {
      const damping  = 0.96;
      const gravity  = -0.018;
      velocityRef.current += gravity * angleRef.current;
      velocityRef.current *= damping;
      angleRef.current    += velocityRef.current;
      if (Math.abs(angleRef.current) < 0.01 && Math.abs(velocityRef.current) < 0.01) {
        angleRef.current = 0; velocityRef.current = 0; setSwingAngle(0); return;
      }
      setSwingAngle(angleRef.current);
      animId = requestAnimationFrame(animate);
    };
    if (!isPulling && Math.abs(angleRef.current) > 0.01) animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isPulling]);

  const handlePull = () => {
    setIsOn(prev => !prev);
    setIsPulling(true);
    angleRef.current = 10; velocityRef.current = 0;
    setTimeout(() => { setIsPulling(false); velocityRef.current = -0.7; }, 150);
  };

  const shadeLight = isOn ? "#E8917A" : "#C97A66";
  const shadeDark  = isOn ? "#C96A52" : "#A85A45";
  const pleats     = 14;
  const shadeW     = 160;
  const shadeTopW  = 40;
  const shadeH     = 100;

  const pleatPaths = () => {
    const paths = [];
    const topLeft = (shadeW - shadeTopW) / 2;
    for (let i = 0; i < pleats; i++) {
      const t = i / pleats, t2 = (i + 1) / pleats;
      const xTop1 = topLeft + t * shadeTopW, xTop2 = topLeft + t2 * shadeTopW;
      const xBot1 = t * shadeW,              xBot2 = t2 * shadeW;
      const mid   = i % 2 === 0;
      const xTopM = topLeft + (t + t2) / 2 * shadeTopW;
      const xBotM = (t + t2) / 2 * shadeW;
      paths.push(
        <path key={i}     d={`M${xTop1},0 L${xTopM},2 L${xBotM},${shadeH} L${xBot1},${shadeH} Z`} fill={mid ? shadeLight : shadeDark} stroke={isOn ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} strokeWidth="0.5" style={{ transition: "fill 0.5s" }} />,
        <path key={i+"b"} d={`M${xTopM},2 L${xTop2},0 L${xBot2},${shadeH} L${xBotM},${shadeH} Z`} fill={mid ? shadeDark : shadeLight} stroke={isOn ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} strokeWidth="0.5" style={{ transition: "fill 0.5s" }} />
      );
    }
    return paths;
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
      {isOn && <div style={{ position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,130,80,0.13) 0%, transparent 70%)", pointerEvents: "none", transition: "opacity 0.6s" }} />}
      <div style={{ transform: `rotate(${swingAngle}deg)`, transformOrigin: "top center", transition: isPulling ? "transform 0.1s" : "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 2, height: 70, background: "linear-gradient(to bottom, #6A6A6A, #3A3A3A)", borderRadius: 1 }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: shadeTopW + 8, height: 12, background: "linear-gradient(to bottom, #2A2A2A, #1A1A1A)", borderRadius: "4px 4px 0 0", border: "1px solid #444", zIndex: 3, position: "relative" }} />
          <svg width={shadeW} height={shadeH + 10} viewBox={`0 0 ${shadeW} ${shadeH + 10}`} style={{ filter: isOn ? "drop-shadow(0 0 18px rgba(232,130,80,0.5)) drop-shadow(0 4px 24px rgba(200,100,60,0.3))" : "drop-shadow(2px 4px 8px rgba(0,0,0,0.2))", transition: "filter 0.5s", overflow: "visible" }}>
            <ellipse cx={shadeW/2} cy={shadeH + 4} rx={shadeW/2} ry={6} fill={isOn ? "#B85A40" : "#8A4A35"} style={{ transition: "fill 0.5s" }} />
            {pleatPaths()}
            <ellipse cx={shadeW/2} cy={2} rx={shadeTopW/2} ry={4} fill="#1A1A1A" />
            {isOn && <ellipse cx={shadeW/2} cy={shadeH + 2} rx={shadeW/2 - 10} ry={4} fill="rgba(255,200,140,0.35)" style={{ filter: "blur(3px)" }} />}
          </svg>
          <div style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", width: 20, height: 26, borderRadius: "50% 50% 45% 45%", background: isOn ? "radial-gradient(circle at 40% 30%, #FFFBE8, #FFD580)" : "radial-gradient(circle at 40% 30%, #D8D4CE, #B0ACA6)", boxShadow: isOn ? "0 0 16px 8px rgba(255,210,100,0.7), 0 0 32px 16px rgba(255,180,80,0.35)" : "none", transition: "all 0.5s ease", zIndex: 4 }} />
          {isOn && <div style={{ position: "absolute", bottom: -180, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "90px solid transparent", borderRight: "90px solid transparent", borderTop: "180px solid rgba(232,150,100,0.06)", pointerEvents: "none", zIndex: 1 }} />}
        </div>
        <div onClick={handlePull} style={{ marginTop: 14, display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", userSelect: "none" }}>
          <div style={{ width: 1.5, height: isPulling ? 52 : 42, background: "linear-gradient(to bottom, #9A8A7A, #6A5A4A)", borderRadius: 1, transition: "height 0.15s ease" }} />
          <div style={{ width: 13, height: 13, borderRadius: "50%", background: isOn ? "linear-gradient(135deg, #E8917A, #C96A52)" : "linear-gradient(135deg, #C8A898, #A08878)", border: `1.5px solid ${isOn ? "#B85A40" : "#8A6858"}`, boxShadow: isOn ? "0 2px 6px rgba(200,100,60,0.4)" : "0 2px 4px rgba(0,0,0,0.2)", marginTop: -1, transform: isPulling ? "translateY(9px)" : "translateY(0)", transition: "transform 0.15s ease, background 0.4s, box-shadow 0.4s" }} />
        </div>
      </div>
      <div style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: isOn ? "#C96A52" : "#A0A0A0", transition: "color 0.4s" }}>
        {isOn ? "— lights on" : "— pull to toggle"}
      </div>
      {isOn && <div style={{ position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)", width: 200, height: 28, background: "radial-gradient(ellipse, rgba(232,130,80,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />}
    </div>
  );
};

/* ─── Main Landing ───────────────────────────────────────────────── */
const Landing = () => {
  const [scrollY, setScrollY]   = useState(0);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-revealed"); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navBg = scrollY > 40;

  return (
    <div style={{ backgroundColor: "#FAFAF7", color: "#0A0A0A", overflowX: "hidden" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #E84025; color: #FAFAF7; }

        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

        .hero-word { display: inline-block; animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .hw1 { animation-delay: 0.05s; } .hw2 { animation-delay: 0.15s; }
        .hw3 { animation-delay: 0.25s; } .hw4 { animation-delay: 0.35s; }
        .hw5 { animation-delay: 0.5s;  } .hw6 { animation-delay: 0.65s; }
        .hw7 { animation-delay: 0.8s;  } .hw8 { animation-delay: 0.9s;  }

        .reveal-el { opacity: 0; transform: translateY(32px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
        .reveal-el.is-revealed { opacity: 1; transform: translateY(0); }

        .hover-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(10,10,10,0.12); }

        .btn-main {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.9rem 2rem; background: #E84025; color: #FAFAF7;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
          letter-spacing: 0.02em; border: 2px solid #E84025; text-decoration: none;
          transition: background 0.2s, color 0.2s; cursor: pointer;
        }
        .btn-main:hover { background: #C93520; border-color: #C93520; }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.9rem 2rem; background: transparent; color: #0A0A0A;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.85rem; font-weight: 500;
          letter-spacing: 0.02em; border: 2px solid #0A0A0A; text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .btn-ghost:hover { background: #0A0A0A; color: #FAFAF7; }

        .nav-item {
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase; color: #5A5A5A;
          text-decoration: none; transition: color 0.2s;
        }
        .nav-item:hover { color: #E84025; }

        .task-card {
          background: #FAFAF7; border: 1.5px solid #E5E2DC; padding: 1.1rem 1.25rem;
          box-shadow: 2px 3px 0px #0A0A0A; transition: transform 0.2s, box-shadow 0.2s; cursor: default;
        }
        .task-card:hover { transform: translate(-2px, -2px); box-shadow: 4px 5px 0px #0A0A0A; }

        .step-num {
          font-family: 'Playfair Display', Georgia, serif; font-size: 5rem; font-weight: 900;
          line-height: 1; color: transparent; -webkit-text-stroke: 1.5px #0A0A0A; user-select: none;
        }

        /* ── Responsive ── */
        .hero-grid { display: grid; grid-template-columns: 1fr 320px; gap: 3rem; align-items: center; }
        .hero-h1   { font-size: 4.8rem; }
        .hero-lamp { display: flex; }
        .stats-grid  { display: grid; grid-template-columns: repeat(3, 1fr); }
        .feat-grid   { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; }
        .steps-grid  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem; }
        .cta-grid    { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 4rem; }
        .footer-inner { display: flex; align-items: center; justify-content: space-between; }
        .footer-links { display: flex; gap: 2rem; }
        .nav-desktop  { display: flex; }
        .nav-mobile-btn { display: none; }
        .mobile-menu  { display: none; }
        .kanban-preview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; max-width: 620px; }
        .hero-ctas { display: flex; gap: 0.75rem; flex-wrap: wrap; }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2rem; }
          .hero-lamp { display: none !important; }
          .hero-h1   { font-size: 3.4rem !important; }
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .steps-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .cta-grid { grid-template-columns: 1fr; gap: 2rem; }
          .feat-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .hero-h1 { font-size: 2.6rem !important; }
          .stats-grid { grid-template-columns: 1fr; }
          .kanban-preview { grid-template-columns: 1fr; max-width: 100%; }
          .hero-ctas { flex-direction: column; }
          .hero-ctas a { width: 100%; justify-content: center; }
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .mobile-menu { display: block; }
          .footer-inner { flex-direction: column; gap: 1.25rem; text-align: center; }
          .footer-links { justify-content: center; }
          .section-pad { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
          .feat-cell { border-left: none !important; }
        }

        @media (max-width: 480px) {
          .hero-h1 { font-size: 2.1rem !important; }
          .cta-h2 { font-size: 2.5rem !important; }
          .feat-h2 { font-size: 2.2rem !important; }
          .step-num { font-size: 3.5rem; }
        }
      `}</style>

      {/* ── Navbar ───────────────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "1.25rem 2.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        backgroundColor: navBg ? "rgba(250,250,247,0.92)" : "transparent",
        backdropFilter: navBg ? "blur(12px)" : "none",
        borderBottom: navBg ? "1.5px solid #E5E2DC" : "1.5px solid transparent",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: 28, height: 28, background: "#E84025", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L5.5 10.5L12 3.5" stroke="#FAFAF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.02em" }}>TaskFlow</span>
        </div>

        {/* Desktop nav */}
        <nav className="nav-desktop" style={{ alignItems: "center", gap: "2.5rem" }}>
          <a href="#features" className="nav-item">Features</a>
          <a href="#how" className="nav-item">How it works</a>
          <Link to="/login" className="nav-item">Sign in</Link>
          <Link to="/signup" className="btn-main" style={{ padding: "0.55rem 1.25rem", fontSize: "0.78rem" }}>
            Get started <ArrowUpRight size={13} />
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button className="nav-mobile-btn" onClick={() => setMobileNav(v => !v)}
          style={{ background: "none", border: "1.5px solid #E5E2DC", padding: "0.4rem", cursor: "pointer", color: "#0A0A0A", alignItems: "center", justifyContent: "center" }}>
          {mobileNav ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {mobileNav && (
        <div className="mobile-menu" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 90, background: "#FAFAF7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem" }}>
          <a href="#features" className="nav-item" style={{ fontSize: "1.2rem" }} onClick={() => setMobileNav(false)}>Features</a>
          <a href="#how"      className="nav-item" style={{ fontSize: "1.2rem" }} onClick={() => setMobileNav(false)}>How it works</a>
          <Link to="/login"  className="nav-item" style={{ fontSize: "1.2rem" }} onClick={() => setMobileNav(false)}>Sign in</Link>
          <Link to="/signup" className="btn-main" onClick={() => setMobileNav(false)}>Get started <ArrowUpRight size={13} /></Link>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="section-pad" style={{
        minHeight: "100vh", padding: "0 2.5rem",
        maxWidth: 1100, margin: "0 auto", position: "relative",
        display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.5rem",
        paddingTop: "6rem", paddingBottom: "3rem",
      }}>
        <div className="hw1 hero-word" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#E84025" }}>
          — Task management, distilled
        </div>

        <div className="hero-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h1 className="hero-h1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.04em" }}>
              <span className="hero-word hw2" style={{ display: "block" }}>Get&nbsp;<em style={{ fontStyle: "italic", color: "#E84025" }}>things</em></span>
              <span className="hero-word hw3" style={{ display: "block" }}>done.</span>
              <span className="hero-word hw4" style={{ display: "block", color: "#C0BAB0" }}>Nothing</span>
              <span className="hero-word hw5" style={{ display: "block", color: "#C0BAB0" }}>else.</span>
            </h1>

            <div className="hero-word hw6" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.9rem", fontWeight: 300, lineHeight: 1.7, color: "#5A5A5A", maxWidth: 360 }}>
                A task manager built on restraint. No dashboards, no noise—just your work, moving forward.
              </p>
              <div className="hero-ctas">
                <Link to="/signup" className="btn-main">Start free <MoveRight size={15} /></Link>
                <Link to="/login"  className="btn-ghost">Sign in</Link>
              </div>
            </div>

            {/* Kanban preview */}
            <div className="hero-word hw7 kanban-preview">
              {[
                { label: "Pending", count: 4, color: "#5A5A5A" },
                { label: "In Progress", count: 2, color: "#2563EB" },
                { label: "Done", count: 7, color: "#16A34A" },
              ].map((col, ci) => (
                <div key={ci}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem", paddingBottom: "0.35rem", borderBottom: `2px solid ${col.color}` }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: col.color, fontWeight: 500 }}>{col.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#C0BAB0" }}>{col.count}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {ci === 0 && [{ title: "Write API docs", priority: "high" }, { title: "Update README", priority: "low" }].map((c, i) => (
                      <div key={i} className="task-card" style={{ padding: "0.6rem 0.75rem" }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.15em", textTransform: "uppercase", color: c.priority === "high" ? "#E84025" : "#A0A0A0", display: "block", marginBottom: "0.2rem" }}>{c.priority}</span>
                        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.7rem", fontWeight: 500, color: "#0A0A0A", lineHeight: 1.3 }}>{c.title}</p>
                      </div>
                    ))}
                    {ci === 1 && (
                      <div className="task-card" style={{ borderColor: "#2563EB", boxShadow: "2px 3px 0px #2563EB", padding: "0.6rem 0.75rem" }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "#E84025", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "0.2rem" }}>high</span>
                        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.7rem", fontWeight: 500, color: "#0A0A0A" }}>Auth middleware</p>
                        <div style={{ marginTop: "0.4rem", height: 2, background: "#E5E2DC", borderRadius: 1 }}>
                          <div style={{ height: "100%", width: "60%", background: "#2563EB", borderRadius: 1 }} />
                        </div>
                      </div>
                    )}
                    {ci === 2 && [{ title: "DB schema design" }, { title: "Setup CI pipeline" }].map((c, i) => (
                      <div key={i} className="task-card" style={{ opacity: 0.6, padding: "0.6rem 0.75rem" }}>
                        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.7rem", fontWeight: 400, color: "#5A5A5A", textDecoration: "line-through", lineHeight: 1.3 }}>{c.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hanging lamp — hidden on mobile via CSS */}
          <div className="hero-lamp" style={{ height: "100%", minHeight: 380, alignItems: "flex-start", justifyContent: "center", position: "relative", paddingTop: "3rem" }}>
            <HangingLamp />
          </div>
        </div>
      </section>

      <Marquee />

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ padding: "7rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div className="stats-grid">
          {[
            { value: 100, suffix: "%", label: "Data privacy",    sub: "Zero third-party access" },
            { value: 3,   suffix: "",  label: "Priority levels", sub: "Low · Medium · High" },
            { value: "∞", suffix: "",  label: "Tasks",           sub: "No plan limits" },
          ].map((s, i) => (
            <div key={i} data-reveal className="reveal-el"
              style={{ padding: "3rem 2.5rem", borderLeft: i > 0 ? "1.5px solid #E5E2DC" : "none", borderTop: "1.5px solid #E5E2DC", transitionDelay: `${i * 0.1}s` }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "4.5rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", marginBottom: "0.75rem" }}>
                <Counter target={typeof s.value === "number" ? s.value : null} suffix={s.suffix} />
                {typeof s.value !== "number" && s.value + s.suffix}
              </div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "#0A0A0A", marginBottom: "0.3rem" }}>{s.label}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#A0A0A0", letterSpacing: "0.08em" }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ height: "1.5px", background: "#0A0A0A" }} />
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="section-pad" style={{ padding: "0 2.5rem 8rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "2rem", marginBottom: "4rem" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#E84025", letterSpacing: "0.25em", textTransform: "uppercase", flexShrink: 0 }}>02 — Features</span>
          <div style={{ flex: 1, height: "1px", background: "#E5E2DC" }} />
        </div>
        <div data-reveal className="reveal-el" style={{ marginBottom: "4rem" }}>
          <h2 className="feat-h2" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "3.5rem", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 560 }}>
            Everything you need.<br /><span style={{ color: "#C0BAB0" }}>Nothing you don't.</span>
          </h2>
        </div>
        <div className="feat-grid">
          {[
            { n: "01", title: "Task Management",  body: "Create tasks with a title, description, priority, and a due date. Edit or delete any time." },
            { n: "02", title: "Kanban Board",      body: "Drag and drop cards across columns — with full touch support on mobile." },
            { n: "03", title: "Secure by default", body: "JWT authentication, bcrypt hashing. Your tasks are private to you. No exceptions." },
            { n: "04", title: "Optimistic UI",     body: "Every action feels instant. Status updates optimistically — no waiting between moves." },
            { n: "05", title: "Due date tracking", body: "Overdue tasks surface automatically. Nothing slips through." },
            { n: "06", title: "List view",         body: "Prefer a flat list? Switch to list mode and cycle task status with one tap." },
          ].map((f, i) => (
            <div key={i} data-reveal className="reveal-el hover-lift feat-cell"
              style={{ padding: "2.5rem", borderTop: "1.5px solid #E5E2DC", borderLeft: i % 2 === 1 ? "1.5px solid #E5E2DC" : "none", transitionDelay: `${(i % 2) * 0.08}s` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#E84025", letterSpacing: "0.15em", marginBottom: "1rem" }}>{f.n}</div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.75rem", letterSpacing: "-0.01em" }}>{f.title}</h3>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.875rem", fontWeight: 300, lineHeight: 1.8, color: "#5A5A5A" }}>{f.body}</p>
            </div>
          ))}
          <div style={{ gridColumn: "1 / -1", height: "1.5px", background: "#E5E2DC" }} />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how" style={{ background: "#0A0A0A", padding: "7rem 2.5rem" }}>
        <div className="section-pad" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "2rem", marginBottom: "5rem" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#E84025", letterSpacing: "0.25em", textTransform: "uppercase", flexShrink: 0 }}>03 — How it works</span>
            <div style={{ flex: 1, height: "1px", background: "#2A2A2A" }} />
          </div>
          <div className="steps-grid">
            {[
              { n: "01", title: "Create",    body: "Add a task with a title, priority, and due date. Takes five seconds." },
              { n: "02", title: "Organise",  body: "Move tasks across the Kanban board by dragging — works on mobile too." },
              { n: "03", title: "Ship",      body: "Mark tasks complete. Watch the numbers update. Move on." },
            ].map((s, i) => (
              <div key={i} data-reveal className="reveal-el" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="step-num" style={{ WebkitTextStroke: "1.5px #3A3A3A", marginBottom: "1.5rem" }}>{s.n}</div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#FAFAF7", marginBottom: "1rem", letterSpacing: "-0.02em" }}>{s.title}</h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.875rem", fontWeight: 300, lineHeight: 1.8, color: "#6A6A6A" }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ padding: "9rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div data-reveal className="reveal-el cta-grid" style={{ borderTop: "1.5px solid #0A0A0A", paddingTop: "4rem" }}>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#E84025", letterSpacing: "0.25em", textTransform: "uppercase", display: "block", marginBottom: "1.5rem" }}>— Ready?</span>
            <h2 className="cta-h2" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "4rem", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.04em" }}>
              Stop juggling.<br /><em style={{ fontStyle: "italic", color: "#E84025" }}>Start shipping.</em>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flexShrink: 0 }}>
            <Link to="/signup" className="btn-main" style={{ justifyContent: "center" }}>
              Create free account <ArrowUpRight size={14} />
            </Link>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#A0A0A0", letterSpacing: "0.1em", textAlign: "center" }}>
              No card. No trial. Just work.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1.5px solid #E5E2DC", padding: "2rem 2.5rem" }}>
        <div className="footer-inner">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: 22, height: 22, background: "#E84025", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <path d="M2 7L5.5 10.5L12 3.5" stroke="#FAFAF7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "0.9rem" }}>TaskFlow</span>
          </div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#A0A0A0", letterSpacing: "0.1em" }}>
            © {new Date().getFullYear()} — Built with React & Node.js
          </p>
          <div className="footer-links">
            <Link to="/login"  className="nav-item">Sign in</Link>
            <Link to="/signup" className="nav-item" style={{ color: "#E84025" }}>Sign up →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;