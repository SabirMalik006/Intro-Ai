"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Server, Mail, FileText } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    { icon: <FileText size={16} />, title: "Information We Collect", content: "We collect information you provide directly to us, including your name, email address, phone number, company details, and resume documents when you use our platform. We also automatically collect certain technical information about your device and usage patterns to improve our service." },
    { icon: <Eye size={16} />, title: "How We Use Your Information", content: "Your information is used to provide and improve our AI-powered hiring services, process interviews, generate analytics, and communicate with you about your account. We never sell your personal data to third parties." },
    { icon: <Lock size={16} />, title: "Data Security", content: "We implement industry-standard encryption and security measures to protect your data. All communications are secured via HTTPS, and stored data is encrypted at rest using AES-256. We regularly audit our systems for potential vulnerabilities." },
    { icon: <Server size={16} />, title: "Data Retention", content: "We retain your personal data for as long as your account is active or as needed to provide you services. You can request deletion of your data at any time by contacting our support team." },
    { icon: <Shield size={16} />, title: "Third-Party Services", content: "We may use third-party services for AI processing, cloud infrastructure, and analytics. These providers are contractually bound to protect your data and use it only for the purposes we specify." },
    { icon: <Mail size={16} />, title: "Contact", content: 'If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@smarthire.com" style="color:#c8f135;text-decoration:none;font-weight:600">privacy@smarthire.com</a>.' },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a0a0f 0%, #13131a 100%)", color: "#f0efe8", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');`}</style>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#8a8a96", textDecoration: "none", fontSize: 14, fontWeight: 500, marginBottom: 48, transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#c8f135"}
          onMouseLeave={e => e.currentTarget.style.color = "#8a8a96"}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(200,241,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Shield size={24} color="#c8f135" />
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,2.8rem)", lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 8px 0" }}>Privacy Policy</h1>
          <p style={{ color: "#8a8a96", fontSize: 13 }}>Last updated: July 2026</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {sections.map((s) => (
            <div key={s.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(200,241,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c8f135" }}>{s.icon}</div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.05rem" }}>{s.title}</h2>
              </div>
              <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: s.content }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
