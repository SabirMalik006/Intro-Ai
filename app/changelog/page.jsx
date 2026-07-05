"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, GitPullRequest, Rocket, Bug, Zap } from "lucide-react";

const changes = [
  { date: "July 2026", icon: <Rocket size={16} />, color: "#c8f135", title: "AI Interview Enhancements", desc: "Improved natural language processing for more conversational AI interviews. Added real-time sentiment analysis and adaptive questioning for better candidate engagement." },
  { date: "June 2026", icon: <Zap size={16} />, color: "#6b7fff", title: "Resume Analyzer v2", desc: "Complete redesign of the resume analysis engine. New ATS scoring system with detailed section breakdowns, visual charts, and actionable suggestions." },
  { date: "May 2026", icon: <Sparkles size={16} />, color: "#f9c74f", title: "Dashboard Redesign", desc: "Modernized dashboard with refined UI, better navigation, and improved analytics across all sections including Settings, Reports, and Saved Jobs." },
  { date: "April 2026", icon: <GitPullRequest size={16} />, color: "#7bf1a8", title: "Team Collaboration", desc: "Introduced team management features including member invitations, role-based access controls, and shared interview templates for collaborative hiring." },
  { date: "March 2026", icon: <Bug size={16} />, color: "#f8961e", title: "PDF Report Export", desc: "Added ability to download detailed interview and resume analysis reports as professionally formatted PDF documents with full styling." },
];

export default function ChangelogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a0a0f 0%, #13131a 100%)", color: "#f0efe8", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM Sans:opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');`}</style>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 24px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#8a8a96", textDecoration: "none", fontSize: 14, fontWeight: 500, marginBottom: 48, transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#c8f135"}
          onMouseLeave={e => e.currentTarget.style.color = "#8a8a96"}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(200,241,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Sparkles size={24} color="#c8f135" />
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,2.8rem)", lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 8px 0" }}>Changelog</h1>
          <p style={{ color: "#8a8a96", fontSize: 15 }}>Latest updates and improvements to SmartHire.</p>
        </div>

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 27, top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {changes.map((item) => (
              <div key={item.title} style={{ display: "flex", gap: 20, position: "relative" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: item.color, zIndex: 1, background: "#13131a" }}>{item.icon}</div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24, flex: 1 }}>
                  <span style={{ color: item.color, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.date}</span>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, margin: "6px 0 8px" }}>{item.title}</h3>
                  <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
