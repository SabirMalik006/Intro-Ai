"use client";

import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────
// GLOBAL STYLES (injected once into <head>)
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

    /* ── Noise overlay ── */
    body::after {
      content: '';
      position: fixed; inset: 0; z-index: 9997;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      opacity: 0.028;
      pointer-events: none;
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--ink); }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

    /* ── Animations ── */
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

    /* ── Utility animation classes ── */
    .anim-fade-up   { animation: fadeUp  0.7s cubic-bezier(0.16,1,0.3,1) both; }
    .anim-fade-in   { animation: fadeIn  0.6s ease both; }
    .anim-scale-in  { animation: scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) both; }

    .d100 { animation-delay: 0.10s; }
    .d200 { animation-delay: 0.20s; }
    .d300 { animation-delay: 0.30s; }
    .d400 { animation-delay: 0.40s; }
    .d500 { animation-delay: 0.50s; }

    /* ── Scroll reveal ── */
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

    /* ── Gradient text ── */
    .grad-text {
      background: linear-gradient(135deg, #c8f135 0%, #7bf1a8 50%, #6b7fff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Marquee ── */
    .marquee-track {
      animation: marquee 28s linear infinite;
      display: inline-flex;
      gap: 60px;
    }
    .marquee-track:hover { animation-play-state: paused; }

    /* ── Float badge ── */
    .float-badge {
      animation: float 6s ease infinite;
    }

    /* ── Orb ── */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.35;
      animation: float 14s ease infinite;
    }

    /* ── Feature card glow on hover ── */
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

    /* ── Testimonial card ── */
    .testi-card {
      transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s;
    }
    .testi-card:hover { transform: translateY(-8px); border-color: rgba(200,241,53,0.18) !important; }

    /* ── Pricing card ── */
    .price-card { transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1); }
    .price-card:hover { transform: translateY(-8px); }
    .price-card.featured { animation: glow-pulse 3s ease infinite; }

    /* ── Stat card ── */
    .stat-card { transition: transform 0.3s ease, border-color 0.3s ease; }
    .stat-card:hover { transform: translateY(-4px); border-color: rgba(200,241,53,0.2) !important; }

    /* ── Progress bar ── */
    .bar-fill { animation: bar-fill 1.5s cubic-bezier(0.16,1,0.3,1) both; }

    /* ── Nav link ── */
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

    /* ── Buttons ── */
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

    /* ── Footer link ── */
    .footer-link {
      color: #8a8a96; font-size: 14px; text-decoration: none;
      transition: color 0.25s;
    }
    .footer-link:hover { color: var(--surface); }

    /* ── Responsive adjustments ── */
    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .hero-title  { font-size: clamp(2.4rem, 10vw, 3.6rem) !important; }
      
      /* Mobile padding adjustments */
      section { padding-left: 16px !important; padding-right: 16px !important; }
      
      /* Stack grids on mobile */
      .grid-responsive { grid-template-columns: 1fr !important; }
      
      /* Center align all text on mobile */
      .mobile-center { text-align: center !important; }
      
      /* Reduce stat card font size */
      .stat-card { padding: 20px 16px !important; }
    }
    
    @media (max-width: 480px) {
      /* Extra small screens */
      .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
    }
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
      // ring follows with a small lag via setTimeout
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
      <div
        ref={dotRef}
        style={{
          ...base,
          width: 8, height: 8,
          background: "#c8f135",
          borderRadius: "50%",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={ringRef}
        style={{
          ...base,
          width: 36, height: 36,
          border: "1.5px solid rgba(200,241,53,0.5)",
          borderRadius: "50%",
          transition: "width 0.3s ease, height 0.3s ease",
          zIndex: 9998,
        }}
      />
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
// NAVBAR
// ─────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        transition: "all 0.4s ease",
        background: scrolled ? "rgba(10,10,15,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#c8f135", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "var(--surface)" }}>SmartHire</span>
        </a>

        {/* Links */}
        <div className="hide-mobile" style={{ display: "flex", gap: 36 }}>
          {["Features", "How It Works", "Pricing", "Testimonials"].map((label) => (
            <a key={label} href={`#${label.toLowerCase().replace(/ /g, "-")}`} className="nav-link">{label}</a>
          ))}
        </div>

        {/* CTA */}
        <div className="hide-mobile" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/login" style={{ color: "rgba(240,239,232,0.6)", fontWeight: 500, fontSize: 14, textDecoration: "none", padding: "8px 16px" }}>Sign in</a>
          <a href="/register" className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}>Get Started</a>
        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────
function Hero() {
  const stats = [
    { n: "5,", l: "Interviews Conducted" },
    { n: "9", l: "Candidate Satisfaction" },
    { n: "40", l: "Saved Per Hire" },
    { n: "2+", l: "Companies Trust Us" },
  ];

  return (
    <section
      style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center",
        overflow: "hidden", paddingTop: 80,
      }}
    >
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

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px", position: "relative", zIndex: 1, width: "100%", textAlign: "center" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

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
          <h1
            className="hero-title anim-fade-up d100"
            style={{
              fontFamily: "'Syne',sans-serif", fontWeight: 800,
              fontSize: "clamp(2.8rem,7vw,6.5rem)",
              lineHeight: 1.02, letterSpacing: "-0.03em",
              color: "var(--surface)", marginBottom: 12,
            }}
          >
            Smarter Hiring
          </h1>
          <h1
            className="hero-title anim-fade-up d200"
            style={{
              fontFamily: "'Syne',sans-serif", fontWeight: 800,
              fontSize: "clamp(2.8rem,7vw,6.5rem)",
              lineHeight: 1.02, letterSpacing: "-0.03em",
              marginBottom: 32,
            }}
          >
            <span className="grad-text">Starts with AI</span>
          </h1>

          <p
            className="anim-fade-up d300"
            style={{
              fontSize: "clamp(1rem,2vw,1.2rem)", color: "rgba(240,239,232,0.6)",
              maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7,
            }}
          >
            SmartHire conducts professional AI interviews, evaluates candidates with precision, and delivers actionable insights — cutting hiring time by 80%.
          </p>

          {/* CTA buttons */}
          <div className="anim-fade-up d400" style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 80 }}>
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
          <div
            className="anim-scale-in d500"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, maxWidth: 700, margin: "0 auto", padding: "0 16px" }}
          >
            {stats.map(({ n, l }) => (
              <div
                key={l}
                className="stat-card"
                style={{ padding: "28px 20px", borderRadius: 20, textAlign: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2.2rem,5vw,3.5rem)", color: "#c8f135", lineHeight: 1 }}>{n}</div>
                <div style={{ color: "rgba(240,239,232,0.5)", fontSize: 13, marginTop: 8, lineHeight: 1.4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="float-badge hide-mobile" style={{ position: "absolute", bottom: 120, left: "5%", animationDelay: "0s", padding: "12px 20px", borderRadius: 16, background: "rgba(10,10,15,0.9)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: 20 }}>🎯</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--surface)" }}>Interview Complete</div>
          <div style={{ fontSize: 11, color: "#8a8a96" }}>Score: 94/100 · 2s ago</div>
        </div>
      </div>
      <div className="float-badge hide-mobile" style={{ position: "absolute", top: 180, right: "4%", animationDelay: "-3s", padding: "12px 20px", borderRadius: 16, background: "rgba(10,10,15,0.9)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>
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
  const doubled = [...logos, ...logos]; // duplicate for seamless loop

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
// FEATURE CARD
// ─────────────────────────────────────────────
const FEATURES = [
  { icon: "🤖", tag: "Core", tagColor: "#c8f135", title: "AI as a Backup Recruiter", desc: "When human recruiters are unavailable, AI conducts structured, professional interviews with natural conversation flow." },
  { icon: "📄", tag: "Smart", tagColor: "#7bf1a8", title: "Resume-Aware Interviews", desc: "AI analyzes resumes in real-time, asking job-specific questions tailored to each candidate's experience and skills." },
  { icon: "📊", tag: "Analytics", tagColor: "#6b7fff", title: "Smart Analytics Dashboard", desc: "Comprehensive scoring, behavioral insights, and downloadable PDF reports for data-driven hiring decisions." },
  { icon: "🎯", tag: "Custom", tagColor: "#f9c74f", title: "Custom Interview Templates", desc: "Pre-built templates for various roles or create your own with specific competency frameworks and scoring rubrics." },
  { icon: "⚖️", tag: "Fair", tagColor: "#f8961e", title: "Bias-Free Evaluation", desc: "Objective assessment algorithms that minimize unconscious bias and ensure fair, consistent candidate evaluation." },
  { icon: "🔄", tag: "Integration", tagColor: "#c77dff", title: "Seamless Integration", desc: "Integrate with your existing ATS, calendar, and HR tools for a completely smooth workflow experience." },
];

function FeatureCard({ icon, tag, tagColor, title, desc, delay }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width * 100) + "%");
    e.currentTarget.style.setProperty("--my", ((e.clientY - rect.top) / rect.height * 100) + "%");
  };

  return (
    <div
      ref={cardRef}
      className="feat-card reveal"
      style={{
        padding: 36, borderRadius: 24, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)",
        transitionDelay: delay + "ms",
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Header row */}
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

      <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--surface)", marginBottom: 12, lineHeight: 1.3 }}>{title}</h3>
      <p style={{ color: "rgba(240,239,232,0.5)", fontSize: "0.93rem", lineHeight: 1.7 }}>{desc}</p>

      <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 6, color: tagColor, fontSize: 13, fontWeight: 600 }}>
        Learn more
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" style={{ padding: "120px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="reveal" style={{ marginBottom: 72, textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a96", marginBottom: 16 }}>Platform Features</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,4rem)", lineHeight: 1.08, letterSpacing: "-0.025em", color: "var(--surface)", maxWidth: 600, margin: '0 auto' }}>
            Why <span className="grad-text">SmartHire</span> Stands Out
          </h2>
          <p style={{ color: "rgba(240,239,232,0.5)", fontSize: "1.05rem", maxWidth: 480, margin: "18px auto 0", lineHeight: 1.7 }}>
            Transform your hiring process with cutting-edge AI technology designed for modern recruitment.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {FEATURES.map((feat, i) => <FeatureCard key={feat.title} {...feat} delay={i * 80} />)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────
const STEPS = [
  { n: "01", icon: "⚙️", title: "Setup Interview", color: "#c8f135", desc: "Create custom interviews with role-specific questions or choose from our template library in minutes." },
  { n: "02", icon: "🎤", title: "AI Conducts Interview", color: "#6b7fff", desc: "Candidates complete AI-led interviews at their convenience, with real-time adaptive analysis and scoring." },
  { n: "03", icon: "📈", title: "Review & Decide", color: "#f9c74f", desc: "Access detailed reports, compare candidates side-by-side, and make informed hiring decisions fast." },
];

const PROGRESS = [
  { label: "Interview Scheduling", pct: 90, color: "#c8f135" },
  { label: "Candidate Screening", pct: 82, color: "#6b7fff" },
  { label: "Report Generation", pct: 95, color: "#f9c74f" },
];

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "120px 0", background: "linear-gradient(180deg,var(--ink-2) 0%,var(--ink) 100%)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        <div className="reveal" style={{ textAlign: "center", marginBottom: 80 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a96", marginBottom: 16 }}>How It Works</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,4rem)", lineHeight: 1.08, letterSpacing: "-0.025em", color: "var(--surface)" }}>
            3 Steps to <span className="grad-text">Smarter Hiring</span>
          </h2>
        </div>

        {/* Step cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
          {STEPS.map((step, i) => (
            <div key={step.n} className="reveal" style={{ transitionDelay: i * 0.15 + "s" }}>
              <div style={{ position: "relative", padding: 40, borderRadius: 28, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", height: "100%" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "4rem", color: `${step.color}15`, lineHeight: 1, marginBottom: 24, userSelect: "none" }}>{step.n}</div>
                <div style={{ fontSize: 48, marginBottom: 24 }}>{step.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--surface)", marginBottom: 14 }}>{step.title}</h3>
                <p style={{ color: "rgba(240,239,232,0.5)", lineHeight: 1.7, fontSize: "0.93rem" }}>{step.desc}</p>
                {/* Accent bar */}
                <div style={{ position: "absolute", bottom: 0, left: 40, right: 40, height: 2, borderRadius: "2px 2px 0 0", background: `linear-gradient(90deg,${step.color},transparent)` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Progress bars */}
        <div className="reveal" style={{ marginTop: 64, padding: "36px 40px", borderRadius: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ color: "#8a8a96", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 28 }}>Time saved with SmartHire</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {PROGRESS.map(({ label, pct, color }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ color: "rgba(240,239,232,0.7)", fontSize: 14 }}>{label}</span>
                  <span style={{ color, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 }}>{pct}% faster</span>
                </div>
                <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)" }}>
                  <div className="bar-fill" style={{ height: "100%", borderRadius: 4, width: pct + "%", background: `linear-gradient(90deg,${color},${color}90)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────
const TESTIMONIALS = [
  { q: "SmartHire reduced our time-to-hire by 65%. The AI interviews are incredibly natural and the insights are gold.", name: "Sarah Johnson", role: "HR Director, TechCorp", av: "SJ" },
  { q: "The bias-free evaluation helped us build a more diverse, talented team. An absolute game-changer.", name: "Michael Chen", role: "Talent Lead, StartupXYZ", av: "MC" },
  { q: "Candidates love the flexibility, and we love the detailed analytics. This is genuinely the future of hiring.", name: "Priya Patel", role: "Recruitment Manager, GrowthLabs", av: "PP" },
];

function Testimonials() {
  return (
    <section id="testimonials" style={{ padding: "120px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a96", marginBottom: 16 }}>What People Say</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,4rem)", lineHeight: 1.08, letterSpacing: "-0.025em", color: "var(--surface)" }}>
            Trusted by <span className="grad-text">Industry Leaders</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`testi-card reveal r${i + 1}`}
              style={{ padding: 36, borderRadius: 24, background: "linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                {[...Array(5)].map((_, s) => <span key={s} style={{ color: "#c8f135", fontSize: 16 }}>★</span>)}
              </div>
              <p style={{ color: "rgba(240,239,232,0.75)", lineHeight: 1.75, fontSize: "0.97rem", marginBottom: 28, fontStyle: "italic" }}>"{t.q}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Avatar */}
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#c8f135,#3b5bfc)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: "#0a0a0f", flexShrink: 0 }}>
                  {t.av}
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--surface)" }}>{t.name}</div>
                  <div style={{ color: "#8a8a96", fontSize: 13, marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
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
    name: "Starter", price: "$99", period: "/month",
    desc: "Perfect for small teams getting started",
    features: ["Up to 10 interviews/month", "Basic AI interviews", "Standard reports", "Email support"],
    featured: false,
  },
  {
    name: "Professional", price: "$299", period: "/month",
    desc: "Most popular for growing companies",
    features: ["Up to 50 interviews/month", "Advanced AI interviews", "Detailed analytics", "Priority support", "Custom templates", "ATS integration"],
    featured: true,
  },
  {
    name: "Enterprise", price: "Custom", period: "",
    desc: "For large organizations with custom needs",
    features: ["Unlimited interviews", "Custom AI models", "Dedicated support", "White-label option", "API access", "Custom training"],
    featured: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" style={{ padding: "120px 0", background: "linear-gradient(180deg,var(--ink) 0%,var(--ink-2) 100%)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a96", marginBottom: 16 }}>Pricing</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,4rem)", lineHeight: 1.08, letterSpacing: "-0.025em", color: "var(--surface)" }}>
            Simple, <span className="grad-text">Transparent</span> Pricing
          </h2>
          <p style={{ color: "rgba(240,239,232,0.5)", fontSize: "1.05rem", marginTop: 18 }}>No hidden fees, no surprises. Choose what fits your hiring needs.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`price-card reveal r${i + 1} ${plan.featured ? "featured" : ""}`}
              style={{
                padding: 40, borderRadius: 28, position: "relative", overflow: "hidden",
                ...(plan.featured
                  ? { background: "#c8f135", color: "#0a0a0f" }
                  : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
                ),
              }}
            >
              {plan.featured && (
                <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: "#0a0a0f", color: "#c8f135", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", padding: "6px 20px", borderRadius: "0 0 14px 14px", border: "1px solid rgba(255,255,255,0.1)", borderTop: "none", whiteSpace: "nowrap" }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.1rem", color: plan.featured ? "#0a0a0f" : "var(--surface)", marginBottom: 6 }}>{plan.name}</div>
              <div style={{ fontSize: 13, color: plan.featured ? "rgba(10,10,15,0.6)" : "#8a8a96", marginBottom: 24 }}>{plan.desc}</div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 32 }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "3rem", color: plan.featured ? "#0a0a0f" : "var(--surface)" }}>{plan.price}</span>
                {plan.period && <span style={{ color: plan.featured ? "rgba(10,10,15,0.5)" : "#8a8a96", fontSize: 15 }}>{plan.period}</span>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, background: plan.featured ? "rgba(10,10,15,0.12)" : "rgba(200,241,53,0.12)", color: plan.featured ? "#0a0a0f" : "#c8f135" }}>✓</div>
                    <span style={{ fontSize: "0.9rem", color: plan.featured ? "#16161e" : "rgba(240,239,232,0.7)" }}>{f}</span>
                  </div>
                ))}
              </div>

              <a
                href="/register"
                style={{
                  display: "block", textAlign: "center", padding: "14px 24px", borderRadius: 14,
                  fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, textDecoration: "none",
                  transition: "all 0.3s ease",
                  ...(plan.featured
                    ? { background: "#0a0a0f", color: "#c8f135" }
                    : { background: "rgba(200,241,53,0.1)", color: "#c8f135", border: "1px solid rgba(200,241,53,0.2)" }
                  ),
                }}
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CTA SECTION
// ─────────────────────────────────────────────
function CTA() {
  return (
    <section
      style={{
        padding: "140px 0", position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg,#0d1117 0%,#0a0a0f 50%,#0d1117 100%)",
      }}
    >
      {/* Radial glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%,rgba(200,241,53,0.08) 0%,transparent 70%)" }} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="reveal">
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a96", marginBottom: 20 }}>Get Started Today</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,4rem)", lineHeight: 1.08, letterSpacing: "-0.025em", color: "var(--surface)", marginBottom: 20 }}>
            Ready to Transform<br /><span className="grad-text">Your Hiring?</span>
          </h2>
          <p style={{ color: "rgba(240,239,232,0.55)", fontSize: "1.05rem", marginBottom: 48, lineHeight: 1.7 }}>
            Join thousands of companies already making smarter hiring decisions with SmartHire.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 28 }}>
            <a href="/register" className="btn-primary" style={{ fontSize: 16, padding: "18px 44px" }}>
              Start Free 14-Day Trial
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
            <a href="/demo" className="btn-ghost" style={{ fontSize: 16, padding: "17px 44px" }}>Schedule a Demo</a>
          </div>

          <p style={{ color: "#8a8a96", fontSize: 13 }}>No credit card required · Cancel anytime · 24/7 Support</p>
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
  { title: "Legal", links: ["Privacy", "Terms", "Cookie Policy"] },
];

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "60px 24px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Top row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between", marginBottom: 48 }}>
          {/* Brand */}
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#c8f135", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "var(--surface)" }}>SmartHire</span>
            </div>
            <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.7 }}>AI-powered hiring platform that helps modern teams find exceptional talent faster and smarter.</p>
          </div>

          {/* Columns */}
          {FOOTER_COLS.map(({ title, links }) => (
            <div key={title}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "var(--surface)", marginBottom: 16 }}>{title}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((l) => <a key={l} href="#" className="footer-link">{l}</a>)}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#8a8a96", fontSize: 13 }}>© 2026 SmartHire Inc. All rights reserved.</p>
          <p style={{ color: "#8a8a96", fontSize: 13 }}>Made with ⚡ for the future of hiring</p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// PAGE (default export)
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