"use client";

import { useEffect, useState } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      transition: "all 0.4s ease",
      background: scrolled ? "rgba(10,10,15,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 0", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#c8f135", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "var(--surface)" }}>SmartHire</span>
        </a>

        <div className="hide-mobile" style={{ display: "flex", gap: 36 }}>
          {["Features", "How It Works", "Pricing", "Testimonials"].map((label) => (
            <a key={label} href={`#${label.toLowerCase().replace(/ /g, "-")}`} className="nav-link">{label}</a>
          ))}
        </div>

        <div className="hide-mobile" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/login" style={{ color: "rgba(240,239,232,0.6)", fontWeight: 500, fontSize: 14, textDecoration: "none", padding: "8px 16px" }}>Sign in</a>
          <a href="/register" className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}>Get Started</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;