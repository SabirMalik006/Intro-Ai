"use client";

import Link from "next/link";
import { ArrowLeft, Cookie, Settings, Shield, RefreshCw, Mail, Info } from "lucide-react";

export default function CookiePolicyPage() {
  const sections = [
    { icon: <Info size={16} />, title: "What Are Cookies", content: "Cookies are small text files stored on your device that help us provide and improve our services. They enable us to remember your preferences, authenticate your sessions, and analyze platform usage to deliver a better experience." },
    { icon: <Settings size={16} />, title: "How We Use Cookies", content: "We use essential cookies for platform functionality, authentication cookies to keep you logged in, analytics cookies to understand usage patterns, and preference cookies to remember your settings across visits." },
    { icon: <Shield size={16} />, title: "Third-Party Cookies", content: "Some third-party services integrated with SmartHire may place cookies on your device. These include analytics providers and AI processing services. We ensure these partners comply with data protection standards." },
    { icon: <RefreshCw size={16} />, title: "Managing Cookies", content: "You can control cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality. Most browsers provide options to block or delete cookies from their settings menu." },
    { icon: <Cookie size={16} />, title: "Updates", content: "We may update this Cookie Policy periodically. We will notify you of significant changes through the platform or via email. Continued use after changes constitutes acceptance of the updated policy." },
    { icon: <Mail size={16} />, title: "Contact", content: 'For questions about our cookie usage, contact us at <a href="mailto:privacy@smarthire.com" style="color:#c8f135;text-decoration:none;font-weight:600">privacy@smarthire.com</a>.' },
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
            <Cookie size={24} color="#c8f135" />
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,2.8rem)", lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 8px 0" }}>Cookie Policy</h1>
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
