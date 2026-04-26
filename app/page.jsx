"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import createGlobe from "cobe";
import { isLoggedIn } from "./api/auth";

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────
const GlobalStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink: #0a0a0f;
      --ink-2: #16161e;
      --surface: #f0efe8;
      --accent: #c8f135;
      --blue: #3b5bfc;
      --blue-light: #6b7fff;
      --warm: #ff6b35;
      --muted: #8a8a96;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--ink);
      color: var(--surface);
      overflow-x: hidden;
      cursor: none;
    }

    body::after {
      content: '';
      position: fixed; inset: 0; z-index: 9997;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      opacity: 0.028;
      pointer-events: none;
    }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--ink); }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33%       { transform: translateY(-12px) rotate(1deg); }
      66%       { transform: translateY(-6px) rotate(-1deg); }
    }
    @keyframes glow-pulse {
      0%, 100% { box-shadow: 0 0 20px rgba(200,241,53,0.3); }
      50%       { box-shadow: 0 0 50px rgba(200,241,53,0.6); }
    }
    @keyframes bar-fill {
      from { width: 0; }
    }
    @keyframes pulse-expand {
      0% { transform: scaleX(0.3) scaleY(0.3); opacity: 0.8; }
      100% { transform: scaleX(1.5) scaleY(1.5); opacity: 0; }
    }

    .anim-fade-up   { animation: fadeUp  0.7s cubic-bezier(0.16,1,0.3,1) both; }
    .anim-fade-in   { animation: fadeIn  0.6s ease both; }
    .anim-scale-in  { animation: scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) both; }

    .d100 { animation-delay: 0.10s; }
    .d200 { animation-delay: 0.20s; }
    .d300 { animation-delay: 0.30s; }
    .d400 { animation-delay: 0.40s; }
    .d500 { animation-delay: 0.50s; }

    .reveal {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1);
    }
    .reveal.vis { opacity: 1; transform: translateY(0); }
    .r1 { transition-delay: 0.10s; }
    .r2 { transition-delay: 0.20s; }
    .r3 { transition-delay: 0.30s; }
    .r4 { transition-delay: 0.40s; }

    .grad-text {
      background: linear-gradient(135deg, #c8f135 0%, #7bf1a8 50%, #6b7fff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .marquee-track {
      animation: marquee 28s linear infinite;
      display: inline-flex;
      gap: 60px;
    }
    .marquee-track:hover { animation-play-state: paused; }

    .float-badge { animation: float 6s ease infinite; }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.35;
      animation: float 14s ease infinite;
    }

    .feat-card {
      position: relative;
      transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1),
                  border-color 0.3s ease,
                  box-shadow 0.4s ease;
    }
    .feat-card::before {
      content: '';
      position: absolute; inset: 0;
      border-radius: inherit;
      background: radial-gradient(
        600px circle at var(--mx, 50%) var(--my, 50%),
        rgba(200,241,53,0.07),
        transparent 40%
      );
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
    }
    .feat-card:hover { transform: translateY(-6px); border-color: rgba(200,241,53,0.22) !important; box-shadow: 0 30px 80px rgba(0,0,0,0.4); }
    .feat-card:hover::before { opacity: 1; }

    .testi-card { transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s; }
    .testi-card:hover { transform: translateY(-8px); border-color: rgba(200,241,53,0.18) !important; }

    .price-card { transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1); }
    .price-card:hover { transform: translateY(-8px); }
    .price-card.featured { animation: glow-pulse 3s ease infinite; }

    .stat-card { transition: transform 0.3s ease, border-color 0.3s ease; }
    .stat-card:hover { transform: translateY(-4px); border-color: rgba(200,241,53,0.2) !important; }

    .bar-fill { animation: bar-fill 1.5s cubic-bezier(0.16,1,0.3,1) both; }

    .nav-link {
      color: rgba(240,239,232,0.65);
      font-size: 14px; font-weight: 500;
      text-decoration: none; position: relative;
      transition: color 0.25s ease;
    }
    .nav-link::after {
      content: ''; position: absolute;
      bottom: -2px; left: 0; right: 0; height: 1px;
      background: #c8f135;
      transform: scaleX(0); transform-origin: right;
      transition: transform 0.3s ease;
    }
    .nav-link:hover { color: var(--surface); }
    .nav-link:hover::after { transform: scaleX(1); transform-origin: left; }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 16px 36px; border-radius: 100px;
      background: #c8f135; color: #0a0a0f;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px;
      border: none; cursor: none; text-decoration: none;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
      position: relative; overflow: hidden;
    }
    .btn-primary:hover { transform: scale(1.05); box-shadow: 0 20px 60px rgba(200,241,53,0.4); }
    .btn-primary:active { transform: scale(0.98); }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 15px 36px; border-radius: 100px;
      background: transparent; color: var(--surface);
      font-family: 'Syne', sans-serif; font-weight: 600; font-size: 15px;
      border: 1.5px solid rgba(240,239,232,0.2); cursor: none; text-decoration: none;
      transition: all 0.3s ease;
    }
    .btn-ghost:hover { border-color: rgba(240,239,232,0.6); background: rgba(240,239,232,0.06); }

    .footer-link {
      color: #8a8a96; font-size: 14px; text-decoration: none;
      transition: color 0.25s;
    }
    .footer-link:hover { color: var(--surface); }

    .cta-visual-col {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      perspective: 1200;
    }

    .cta-cube-shell {
      width: min(560px, 100%);
      margin-right: -52px;
    }

    /* Globe container */
    .globe-wrapper {
      position: relative;
      width: 100%;
      max-width: 560px;
      aspect-ratio: 1;
      flex-shrink: 0;
      // background-color: white; 
      // margin-bottom: 330px;
    
    }

    /* Hero layout: side by side on desktop, stacked on mobile */
    .hero-inner {
      display: flex;
      align-items: center;
      gap: 40px;
      width: 100%;
    }

    .hero-text-col {
      flex: 1;
      min-width: 0;
      text-align: left;
    }

    .hero-globe-col {
      flex: 0 0 auto;
      width: 46%;
      max-width: 560px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom : 80px;
      
    }

    @media (max-width: 900px) {
      .hide-mobile { display: none !important; }
      .show-mobile { display: inline-flex !important; }
      .hero-title  { font-size: clamp(2.4rem, 10vw, 3.6rem) !important; }
      section { padding-left: 16px !important; padding-right: 16px !important; }
      .grid-responsive { grid-template-columns: 1fr !important; }
      .mobile-center { text-align: center !important; }
      .stat-card { padding: 20px 16px !important; }

      .hero-inner {
        flex-direction: column;
        text-align: center;
      }
      .hero-text-col {
        text-align: center;
      }
      .hero-globe-col {
        width: 90%;
        max-width: 400px;
        
      }
      .hero-cta-btns {
        justify-content: center !important;
      }

      .cta-visual-col {
        justify-content: center !important;
      }

      .cta-cube-shell {
        margin-right: 0 !important;
        width: min(460px, 100%) !important;
      }
    }

    @media (max-width: 480px) {
      .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
      .hero-globe-col {
        width: 100%;
        max-width: 320px;
        // margin-bottom: 0px;
        // background-color : red;
      }

      .cta-cube-shell {
        width: min(340px, 100%) !important;
      }
    }

    .show-mobile { display: none; }
  `}</style>
);

// ─────────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────────
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
      setTimeout(() => {
        if (ringRef.current) {
          ringRef.current.style.left = e.clientX + "px";
          ringRef.current.style.top = e.clientY + "px";
        }
      }, 80);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const base = {
    position: "fixed",
    pointerEvents: "none",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
  };

  return (
    <>
      <div ref={dotRef} style={{ ...base, width: 8, height: 8, background: "#c8f135", borderRadius: "50%", mixBlendMode: "difference" }} />
      <div ref={ringRef} style={{ ...base, width: 36, height: 36, border: "1.5px solid rgba(200,241,53,0.5)", borderRadius: "50%", transition: "width 0.3s ease, height 0.3s ease", zIndex: 9998 }} />
    </>
  );
}

// ─────────────────────────────────────────────
// SCROLL-REVEAL HOOK
// ─────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("vis")),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─────────────────────────────────────────────
// GLOBE COMPONENT
// ─────────────────────────────────────────────
const defaultMarkers = [
  { id: "pulse-1", location: [51.51, -0.13], delay: 0 },
  { id: "pulse-2", location: [40.71, -74.01], delay: 0.5 },
  { id: "pulse-3", location: [35.68, 139.65], delay: 1 },
  { id: "pulse-4", location: [-33.87, 151.21], delay: 1.5 },
];

function GlobePulse({ markers = defaultMarkers, speed = 0.003 }) {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const handlePointerDown = useCallback((e) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe = null;
    let animationId;
    let phi = 0;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width, height: width,
        phi: 0, theta: 0.2, dark: 1, diffuse: 1.5,
        mapSamples: 16000, mapBrightness: 10,
        baseColor: [0.5, 0.5, 0.5],
        markerColor: [0.2, 0.8, 0.9],
        glowColor: [0.05, 0.05, 0.05],
        markerElevation: 0,
        markers: markers.map((m) => ({ location: m.location, size: 0.025, id: m.id })),
        arcs: [], arcColor: [0.3, 0.85, 0.95],
        arcWidth: 0.5, arcHeight: 0.25, opacity: 0.7,
      });

      function animate() {
        if (!isPausedRef.current) phi += speed;
        globe.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        });
        animationId = requestAnimationFrame(animate);
      }
      animate();
      setTimeout(() => canvas && (canvas.style.opacity = "1"));
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, [markers, speed]);

  return (
    <div className="globe-wrapper">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%", height: "100%", cursor: "grab", opacity: 0,
          transition: "opacity 1.2s ease", borderRadius: "50%", touchAction: "none",
          display: "block",
        }}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            bottom: "anchor(center)",
            left: "anchor(center)",
            translate: "-50% 50%",
            width: 40, height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            opacity: 0,
          }}
        >
          <span style={{
            position: "absolute", inset: 0,
            border: "2px solid #33ccdd", borderRadius: "50%", opacity: 0,
            animation: `pulse-expand 2s ease-out infinite ${m.delay}s`,
          }} />
          <span style={{
            position: "absolute", inset: 0,
            border: "2px solid #33ccdd", borderRadius: "50%", opacity: 0,
            animation: `pulse-expand 2s ease-out infinite ${m.delay + 0.5}s`,
          }} />
          <span style={{
            width: 10, height: 10, background: "#33ccdd", borderRadius: "50%",
            boxShadow: "0 0 0 3px #111, 0 0 0 5px #33ccdd",
          }} />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = ["Features", "How It Works", "Pricing", "Testimonials"];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };

    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      transition: "all 0.4s ease",
      background: scrolled ? "rgba(10,10,15,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 3vw, 40px)", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#c8f135", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "var(--surface)" }}>SmartHire</span>
        </a>

        <div className="hide-mobile" style={{ display: "flex", gap: 36 }}>
          {navLinks.map((label) => (
            <a key={label} href={`#${label.toLowerCase().replace(/ /g, "-")}`} className="nav-link">{label}</a>
          ))}
        </div>

        <div className="hide-mobile" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {!loggedIn && (
            <a href="/login" style={{ color: "rgba(240,239,232,0.6)", fontWeight: 500, fontSize: 14, textDecoration: "none", padding: "8px 16px" }}>Sign in</a>
          )}
          <a href="/register" className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}>Get Started</a>
        </div>

        <button
          type="button"
          className="show-mobile"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.04)",
            color: "var(--surface)",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <span style={{
            position: "absolute",
            width: 18,
            height: 2,
            background: "currentColor",
            borderRadius: 2,
            transition: "transform 0.3s ease, top 0.3s ease",
            top: menuOpen ? 21 : 15,
            transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
          }} />
          <span style={{
            position: "absolute",
            width: 18,
            height: 2,
            background: "currentColor",
            borderRadius: 2,
            transition: "opacity 0.2s ease",
            top: 21,
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            position: "absolute",
            width: 18,
            height: 2,
            background: "currentColor",
            borderRadius: 2,
            transition: "transform 0.3s ease, top 0.3s ease",
            top: menuOpen ? 21 : 27,
            transform: menuOpen ? "rotate(-45deg)" : "rotate(0deg)",
          }} />
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{
          height: menuOpen ? "auto" : 0,
          opacity: menuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          overflow: "hidden",
          pointerEvents: menuOpen ? "auto" : "none",
          borderTop: menuOpen ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0)",
          background: "rgba(10,10,15,0.96)",
        }}
      >
        <div
          className="show-mobile"
          style={{
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "14px clamp(16px, 3vw, 40px) 18px",
            flexDirection: "column",
            gap: 8,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {navLinks.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setMenuOpen(false)}
              style={{
                color: "rgba(240,239,232,0.8)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                padding: "10px 4px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                width: "100%",
              }}
            >
              {label}
            </a>
          ))}

          {!loggedIn && (
            <a
              href="/login"
              onClick={() => setMenuOpen(false)}
              style={{
                color: "rgba(240,239,232,0.8)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                padding: "12px 4px 4px",
                width: "100%",
              }}
            >
              Sign in
            </a>
          )}

          <a
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            style={{
              textDecoration: "none",
              background: "#c8f135",
              color: "#0a0a0f",
              fontWeight: 700,
              borderRadius: 999,
              padding: "10px 18px",
              marginTop: 4,
            }}
          >
            Get Started
          </a>
        </div>
      </motion.div>
    </nav>
  );
}

// ─────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────
function Hero() {
  const stats = [
    { n: "5,000+", l: "Interviews Conducted" },
    { n: "9/10", l: "Candidate Satisfaction" },
    { n: "40hrs", l: "Saved Per Hire" },
    { n: "200+", l: "Companies Trust Us" },
  ];

  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      display: "flex", alignItems: "center",
      overflow: "hidden", paddingTop: 70,
    }}>
      {/* Ambient orbs */}
      <div className="orb" style={{ width: 600, height: 600, background: "radial-gradient(circle,rgba(200,241,53,.5),transparent)", top: "-10%", right: "-15%", animationDuration: "14s" }} />
      <div className="orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(59,91,252,.45),transparent)", bottom: "-10%", left: "-12%", animationDuration: "18s", animationDelay: "-5s" }} />
      <div className="orb" style={{ width: 300, height: 300, background: "radial-gradient(circle,rgba(255,107,53,.3),transparent)", top: "40%", left: "30%", animationDuration: "22s", animationDelay: "-10s" }} />

      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, width: "100%", padding: "0 clamp(16px, 3vw, 40px)" }}>
        <div className="hero-inner">

          {/* LEFT: Text column */}
          <div className="hero-text-col">
            {/* Badge */}
            <div className="anim-fade-in" style={{ marginBottom: 28 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 18px", borderRadius: 100,
                background: "rgba(200,241,53,0.1)", border: "1px solid rgba(200,241,53,0.25)",
                color: "#c8f135", fontSize: 13, fontWeight: 500,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#c8f135", display: "inline-block", animation: "glow-pulse 2s ease infinite" }} />
                AI-Powered Hiring Platform · 2026
              </span>
            </div>

            {/* Headline */}
              <h1 className="hero-title anim-fade-up d100" style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 800,
                fontSize: "clamp(2.8rem,5.5vw,5.5rem)",
                lineHeight: 1.02, letterSpacing: "-0.03em",
                color: "var(--surface)", marginBottom: 12,
              }}>
                Smart Hiring
              </h1>
            {/* <h1 className="hero-title anim-fade-up d200" style={{
              fontFamily: "'Syne',sans-serif", fontWeight: 800,
              fontSize: "clamp(2.8rem,5.5vw,5.5rem)",
              lineHeight: 1.02, letterSpacing: "-0.03em",
              marginBottom: 32,
            }}>
              <span className="grad-text">Starts with AI</span>
            </h1> */}

            <p className="anim-fade-up d300" style={{
              fontSize: "clamp(1rem,1.5vw,1.15rem)", color: "rgba(240,239,232,0.6)",
              maxWidth: 480, lineHeight: 1.7, marginBottom: 48,
            }}>
              SmartHire conducts professional AI interviews, evaluates candidates with precision, and delivers actionable insights — cutting hiring time by 80%.
            </p>

            {/* CTA buttons */}
            <div className="anim-fade-up d400 hero-cta-btns" style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 60 }}>
              <a href="/register" className="btn-primary">
                Start Free Trial
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
              <a href="#demo" className="btn-ghost">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Watch Demo
              </a>
            </div>

            {/* Stats */}
            <div className="anim-scale-in d500" style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
              maxWidth: 460,
            }}>
              {/* {stats.map(({ n, l }) => (
                <div key={l} className="stat-card" style={{
                  padding: "22px 18px", borderRadius: 20, textAlign: "center",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem,3vw,2.2rem)", color: "#c8f135", lineHeight: 1 }}>{n}</div>
                  <div style={{ color: "rgba(240,239,232,0.5)", fontSize: 12, marginTop: 6, lineHeight: 1.4 }}>{l}</div>
                </div>
              ))} */}
            </div>
          </div>

          {/* RIGHT: Globe column */}
          <div className="hero-globe-col anim-fade-in d300 ">
            <GlobePulse/>
          </div>

        </div>
      </div>

      {/* Floating badges */}
      <div className="float-badge hide-mobile" style={{ position: "absolute", bottom : 40 ,  left: "1%", animationDelay: "0s", padding: "12px 20px", borderRadius: 16, background: "rgba(10,10,15,0.9)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", whiteSpace: "nowrap", zIndex: 2 }}>
        <span style={{ fontSize: 20 }}>🎯</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--surface)" }}>Interview Complete</div>
          <div style={{ fontSize: 11, color: "#8a8a96" }}>Score: 94/100 · 2s ago</div>
        </div>
      </div>
      <div className="float-badge hide-mobile" style={{ position: "absolute", top: 100, right: "3%", animationDelay: "-3s", padding: "12px 20px", borderRadius: 16, background: "rgba(10,10,15,0.9)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", whiteSpace: "nowrap", zIndex: 2 }}>
        <span style={{ fontSize: 20 }}>⚡</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--surface)" }}>AI Report Ready</div>
          <div style={{ fontSize: 11, color: "#8a8a96" }}>Sarah K. · Senior Dev</div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// MARQUEE / LOGO STRIP
// ─────────────────────────────────────────────
function LogoMarquee() {
  const logos = ["Google", "Stripe", "Notion", "Linear", "Figma", "Vercel", "Airbnb", "Shopify", "Atlassian", "Salesforce"];
  const doubled = [...logos, ...logos];

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", padding: "40px 0" }}>
      <p style={{ textAlign: "center", marginBottom: 28, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a96" }}>
        Trusted by teams at
      </p>
      <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
        <div className="marquee-track">
          {doubled.map((name, i) => (
            <span key={i} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, color: "rgba(240,239,232,0.18)", letterSpacing: "-0.01em" }}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FEATURES
// ─────────────────────────────────────────────
const FEATURES = [
  { icon: "🤖", tag: "Core",        tagColor: "#c8f135", title: "AI as a Backup Recruiter",    desc: "When human recruiters are unavailable, AI conducts structured, professional interviews with natural conversation flow." },
  { icon: "📄", tag: "Smart",       tagColor: "#7bf1a8", title: "Resume-Aware Interviews",      desc: "AI analyzes resumes in real-time, asking job-specific questions tailored to each candidate's experience and skills." },
  { icon: "📊", tag: "Analytics",   tagColor: "#6b7fff", title: "Smart Analytics Dashboard",    desc: "Comprehensive scoring, behavioral insights, and downloadable PDF reports for data-driven hiring decisions." },
  { icon: "🎯", tag: "Custom",      tagColor: "#f9c74f", title: "Custom Interview Templates",   desc: "Pre-built templates for various roles or create your own with specific competency frameworks and scoring rubrics." },
  { icon: "⚖️", tag: "Fair",        tagColor: "#f8961e", title: "Bias-Free Evaluation",         desc: "Objective assessment algorithms that minimize unconscious bias and ensure fair, consistent candidate evaluation." },
  { icon: "🔄", tag: "Integration", tagColor: "#c77dff", title: "Seamless Integration",          desc: "Integrate with your existing ATS, calendar, and HR tools for a completely smooth workflow experience." },
];

function FeatureCard({ icon, tag, tagColor, title, desc, delay }) {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});
 
  // 3D Tilt + spotlight on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
 
    // Spotlight gradient (existing feat-card CSS uses --mx --my)
    cardRef.current.style.setProperty("--mx", (x / rect.width * 100) + "%");
    cardRef.current.style.setProperty("--my", (y / rect.height * 100) + "%");
 
    // Tilt angles — max 8deg same as reference component
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
 
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03) translateY(-6px)`,
      transition: "transform 0.1s ease-out",
      borderColor: "rgba(200,241,53,0.22)",
      boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
    });
  };
 
  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0px)",
      transition: "transform 0.4s ease-in-out",
      borderColor: "rgba(255,255,255,0.07)",
      boxShadow: "none",
    });
  };
 
  return (
    <div
      ref={cardRef}
      className="feat-card reveal"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: 36,
        borderRadius: 24,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)",
        transitionDelay: delay + "ms",
        transformStyle: "preserve-3d",
        willChange: "transform",
        ...tiltStyle,
      }}
    >
      {/* Content lifted in Z for depth feel */}
      <div style={{ transform: "translateZ(20px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <span style={{ fontSize: 36, lineHeight: 1 }}>{icon}</span>
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "4px 12px", borderRadius: 100,
            background: `${tagColor}18`, border: `1px solid ${tagColor}30`, color: tagColor,
          }}>
            {tag}
          </span>
        </div>
 
        <h3 style={{
          fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.2rem",
          color: "var(--surface)", marginBottom: 12, lineHeight: 1.3,
        }}>
          {title}
        </h3>
 
        <p style={{ color: "rgba(240,239,232,0.5)", fontSize: "0.93rem", lineHeight: 1.7 }}>
          {desc}
        </p>
 
        <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 6, color: tagColor, fontSize: 13, fontWeight: 600 }}>
          Learn more
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
 
function Features() {
  return (
    <section id="features" style={{ padding: "120px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="reveal" style={{ marginBottom: 72, textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a96", marginBottom: 16 }}>Platform Features</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,4rem)", lineHeight: 1.08, letterSpacing: "-0.025em", color: "var(--surface)", maxWidth: 600, margin: "0 auto" }}>
            Why <span className="grad-text">SmartHire</span> Stands Out
          </h2>
          <p style={{ color: "rgba(240,239,232,0.5)", fontSize: "1.05rem", maxWidth: 480, margin: "18px auto 0", lineHeight: 1.7 }}>
            Transform your hiring process with cutting-edge AI technology designed for modern recruitment.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {FEATURES.map((feat, i) => (
            <FeatureCard key={feat.title} {...feat} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────
const STEPS = [
  {
    n: "01",
    title: "Register Account",
    subtitle: "Get Started Free",
    desc: "Sign up in seconds as a recruiter or job seeker. No credit card needed — just your email and you're in.",
    emoji: "🧑‍💼",
    color: "#c8f135",
    glow: "rgba(200,241,53,0.18)",
    tag: "Onboarding",
    image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80",
  },
  {
    n: "02",
    title: "Login & Verify",
    subtitle: "Secure Access",
    desc: "Log in securely with 2FA protection. Your hiring data stays private and encrypted at all times.",
    emoji: "🔐",
    color: "#6b7fff",
    glow: "rgba(107,127,255,0.18)",
    tag: "Security",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80",
  },
  {
    n: "03",
    title: "Your Dashboard",
    subtitle: "Central Command",
    desc: "Your personalized hub — track interviews, monitor pipelines, and get AI-powered insights at a glance.",
    emoji: "📊",
    color: "#f9c74f",
    glow: "rgba(249,199,79,0.18)",
    tag: "Dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    n: "04",
    title: "Post a Job",
    subtitle: "List Opportunity",
    desc: "Recruiters create detailed job listings with role-specific AI interview questions or pick from expert templates.",
    emoji: "📝",
    color: "#ff6b9d",
    glow: "rgba(255,107,157,0.18)",
    tag: "Recruitment",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  },
  {
    n: "05",
    title: "Candidate Applies",
    subtitle: "One-Click Apply",
    desc: "Candidates discover matched jobs and apply instantly. Smart AI surfaces the right roles for the right people.",
    emoji: "🚀",
    color: "#00d4aa",
    glow: "rgba(0,212,170,0.18)",
    tag: "Application",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  },
  {
    n: "06",
    title: "AI Interview",
    subtitle: "Smart Conversations",
    desc: "AI conducts adaptive interviews at the candidate's convenience — scoring, analysing, and following up in real time.",
    emoji: "🎤",
    color: "#c8f135",
    glow: "rgba(200,241,53,0.18)",
    tag: "AI Interview",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
  },
  {
    n: "07",
    title: "Review Reports",
    subtitle: "Deep Insights",
    desc: "Detailed AI scorecards, sentiment analysis, and side-by-side candidate comparisons — all in one place.",
    emoji: "📈",
    color: "#6b7fff",
    glow: "rgba(107,127,255,0.18)",
    tag: "Analytics",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    n: "08",
    title: "Hire & Onboard",
    subtitle: "Confident Decision",
    desc: "Make data-driven offers confidently. Streamlined onboarding flows get your new hire productive from day one.",
    emoji: "🏆",
    color: "#f9c74f",
    glow: "rgba(249,199,79,0.18)",
    tag: "Hiring",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
  },
];
 
const STATS = [
  { label: "Faster Scheduling", val: "90%", color: "#c8f135" },
  { label: "Screening Speed",   val: "82%", color: "#6b7fff" },
  { label: "Report Generation", val: "95%", color: "#f9c74f" },
  { label: "Bias Eliminated",   val: "99%", color: "#ff6b9d" },
  { label: "Time-to-Hire Cut",  val: "78%", color: "#00d4aa" },
];
 
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}
 
function HowItWorks() {
  const [expanded, setExpanded] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [headerRef, headerVisible] = useInView();
  const [cardsRef, cardsVisible] = useInView(0.05);
  const [statsRef, statsVisible] = useInView();
 
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
 
  return (
    <section
      id="how-it-works"
      style={{
        padding: "clamp(64px,10vw,140px) 0",
        background: "#080810",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');
 
        .hiw-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.07);
          transition:
            width 0.65s cubic-bezier(0.22,1,0.36,1),
            height 0.65s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.4s ease,
            border-color 0.4s ease;
          background: #10101c;
        }
 
        .hiw-card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.65s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease;
        }
 
        .hiw-overlay {
          position: absolute;
          inset: 0;
          transition: background 0.5s ease;
        }
 
        .hiw-collapsed {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 20px;
          gap: 8px;
          transition: opacity 0.3s ease;
        }
 
        .hiw-expanded {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: clamp(18px,3vw,28px);
          transition: opacity 0.4s ease 0.18s, transform 0.45s ease 0.12s;
        }
 
        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: 12px;
        }
 
        .step-num-big {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.8rem,5vw,4.2rem);
          line-height: 1;
          margin-bottom: 6px;
          user-select: none;
        }
 
        .hiw-hint {
          text-align: center;
          color: rgba(240,239,232,0.2);
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          margin-top: 16px;
          letter-spacing: 0.06em;
        }
 
        .cta-primary {
          padding: clamp(12px,2vw,15px) clamp(24px,4vw,36px);
          border-radius: 99px;
          border: none;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(13px,1.5vw,15px);
          background: linear-gradient(135deg,#c8f135,#a8d100);
          color: #080810;
          box-shadow: 0 8px 28px rgba(200,241,53,0.28);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cta-primary:hover { transform:scale(1.04); box-shadow:0 12px 40px rgba(200,241,53,0.48); }
 
        .cta-ghost {
          padding: clamp(12px,2vw,15px) clamp(24px,4vw,36px);
          border-radius: 99px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: clamp(13px,1.5vw,15px);
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(240,239,232,0.6);
          transition: border-color 0.2s, color 0.2s;
        }
        .cta-ghost:hover { border-color:rgba(255,255,255,0.3); color:#f0efe8; }
 
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(0.78); }
        }
 
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
 
      {/* BG blobs */}
      <div style={{ position:"absolute", top:"8%", left:"-10%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(107,127,255,0.055) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"12%", right:"-6%", width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle,rgba(200,241,53,0.045) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.032) 1px,transparent 1px)", backgroundSize:"32px 32px", pointerEvents:"none" }} />
 
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 clamp(16px,5vw,48px)", position:"relative", zIndex:1 }}>
 
        {/* ── HEADER ── */}
        <div
          ref={headerRef}
          style={{
            textAlign:"center",
            marginBottom:"clamp(40px,6vw,72px)",
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(28px)",
            transition:"opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            padding:"6px 18px", borderRadius:99,
            background:"rgba(200,241,53,0.08)",
            border:"1px solid rgba(200,241,53,0.2)",
            marginBottom:24,
          }}>
            <div style={{ width:6,height:6,borderRadius:"50%",background:"#c8f135",boxShadow:"0 0 10px #c8f135",animation:"pulse 2s ease-in-out infinite" }} />
            <span style={{ color:"#c8f135",fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif" }}>
              Complete Hiring Flow
            </span>
          </div>
 
          <h2 style={{
            fontFamily:"'Syne',sans-serif",
            fontWeight:800,
            fontSize:"clamp(1.9rem,5.5vw,4.2rem)",
            lineHeight:1.05,
            letterSpacing:"-0.03em",
            color:"#f0efe8",
            marginBottom:18,
          }}>
            From Signup to{" "}
            <span style={{
              background:"linear-gradient(135deg,#c8f135 0%,#6b7fff 55%,#f9c74f 100%)",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
              backgroundClip:"text",
            }}>
              Smart Hire
            </span>
          </h2>
 
          <p style={{
            color:"rgba(240,239,232,0.42)",
            fontSize:"clamp(0.87rem,2vw,1.05rem)",
            maxWidth:500, margin:"0 auto",
            lineHeight:1.8,
            fontFamily:"'DM Sans',sans-serif",
          }}>
            8 seamless steps — hover each card to explore the full AI-powered hiring journey.
          </p>
        </div>
 
        {/* ── EXPAND-ON-HOVER CARDS (desktop) ── */}
        {!isMobile && (
          <>
            <div
              ref={cardsRef}
              style={{
                display:"flex",
                justifyContent:"center",
                gap:10,
                alignItems:"stretch",
                height: "clamp(360px,45vw,540px)",
                maxWidth: "95vw",
                margin: "0 auto",
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? "translateY(0)" : "translateY(36px)",
                transition:"opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s",
              }}
            >
              {STEPS.map((step, i) => {
                const isOpen = expanded === i;
                return (
                  <div
                    key={step.n}
                    className="hiw-card"
                    onMouseEnter={() => setExpanded(i)}
                    style={{
                      width: isOpen ? "clamp(400px,14vw,450px)" : "clamp(52px,6vw,78px)",
                      boxShadow: isOpen ? `0 20px 60px ${step.glow}` : "none",
                      borderColor: isOpen ? `${step.color}45` : "rgba(255,255,255,0.07)",
                    }}
                  >
                    {/* Image */}
                    <img
                      className="hiw-card-img"
                      src={step.image}
                      alt={step.title}
                      style={{
                        opacity: isOpen ? 0.92 : 0.92,
                        transform: isOpen ? "scale(1.06)" : "scale(1)",
                      }}
                    />
 
                    {/* Overlay */}
                    <div
                      className="hiw-overlay"
                      style={{
                        background: isOpen
                          ? `linear-gradient(to top, #080810 38%, ${step.color}06 100%)`
                          : "linear-gradient(to top, #080810 55%, rgba(8,8,16,0.75) 100%)",
                      }}
                    />
 
                    {/* Top color bar */}
                    <div style={{
                      position:"absolute", top:0, left:0, right:0, height:3,
                      background:`linear-gradient(90deg,${step.color},transparent)`,
                      opacity: isOpen ? 1 : 0.35,
                      transition:"opacity 0.4s",
                    }} />
 
                    {/* COLLAPSED content */}
                    <div className="hiw-collapsed" style={{ opacity: isOpen ? 0 : 1 }}>
                      <span style={{ fontSize:20 }}>{step.emoji}</span>
                      <span style={{
                        color:step.color, fontSize:14, fontWeight:800,
                        fontFamily:"'Syne',sans-serif",
                        transform: "rotate(0deg)",
                        display: "block",
                        textAlign: "center",
                        marginTop: 8,
                      }}>
                        {step.n}
                      </span>
                    </div>
 
                    {/* EXPANDED content */}
                    <div
                      className="hiw-expanded"
                      style={{
                        opacity: isOpen ? 1 : 0,
                        transform: isOpen ? "translateY(0)" : "translateY(18px)",
                      }}
                    >
                      <div
                        className="tag-pill"
                        style={{ background:`${step.color}18`, border:`1px solid ${step.color}35`, color:step.color }}
                      >
                        <div style={{ width:4,height:4,borderRadius:"50%",background:step.color,boxShadow:`0 0 5px ${step.color}` }} />
                        {step.tag}
                      </div>
 
                      <div className="step-num-big" style={{ color:`${step.color}22` }}>{step.n}</div>
 
                      <div style={{ fontSize:"clamp(24px,3.5vw,36px)", marginBottom:10 }}>{step.emoji}</div>
 
                      <h3 style={{
                        fontFamily:"'Syne',sans-serif", fontWeight:800,
                        fontSize:"clamp(0.95rem,1.8vw,1.2rem)",
                        color:"#f0efe8", marginBottom:5, lineHeight:1.2,
                      }}>
                        {step.title}
                      </h3>
 
                      <p style={{
                        color:step.color, fontSize:10, fontWeight:600,
                        letterSpacing:"0.1em", textTransform:"uppercase",
                        marginBottom:12, fontFamily:"'DM Sans',sans-serif",
                      }}>
                        {step.subtitle}
                      </p>
 
                      <p style={{
                        color:"rgba(240,239,232,0.48)",
                        fontSize:"clamp(0.75rem,1.3vw,0.84rem)",
                        lineHeight:1.8,
                        fontFamily:"'DM Sans',sans-serif",
                      }}>
                        {step.desc}
                      </p>
 
                      <div style={{ marginTop:16, height:2, borderRadius:2, background:`linear-gradient(90deg,${step.color},transparent)` }} />
                    </div>
                  </div>
                );
              })}
            </div>
 
            <p className="hiw-hint">← hover each card to explore the full flow →</p>
          </>
        )}
 
        {/* ── MOBILE: vertical stack ── */}
        {isMobile && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {STEPS.map((step, i) => {
              const isOpen = expanded === i;
              return (
                <div
                  key={step.n}
                  onClick={() => setExpanded(isOpen ? -1 : i)}
                  style={{
                    position:"relative",
                    borderRadius:18,
                    overflow:"hidden",
                    border:`1px solid ${isOpen ? step.color+"40" : "rgba(255,255,255,0.07)"}`,
                    background:"#10101c",
                    cursor:"pointer",
                    transition:"border-color 0.35s, box-shadow 0.35s",
                    boxShadow: isOpen ? `0 12px 40px ${step.glow}` : "none",
                  }}
                >
                  {/* Image */}
                  <img
                    src={step.image}
                    alt={step.title}
                    style={{
                      position:"absolute", inset:0, width:"100%", height:"100%",
                      objectFit:"cover", opacity:0.15,
                    }}
                  />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,#080810 55%,transparent)" }} />
 
                  {/* Top bar */}
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${step.color},transparent)`, opacity:isOpen ? 1 : 0.4 }} />
 
                  {/* Header row */}
                  <div style={{
                    position:"relative", zIndex:1,
                    display:"flex", alignItems:"center", gap:14,
                    padding:"18px 20px",
                  }}>
                    <div style={{
                      width:38, height:38, borderRadius:10,
                      background:`${step.color}18`,
                      border:`1px solid ${step.color}35`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:18, flexShrink:0,
                    }}>
                      {step.emoji}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{
                        fontFamily:"'Syne',sans-serif", fontWeight:800,
                        fontSize:"0.95rem", color:"#f0efe8",
                      }}>
                        {step.title}
                      </div>
                      <div style={{ color:step.color, fontSize:10, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>
                        {step.n} · {step.tag}
                      </div>
                    </div>
                    <div style={{
                      color:"rgba(240,239,232,0.35)",
                      fontSize:18,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition:"transform 0.35s",
                    }}>
                      ↓
                    </div>
                  </div>
 
                  {/* Expanded body */}
                  <div style={{
                    position:"relative", zIndex:1,
                    maxHeight: isOpen ? 200 : 0,
                    overflow:"hidden",
                    transition:"max-height 0.5s cubic-bezier(0.22,1,0.36,1)",
                  }}>
                    <p style={{
                      color:"rgba(240,239,232,0.5)",
                      fontSize:"0.84rem",
                      lineHeight:1.8,
                      fontFamily:"'DM Sans',sans-serif",
                      padding:"0 20px 20px",
                    }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
 
        {/* ── STATS ── */}
        <div
          ref={statsRef}
          style={{
            marginTop:"clamp(40px,6vw,72px)",
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,160px),1fr))",
            gap:"clamp(8px,1.5vw,14px)",
            opacity: statsVisible ? 1 : 0,
            transform: statsVisible ? "translateY(0)" : "translateY(24px)",
            transition:"opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s",
          }}
        >
          {STATS.map(s => (
            <div key={s.label} style={{
              padding:"clamp(14px,2.5vw,22px) clamp(12px,2vw,18px)",
              borderRadius:16,
              background:"rgba(255,255,255,0.022)",
              border:"1px solid rgba(255,255,255,0.06)",
              textAlign:"center",
            }}>
              <div style={{
                fontFamily:"'Syne',sans-serif", fontWeight:800,
                fontSize:"clamp(1.4rem,3.2vw,2.1rem)",
                color:s.color, lineHeight:1, marginBottom:8,
                textShadow:`0 0 24px ${s.color}45`,
              }}>
                {s.val}
              </div>
              <div style={{
                color:"rgba(240,239,232,0.38)",
                fontSize:"clamp(9px,1.3vw,11px)",
                fontWeight:600, letterSpacing:"0.09em",
                textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif",
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
 
        {/* ── CTA ── */}
        <div style={{
          marginTop:"clamp(32px,5vw,52px)",
          display:"flex", flexDirection:"column",
          alignItems:"center", gap:14, textAlign:"center",
          opacity: statsVisible ? 1 : 0,
          transform: statsVisible ? "translateY(0)" : "translateY(16px)",
          transition:"opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.45s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.45s",
        }}>
          <p style={{ color:"rgba(240,239,232,0.28)", fontSize:"clamp(0.77rem,1.7vw,0.9rem)", fontFamily:"'DM Sans',sans-serif" }}>
            Join 2,400+ companies already hiring smarter
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
            <button className="cta-primary">Start Hiring Free →</button>
            <button className="cta-ghost">Watch Demo</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────
const TestimonialsColumn = ({ testimonials, duration }) => {
  return (
    <div style={{ overflow: "hidden" }}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
      >
        {[...testimonials, ...testimonials].map((t, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            style={{
              padding: 36,
              borderRadius: 24,
              background: "linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.07)",
              minWidth: 300,
              maxWidth: 350,
            }}
          >
            <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
              {[...Array(5)].map((_, s) => (
                <span key={s} style={{ color: "#c8f135", fontSize: 16 }}>★</span>
              ))}
            </div>
            <p style={{
              color: "rgba(240,239,232,0.75)",
              lineHeight: 1.75,
              fontSize: "0.97rem",
              marginBottom: 28,
              fontStyle: "italic",
              margin: "0 0 28px 0"
            }}>
              "{t.text}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#c8f135,#3b5bfc)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "#0a0a0f",
                flexShrink: 0
              }}>
                {t.initials}
              </div>
              <div>
                <div style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--surface)"
                }}>
                  {t.name}
                </div>
                <div style={{ color: "#8a8a96", fontSize: 13, marginTop: 2 }}>
                  {t.role}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

function Testimonials() {
  const TESTIMONIALS = [
    {
      text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
      name: "Briana Patton",
      role: "Operations Manager",
      initials: "BP"
    },
    {
      text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
      name: "Bilal Ahmed",
      role: "IT Manager",
      initials: "BA"
    },
    {
      text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
      name: "Saman Malik",
      role: "Customer Support Lead",
      initials: "SM"
    },
    {
      text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
      name: "Omar Raza",
      role: "CEO",
      initials: "OR"
    },
    {
      text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
      name: "Zainab Hussain",
      role: "Project Manager",
      initials: "ZH"
    },
    {
      text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
      name: "Aliza Khan",
      role: "Business Analyst",
      initials: "AK"
    },
    {
      text: "Our business functions improved with a user-friendly design and positive customer feedback.",
      name: "Farhan Siddiqui",
      role: "Marketing Director",
      initials: "FS"
    },
    {
      text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
      name: "Sana Sheikh",
      role: "Sales Manager",
      initials: "SS"
    },
    {
      text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
      name: "Hassan Ali",
      role: "E-commerce Manager",
      initials: "HA"
    }
  ];

  const firstColumn = TESTIMONIALS.slice(0, 3);
  const secondColumn = TESTIMONIALS.slice(3, 6);
  const thirdColumn = TESTIMONIALS.slice(6, 9);

  return (
    <section id="testimonials" style={{ padding: "120px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="reveal"
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8a8a96",
            marginBottom: 16
          }}>
            Testimonials
          </p>
          <h2 style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem,4.5vw,4rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            color: "var(--surface)"
          }}>
            What our <span className="grad-text">users say</span>
          </h2>
          <p style={{
            color: "#8a8a96",
            fontSize: "1.1rem",
            marginTop: 16,
            maxWidth: 600,
            margin: "16px auto 0"
          }}>
            Discover how thousands of teams streamline their operations with our platform.
          </p>
        </motion.div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          marginTop: 40,
          maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          maxHeight: 740,
          overflow: "hidden"
        }}>
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <div className="hidden md:block">
            <TestimonialsColumn testimonials={secondColumn} duration={19} />
          </div>
          <div className="hidden lg:block">
            <TestimonialsColumn testimonials={thirdColumn} duration={17} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────
const PLANS = [
  { 
    name: "Starter", 
    price: "$99", 
    period: "/month", 
    desc: "Perfect for small teams getting started", 
    features: ["Up to 10 interviews/month", "Basic AI interviews", "Standard reports", "Email support"],
    featured: false,
    cta: "Start Free Trial"
  },
  { 
    name: "Professional", 
    price: "$299", 
    period: "/month", 
    desc: "Most popular for growing companies", 
    features: ["Up to 50 interviews/month", "Advanced AI interviews", "Detailed analytics", "Priority support", "Custom templates", "ATS integration"],
    featured: true,
    cta: "Start Free Trial"
  },
  { 
    name: "Enterprise", 
    price: "Custom", 
    period: "", 
    desc: "For large organizations with custom needs", 
    features: ["Unlimited interviews", "Custom AI models", "Dedicated support", "White-label option", "API access", "Custom training"],
    featured: false,
    cta: "Contact Sales"
  },
];

function Pricing() {
  const [visibleCards, setVisibleCards] = useState([]);
  const [visibleFeatures, setVisibleFeatures] = useState({});
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate header first
            setTimeout(() => {
              // Animate cards one by one
              PLANS.forEach((_, index) => {
                setTimeout(() => {
                  setVisibleCards(prev => [...prev, index]);
                }, index * 300);
              });
            }, 200);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Animate features after card appears
    visibleCards.forEach((cardIndex, i) => {
      setTimeout(() => {
        PLANS[cardIndex].features.forEach((_, featureIndex) => {
          setTimeout(() => {
            setVisibleFeatures(prev => ({
              ...prev,
              [`${cardIndex}-${featureIndex}`]: true
            }));
          }, featureIndex * 100);
        });
      }, i * 300 + 400);
    });
  }, [visibleCards]);

  return (
    <section id="pricing" className="pricing-section" ref={sectionRef}>
      <style>{`
        .pricing-section {
          padding: 120px 0;
          background: linear-gradient(180deg, #0a0a0f 0%, #13131a 100%);
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .pricing-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(200,241,53,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .pricing-section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(200,241,53,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .pricing-container {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 0 32px;
          position: relative;
          z-index: 1;
        }

        .pricing-header {
          text-align: center;
          margin-bottom: 80px;
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pricing-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .pricing-badge {
          display: inline-block;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #c8f135;
          background: rgba(200,241,53,0.08);
          padding: 10px 24px;
          border-radius: 50px;
          margin-bottom: 28px;
          border: 1px solid rgba(200,241,53,0.15);
        }

        .pricing-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.08;
          letter-spacing: -0.025em;
          color: #f0efe8;
          margin: 0 0 20px 0;
        }

        .grad-text {
          background: linear-gradient(135deg, #c8f135 0%, #e5ff7a 50%, #c8f135 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        .pricing-subtitle {
          color: rgba(240,239,232,0.5);
          font-size: 1.15rem;
          margin: 0;
          max-width: 500px;
          margin: 0 auto;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 1300px;
          margin: 0 auto;
          align-items: center;
        }

        .price-card {
          padding: 48px 40px;
          border-radius: 28px;
          position: relative;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(20px);
          opacity: 0;
          transform: translateY(60px) scale(0.95);
        }

        .price-card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .price-card.default {
          background: rgba(255,255,255,0.03);
          border: 1.5px solid rgba(255,255,255,0.06);
        }

        .price-card.default:hover {
          transform: translateY(-12px) scale(1.02);
          border-color: rgba(200,241,53,0.3);
          box-shadow: 0 30px 80px -30px rgba(200,241,53,0.2);
        }

        .price-card.featured {
          background: linear-gradient(135deg, #c8f135 0%, #b0e020 100%);
          border: 2px solid #c8f135;
          box-shadow: 0 25px 80px -25px rgba(200,241,53,0.35);
          z-index: 2;
          transform: translateY(60px) scale(1.08);
        }

        .price-card.featured.visible {
          transform: translateY(0) scale(1.06);
        }

        .price-card.featured:hover {
          transform: translateY(-12px) scale(1.06);
          box-shadow: 0 35px 90px -25px rgba(200,241,53,0.5);
        }

        .popular-badge {
          position: absolute;
          top: -1px;
          left: 50%;
          transform: translateX(-50%);
          background: #0a0a0f;
          color: #c8f135;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          padding: 10px 28px;
          border-radius: 0 0 18px 18px;
          border: 1px solid rgba(255,255,255,0.1);
          border-top: none;
          white-space: nowrap;
          animation: badgePulse 2s ease-in-out infinite;
        }

        .plan-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 8px;
        }

        .plan-desc {
          font-size: 14px;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 40px;
        }

        .price-amount {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 3.5rem;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .price-period {
          font-size: 16px;
          font-weight: 500;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 48px;
          list-style: none;
          padding: 0;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          font-size: 0.95rem;
          line-height: 1.5;
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .feature-item.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .feature-check {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          margin-top: 1px;
        }

        .cta-button {
          display: block;
          text-align: center;
          padding: 16px 28px;
          border-radius: 16px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .cta-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .cta-button:hover::after {
          width: 400px;
          height: 400px;
        }

        .cta-button:active {
          transform: scale(0.96);
        }

        @keyframes shimmer {
          to {
            background-position: 200% center;
          }
        }

        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,241,53,0.4); }
          50% { box-shadow: 0 0 0 15px rgba(200,241,53,0); }
        }

        @media (min-width: 1440px) {
          .pricing-grid {
            max-width: 1400px;
            gap: 40px;
          }
          .price-card {
            padding: 56px 48px;
          }
        }

        @media (max-width: 1200px) {
          .pricing-grid {
            gap: 24px;
            max-width: 1000px;
          }
          .price-card {
            padding: 40px 32px;
          }
          .price-amount {
            font-size: 2.8rem;
          }
        }

        @media (max-width: 900px) {
          .pricing-section {
            padding: 80px 0;
          }
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 500px;
            gap: 24px;
          }
          .price-card.featured {
            transform: translateY(60px) scale(1);
          }
          .price-card.featured.visible {
            transform: translateY(0) scale(1);
          }
          .price-card.featured:hover {
            transform: translateY(-8px) scale(1);
          }
          .pricing-header {
            margin-bottom: 60px;
          }
        }

        @media (max-width: 640px) {
          .pricing-section {
            padding: 60px 0;
          }
          .pricing-container {
            padding: 0 20px;
          }
          .pricing-header {
            margin-bottom: 48px;
          }
          .pricing-title {
            font-size: clamp(2rem, 8vw, 2.5rem);
          }
          .pricing-subtitle {
            font-size: 1rem;
          }
          .price-card {
            padding: 36px 28px;
            border-radius: 24px;
          }
          .price-amount {
            font-size: 2.5rem;
          }
          .pricing-grid {
            gap: 20px;
          }
          .features-list {
            gap: 14px;
            margin-bottom: 36px;
          }
          .cta-button {
            padding: 14px 24px;
            font-size: 15px;
          }
        }

        @media (max-width: 380px) {
          .pricing-container {
            padding: 0 16px;
          }
          .price-card {
            padding: 28px 20px;
          }
          .price-amount {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="pricing-container">
        <div className={`pricing-header ${visibleCards.length > 0 ? 'visible' : ''}`}>
          <div className="pricing-badge">Pricing Plans</div>
          <h2 className="pricing-title">
            Simple, <span className="grad-text">Transparent</span> Pricing
          </h2>
          <p className="pricing-subtitle">
            No hidden fees, no surprises. Choose what fits your hiring needs.
          </p>
        </div>

        <div className="pricing-grid">
          {PLANS.map((plan, index) => (
            <div
              key={plan.name}
              className={`price-card ${plan.featured ? "featured" : "default"} ${visibleCards.includes(index) ? 'visible' : ''}`}
            >
              {plan.featured && (
                <div className="popular-badge">
                  ⚡ MOST POPULAR
                </div>
              )}
              
              <div 
                className="plan-name"
                style={{ 
                  color: plan.featured ? "#0a0a0f" : "#f0efe8",
                  marginTop: plan.featured ? '20px' : '0'
                }}
              >
                {plan.name}
              </div>
              
              <div 
                className="plan-desc"
                style={{ 
                  color: plan.featured ? "rgba(10,10,15,0.6)" : "#8a8a96"
                }}
              >
                {plan.desc}
              </div>
              
              <div className="plan-price">
                <span 
                  className="price-amount"
                  style={{ 
                    color: plan.featured ? "#0a0a0f" : "#f0efe8"
                  }}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span 
                    className="price-period"
                    style={{ 
                      color: plan.featured ? "rgba(10,10,15,0.5)" : "#8a8a96"
                    }}
                  >
                    {plan.period}
                  </span>
                )}
              </div>
              
              <ul className="features-list">
                {plan.features.map((f, featureIndex) => (
                  <li 
                    key={f} 
                    className={`feature-item ${visibleFeatures[`${index}-${featureIndex}`] ? 'visible' : ''}`}
                  >
                    <span 
                      className="feature-check"
                      style={{ 
                        background: plan.featured 
                          ? "rgba(10,10,15,0.12)" 
                          : "rgba(200,241,53,0.12)",
                        color: plan.featured ? "#0a0a0f" : "#c8f135"
                      }}
                    >
                      ✓
                    </span>
                    <span style={{ 
                      color: plan.featured ? "#16161e" : "rgba(240,239,232,0.7)"
                    }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              
              <a 
                href="/register" 
                className="cta-button"
                style={{ 
                  background: plan.featured 
                    ? "#0a0a0f" 
                    : "rgba(200,241,53,0.1)",
                  color: plan.featured ? "#c8f135" : "#c8f135",
                  border: plan.featured 
                    ? "2px solid #0a0a0f" 
                    : "1px solid rgba(200,241,53,0.2)",
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>{plan.cta}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────
function CTA() {
  const [cubeTilt, setCubeTilt] = useState({ x: -6, y: 8 });
  const [isDraggingCube, setIsDraggingCube] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const startTiltRef = useRef({ x: -6, y: 8 });

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const onCubePointerDown = (e) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    startTiltRef.current = { ...cubeTilt };
    setIsDraggingCube(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onCubePointerMove = (e) => {
    if (!isDraggingCube) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setCubeTilt({
      x: clamp(startTiltRef.current.x - dy * 0.08, -18, 18),
      y: clamp(startTiltRef.current.y + dx * 0.08, -25, 25),
    });
  };

  const onCubePointerUp = (e) => {
    if (!isDraggingCube) return;
    setIsDraggingCube(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const onCubePointerLeave = () => {
    if (!isDraggingCube) {
      setCubeTilt({ x: -6, y: 8 });
    }
  };

  return (
    <section style={{ padding: "120px 0", position: "relative", overflow: "hidden", background: "transparent" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 32, alignItems: "center" }}>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a96", marginBottom: 20 }}>Get Started Today</p>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,4rem)", lineHeight: 1.08, letterSpacing: "-0.025em", color: "var(--surface)", marginBottom: 20 }}>
              Ready to Transform<br /><span className="grad-text">Your Hiring?</span>
            </h2>
            <p style={{ color: "rgba(240,239,232,0.55)", fontSize: "1.05rem", marginBottom: 40, lineHeight: 1.7, maxWidth: 560 }}>
              Join thousands of companies already making smarter hiring decisions with SmartHire.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
              <a href="/register" className="btn-primary" style={{ fontSize: 16, padding: "18px 36px" }}>
                Start Free 14-Day Trial
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
              <a href="/demo" className="btn-ghost" style={{ fontSize: 16, padding: "17px 36px" }}>Schedule a Demo</a>
            </div>
            <p style={{ color: "#8a8a96", fontSize: 13 }}>No credit card required · Cancel anytime · 24/7 Support</p>
          </div>

          <div className="cta-visual-col">
            <div className="cta-cube-shell" style={{
              borderRadius: 24,
              overflow: "hidden",
              border: "none",
              boxShadow: "none",
              background: "transparent",
              transformOrigin: "center",
              transform: `rotateX(${cubeTilt.x}deg) rotateY(${cubeTilt.y}deg)`,
              transition: isDraggingCube ? "transform 70ms linear" : "transform 350ms cubic-bezier(0.16,1,0.3,1)",
              willChange: "transform",
              cursor: isDraggingCube ? "grabbing" : "grab",
            }}>
              <video
                src="/cube.webm"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onPointerDown={onCubePointerDown}
                onPointerMove={onCubePointerMove}
                onPointerUp={onCubePointerUp}
                onPointerCancel={onCubePointerUp}
                onPointerLeave={onCubePointerLeave}
                style={{
                  width: "100%",
                  display: "block",
                  objectFit: "contain",
                  background: "transparent",
                  mixBlendMode: "lighten",
                  touchAction: "none",
                  userSelect: "none",
                  imageRendering: "auto",
                  backfaceVisibility: "hidden",
                  transform: "translateZ(0)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
const FOOTER_COLS = [
  { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
  { title: "Legal",   links: ["Privacy", "Terms", "Cookie Policy"] },
];

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "60px 24px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between", marginBottom: 48 }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#c8f135", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "var(--surface)" }}>SmartHire</span>
            </div>
            <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.7 }}>AI-powered hiring platform that helps modern teams find exceptional talent faster and smarter.</p>
          </div>
          {FOOTER_COLS.map(({ title, links }) => (
            <div key={title}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "var(--surface)", marginBottom: 16 }}>{title}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((l) => <a key={l} href="#" className="footer-link">{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#8a8a96", fontSize: 13 }}>© 2026 SmartHire Inc. All rights reserved.</p>
          <p style={{ color: "#8a8a96", fontSize: 13 }}>Made with ⚡ for the future of hiring</p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function Home() {
  useScrollReveal();

  return (
    <>
      <GlobalStyles />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <LogoMarquee />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}