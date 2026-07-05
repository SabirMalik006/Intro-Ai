"use client";

import Link from "next/link";
import { ArrowLeft, Scale, FileCheck, Users, Lock, AlertTriangle, XCircle, Mail } from "lucide-react";

export default function TermsPage() {
  const sections = [
    { icon: <FileCheck size={16} />, title: "Acceptance of Terms", content: "By accessing or using SmartHire, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform. We reserve the right to update these terms at any time with notice to users." },
    { icon: <Users size={16} />, title: "Account Responsibilities", content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate information and promptly update it as needed." },
    { icon: <AlertTriangle size={16} />, title: "Acceptable Use", content: "You agree to use SmartHire only for lawful hiring purposes. You may not misuse the platform for unauthorized data collection, discrimination, or any activity that violates applicable laws or regulations." },
    { icon: <Lock size={16} />, title: "Intellectual Property", content: "All content, features, and technology of SmartHire are owned by us or our licensors. You may not copy, modify, distribute, or reverse-engineer any part of the platform without explicit written permission." },
    { icon: <XCircle size={16} />, title: "Limitation of Liability", content: "SmartHire is provided 'as is' without warranties of any kind. We are not liable for any indirect or consequential damages arising from your use of the platform, to the maximum extent permitted by law." },
    { icon: <Scale size={16} />, title: "Termination", content: "We may suspend or terminate your access to SmartHire for violation of these terms. You may terminate your account at any time by contacting our support team." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a0a0f 0%, #13131a 100%)", color: "#f0efe8", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM Sans:opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');`}</style>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#8a8a96", textDecoration: "none", fontSize: 14, fontWeight: 500, marginBottom: 48, transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#c8f135"}
          onMouseLeave={e => e.currentTarget.style.color = "#8a8a96"}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(200,241,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Scale size={24} color="#c8f135" />
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,2.8rem)", lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 8px 0" }}>Terms of Service</h1>
          <p style={{ color: "#8a8a96", fontSize: 13 }}>Last updated: July 2026</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {sections.map((s) => (
            <div key={s.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(200,241,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c8f135" }}>{s.icon}</div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.05rem" }}>{s.title}</h2>
              </div>
              <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.8 }}>{s.content}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24, textAlign: "center" }}>
          <p style={{ color: "#8a8a96", fontSize: 14 }}>Questions about our terms? Email us at <a href="mailto:legal@smarthire.com" style={{ color: "#c8f135", textDecoration: "none", fontWeight: 600 }}>legal@smarthire.com</a></p>
        </div>
      </div>
    </div>
  );
}
