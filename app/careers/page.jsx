"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Send, Briefcase, Star, Rocket } from "lucide-react";

export default function CareersPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a0a0f 0%, #13131a 100%)", color: "#f0efe8", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');`}</style>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 24px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#8a8a96", textDecoration: "none", fontSize: 14, fontWeight: 500, marginBottom: 48, transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#c8f135"}
          onMouseLeave={e => e.currentTarget.style.color = "#8a8a96"}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg, #c8f135, #7bf1a8)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Rocket size={28} color="#0a0a0f" />
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,2.8rem)", lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 12px 0" }}>Join the SmartHire Team</h1>
          <p style={{ color: "#8a8a96", fontSize: 15, lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>
            We are always looking for talented, passionate people who want to shape the future of AI-powered hiring.
          </p>
        </div>

        <div style={{ background: "linear-gradient(135deg, rgba(200,241,53,0.06), rgba(123,241,168,0.04))", border: "1px solid rgba(200,241,53,0.15)", borderRadius: 24, padding: "48px 36px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-60px", right: "-60px", width: 200, height: 200, background: "radial-gradient(circle, rgba(200,241,53,0.08), transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: 200, height: 200, background: "radial-gradient(circle, rgba(123,241,168,0.06), transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(200,241,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Star size={24} color="#c8f135" />
            </div>

            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.5rem", marginBottom: 12 }}>
              Think you have what it takes?
            </h2>
            <p style={{ color: "#8a8a96", fontSize: 15, lineHeight: 1.8, marginBottom: 8 }}>
              We are not looking for a specific role — we are looking for <strong style={{ color: "#f0efe8" }}>exceptional people</strong>.
            </p>
            <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              If you believe you are talented and want to be part of something impactful, send us your <strong style={{ color: "#c8f135", fontWeight: 600 }}>resume</strong> and <strong style={{ color: "#c8f135", fontWeight: 600 }}>portfolio</strong>. We would love to see what you can build.
            </p>

            <a
              href="mailto:careers@smarthire.com?subject=Application - SmartHire Team&body=Hi SmartHire Team,%0D%0A%0D%0AI would like to apply to join your team. Please find my resume and portfolio attached.%0D%0A%0D%0AThank you!"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px", background: "linear-gradient(135deg, #c8f135, #b0e020)", color: "#0a0a0f", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, borderRadius: 14, textDecoration: "none", transition: "all 0.3s ease", boxShadow: "0 8px 30px rgba(200,241,53,0.25)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(200,241,53,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(200,241,53,0.25)"; }}
            >
              <Send size={16} />
              Send Your Application
            </a>

            <p style={{ color: "#8a8a96", fontSize: 13, marginTop: 20 }}>
              or email us directly at{" "}
              <a href="mailto:careers@smarthire.com" style={{ color: "#c8f135", textDecoration: "none", fontWeight: 600 }}>careers@smarthire.com</a>
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginTop: 40 }}>
          {[
            { icon: <Sparkles size={18} />, text: "Work with cutting-edge AI" },
            { icon: <Briefcase size={18} />, text: "Remote-first culture" },
            { icon: <Star size={18} />, text: "Make a real impact" },
          ].map((item) => (
            <div key={item.text} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(200,241,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#c8f135" }}>{item.icon}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#f0efe8" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
