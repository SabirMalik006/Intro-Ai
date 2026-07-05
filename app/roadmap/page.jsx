"use client";

import Link from "next/link";
import { ArrowLeft, Target, Loader2, CheckCircle2, Rocket, Globe, Monitor, Brain, Shield, Smartphone } from "lucide-react";

const items = [
  { status: "done", icon: <CheckCircle2 size={16} />, color: "#c8f135", bgColor: "rgba(200,241,53,0.1)", title: "AI-Powered Interviews", desc: "Conduct structured interviews with natural AI conversation flow and real-time analysis." },
  { status: "done", icon: <CheckCircle2 size={16} />, color: "#c8f135", bgColor: "rgba(200,241,53,0.1)", title: "Resume Analysis Engine", desc: "ATS-compatible resume scoring with detailed section breakdowns and visual feedback." },
  { status: "done", icon: <CheckCircle2 size={16} />, color: "#c8f135", bgColor: "rgba(200,241,53,0.1)", title: "Smart Analytics Dashboard", desc: "Comprehensive hiring metrics, visual reports, and actionable insights for teams." },
  { status: "progress", icon: <Loader2 size={16} />, color: "#6b7fff", bgColor: "rgba(107,127,255,0.1)", title: "Multi-Language Support", desc: "Conduct interviews and analyze resumes in multiple languages for global hiring." },
  { status: "progress", icon: <Loader2 size={16} />, color: "#6b7fff", bgColor: "rgba(107,127,255,0.1)", title: "Video Interview Recording", desc: "Record and review AI interviews with playback controls and collaborative notes." },
  { status: "pending", icon: <Target size={16} />, color: "#8a8a96", bgColor: "rgba(255,255,255,0.05)", title: "Advanced Bias Detection", desc: "Enhanced algorithms to detect and eliminate unconscious hiring bias across all evaluations." },
  { status: "pending", icon: <Smartphone size={16} />, color: "#8a8a96", bgColor: "rgba(255,255,255,0.05)", title: "Mobile App", desc: "Native mobile experience for candidates to attend interviews and recruiters to review on the go." },
  { status: "pending", icon: <Shield size={16} />, color: "#8a8a96", bgColor: "rgba(255,255,255,0.05)", title: "Blockchain Credentials", desc: "Verifiable candidate credentials and certification tracking on the blockchain." },
];

export default function RoadmapPage() {
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
            <Rocket size={24} color="#c8f135" />
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,2.8rem)", lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 8px 0" }}>Roadmap</h1>
          <p style={{ color: "#8a8a96", fontSize: 15 }}>See what we have shipped and what is coming next.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => (
            <div key={item.title} style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, transition: "all 0.3s ease" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = item.color + "40"; e.currentTarget.style.background = item.bgColor }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: item.bgColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: item.color }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 }}>{item.title}</h3>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 12px", borderRadius: 20, background: item.bgColor, color: item.color, border: `1px solid ${item.color}20` }}>
                    {item.status === "done" ? "Live" : item.status === "progress" ? "In Progress" : "Planned"}
                  </span>
                </div>
                <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
