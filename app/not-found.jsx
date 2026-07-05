"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function NotFoundPage() {
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
    document.body.style.cursor = "none";
    window.addEventListener("mousemove", onMove);
    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
      padding: "20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        body { margin: 0; cursor: none; }

        .grad-text {
          background: linear-gradient(135deg, #c8f135 0%, #7bf1a8 50%, #6b7fff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(1deg); }
          66% { transform: translateY(-6px) rotate(-1deg); }
        }

        @keyframes particle {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-60px) scale(0); opacity: 0; }
        }

        .glow-btn {
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .glow-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 40px rgba(200,241,53,0.3);
        }
      `}</style>

      {/* Noise Overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        opacity: 0.028,
        pointerEvents: "none",
      }} />

      {/* Custom Cursor */}
      <div ref={dotRef} style={{
        position: "fixed",
        width: 8, height: 8,
        background: "#c8f135",
        borderRadius: "50%",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        mixBlendMode: "difference",
      }} />
      <div ref={ringRef} style={{
        position: "fixed",
        width: 36, height: 36,
        border: "1.5px solid rgba(200,241,53,0.5)",
        borderRadius: "50%",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        zIndex: 9998,
        transition: "width 0.3s ease, height 0.3s ease",
      }} />

      {/* Background Orbs */}
      <div style={{
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(200,241,53,0.3), transparent)",
        top: "-15%", right: "-10%",
        position: "absolute", borderRadius: "50%",
        filter: "blur(80px)", opacity: 0.3,
        animation: "float 14s ease infinite",
      }} />
      <div style={{
        width: 400, height: 400,
        background: "radial-gradient(circle, rgba(59,91,252,0.3), transparent)",
        bottom: "-10%", left: "-8%",
        position: "absolute", borderRadius: "50%",
        filter: "blur(80px)", opacity: 0.25,
        animation: "float 18s ease infinite",
        animationDelay: "-5s",
      }} />
      <div style={{
        width: 250, height: 250,
        background: "radial-gradient(circle, rgba(255,107,53,0.2), transparent)",
        top: "50%", right: "15%",
        position: "absolute", borderRadius: "50%",
        filter: "blur(80px)", opacity: 0.2,
        animation: "float 22s ease infinite",
        animationDelay: "-10s",
      }} />

      {/* Grid Background */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 40 }}
        >
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12 }}>
            <img src="/Gemini_Generated_Image_dqsy35dqsy35dqsy.png" alt="SmartHire" style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover" }} />
            <div>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>Smart</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#34d399", letterSpacing: "-0.5px" }}>Hire</span>
              <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: "1px", textTransform: "uppercase" }}>AI-Powered Hiring</div>
            </div>
          </Link>
        </motion.div>

        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, type: "spring", stiffness: 100 }}
        >
          <h1 style={{
            fontSize: "clamp(120px, 25vw, 220px)",
            fontWeight: 800,
            lineHeight: 1,
            margin: 0,
            fontFamily: "'Syne', sans-serif",
          }}>
            <span className="grad-text">404</span>
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 style={{
            fontSize: "clamp(20px, 4vw, 32px)",
            fontWeight: 600,
            color: "#f0efe8",
            margin: "12px 0 8px",
            fontFamily: "'Syne', sans-serif",
          }}>
            Lost in the Cosmos
          </h2>
          <p style={{
            fontSize: "clamp(14px, 2vw, 17px)",
            color: "#8a8a96",
            maxWidth: 440,
            margin: "0 auto 36px",
            lineHeight: 1.7,
          }}>
            This page has drifted into deep space. Let&apos;s beam you back to familiar ground.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link
            href="/"
            className="glow-btn"
            style={{
              padding: "14px 36px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #c8f135, #7bf1a8)",
              color: "#0a0a0f",
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="glow-btn"
            style={{
              padding: "14px 36px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "#f0efe8",
              fontWeight: 500,
              fontSize: 15,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backdropFilter: "blur(10px)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Go Back
          </button>
        </motion.div>

        {/* Particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 4 + Math.random() * 4,
            height: 4 + Math.random() * 4,
            borderRadius: "50%",
            background: i % 2 === 0 ? "#c8f135" : "#6b7fff",
            opacity: 0.4,
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            animation: `particle ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      {/* Footer Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        style={{ position: "relative", zIndex: 2, marginTop: 60 }}
      >
        <p style={{ fontSize: 13, color: "#4b5563" }}>
          &copy; {new Date().getFullYear()} SmartHire. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
