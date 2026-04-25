"use client";

import GlobePulse from "./GlobePulse";

function Hero() {
  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      display: "flex", alignItems: "center",
      overflow: "hidden", paddingTop: 70,
    }}>
      {/* Ambient orbs */}
      

      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, width: "100%", padding: "0 24px" }}>

        {/* hero-inner: flex row on desktop, wraps on mobile */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 40,
          width: "100%",
          flexWrap: "wrap",
        }}>

          {/* LEFT: Text column */}
          <div style={{
            flex: "1 1 340px",
            minWidth: 0,
            textAlign: "left",
          }}>
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
            <h1 className="anim-fade-up d100" style={{
              fontFamily: "'Syne',sans-serif", fontWeight: 800,
              fontSize: "clamp(2.8rem,5.5vw,5.5rem)",
              lineHeight: 1.02, letterSpacing: "-0.03em",
              color: "var(--surface)", marginBottom: 12,
            }}>
              Smart Hiring
            </h1>

            <p className="anim-fade-up d300" style={{
              fontSize: "clamp(1rem,1.5vw,1.15rem)", color: "rgba(240,239,232,0.6)",
              maxWidth: 480, lineHeight: 1.7, marginBottom: 48,
            }}>
              SmartHire conducts professional AI interviews, evaluates candidates with precision, and delivers actionable insights — cutting hiring time by 80%.
            </p>

            {/* CTA buttons */}
            <div className="anim-fade-up d400" style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 60 }}>
              <a href="/register" className="btn-primary">
                Start Free Trial
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
              <a href="#demo" className="btn-ghost">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Watch Demo
              </a>
            </div>
          </div>

          {/* RIGHT: Globe column */}
          <div className="anim-fade-in d300" style={{
            flex: "0 0 auto",
            width: "46%",
            maxWidth: 560,
            minWidth: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 80,
          }}>
            <GlobePulse />
          </div>

        </div>
      </div>

      {/* Floating badges */}
      <div className="float-badge hide-mobile" style={{ position: "absolute", bottom: 40, left: "1%", animationDelay: "0s", padding: "12px 20px", borderRadius: 16, background: "rgba(10,10,15,0.9)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", whiteSpace: "nowrap", zIndex: 2 }}>
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

export default Hero;