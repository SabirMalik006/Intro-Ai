"use client";

import Link from "next/link";
import { ArrowLeft, Newspaper, Download, FileText, Image, Users, FileSpreadsheet, Mail } from "lucide-react";

const kits = [
  { icon: <FileText size={20} />, title: "Product Fact Sheet", desc: "Overview of SmartHire platform features, capabilities, and key metrics for media reference." },
  { icon: <Image size={20} />, title: "Brand Assets", desc: "Official logos, color palette, typography, and brand guidelines in high-resolution formats." },
  { icon: <Users size={20} />, title: "Executive Bios", desc: "Background information on the SmartHire leadership team and key contributors." },
  { icon: <FileSpreadsheet size={20} />, title: "Press Release Template", desc: "Standard template for announcing SmartHire news, milestones, and product launches." },
];

export default function PressPage() {
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
            <Newspaper size={24} color="#c8f135" />
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,2.8rem)", lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 8px 0" }}>Press</h1>
          <p style={{ color: "#8a8a96", fontSize: 15 }}>Resources for journalists and media professionals covering SmartHire.</p>
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.2rem", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Download size={16} color="#c8f135" /> Press Kit
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {kits.map((item) => (
              <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24, transition: "all 0.3s ease", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,241,53,0.2)"; e.currentTarget.style.background = "rgba(200,241,53,0.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(200,241,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, color: "#c8f135" }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{item.title}</h3>
                <p style={{ color: "#8a8a96", fontSize: 13, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, rgba(200,241,53,0.06), rgba(200,241,53,0.02))", border: "1px solid rgba(200,241,53,0.12)", borderRadius: 20, padding: 28, textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>Media Contact</h2>
          <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.8 }}>
            For press inquiries, please contact:<br />
            <strong style={{ color: "#f0efe8" }}>SmartHire Press Team</strong><br />
            <a href="mailto:press@smarthire.com" style={{ color: "#c8f135", textDecoration: "none", fontWeight: 600 }}>press@smarthire.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
