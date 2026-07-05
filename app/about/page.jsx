"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Code, Brain, Presentation, Target, CheckCircle2, Quote } from "lucide-react";

export default function AboutPage() {
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

        {/* HERO */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <img src="/Gemini_Generated_Image_dqsy35dqsy35dqsy.png" alt="" style={{ width: 48, height: 48, borderRadius: 12 }} />
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24 }}>SmartHire</span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,3rem)", lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 12px 0" }}>
            About Us
          </h1>
          <p style={{ color: "#8a8a96", fontSize: 15, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
            SmartHire is an AI-powered hiring platform built to transform how companies discover, interview, and hire top talent. Our mission is to make hiring faster, fairer, and more effective through intelligent automation.
          </p>
        </div>

        {/* MISSION */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(200,241,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Target size={16} color="#c8f135" />
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.2rem" }}>Our Mission</h2>
          </div>
          <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.8 }}>
            We believe every candidate deserves a fair chance and every company deserves to find the right talent without bias or inefficiency. SmartHire leverages cutting-edge AI to conduct structured interviews, analyze resumes in real-time, and provide actionable insights — all while eliminating unconscious bias from the hiring process.
          </p>
        </div>

        {/* WHAT WE DO */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32, marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(200,241,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={16} color="#c8f135" />
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.2rem" }}>What We Do</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {[
              "AI-conducted interviews that feel natural and professional",
              "Real-time resume analysis with ATS compatibility scoring",
              "Bias-free candidate evaluation and smart analytics",
              "Custom interview templates for any role",
              "Seamless integration with existing ATS and HR tools",
              "Detailed PDF report export for informed decisions",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
                <CheckCircle2 size={14} color="#c8f135" style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ color: "#8a8a96", fontSize: 13, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem,4vw,2rem)", marginBottom: 8 }}>Meet the Team</h2>
            <p style={{ color: "#8a8a96", fontSize: 14 }}>Built with passion by three dedicated developers.</p>
          </div>

          {/* SABIR */}
          <div style={{ background: "linear-gradient(135deg, rgba(200,241,53,0.08), rgba(200,241,53,0.02))", border: "1px solid rgba(200,241,53,0.15)", borderRadius: 24, padding: 32, marginBottom: 20, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg, #c8f135, #7bf1a8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 28, fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#0a0a0f", overflow: "hidden" }}>
                <span id="sabir-img-placeholder">SA</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18 }}>Muhammad Sabir Amir</h3>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 20, background: "rgba(200,241,53,0.15)", color: "#c8f135", border: "1px solid rgba(200,241,53,0.2)" }}>Group Leader</span>
                </div>
                <p style={{ color: "#c8f135", fontSize: 13, fontWeight: 600, marginTop: 4 }}>Full Lead Developer</p>
              </div>
            </div>
            <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.8 }}>
              Muhammad Sabir Amir served as the <strong style={{ color: "#f0efe8" }}>Group Leader</strong> and <strong style={{ color: "#f0efe8" }}>Full Lead Developer</strong> of the entire SmartHire project. He oversaw the complete development lifecycle — from frontend and backend architecture to AI integration and version control. He was responsible for monitoring the entire project pipeline, ensuring seamless collaboration, and driving the core technical vision forward. His leadership and full-stack expertise were instrumental in bringing SmartHire to life.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Frontend", "Backend", "AI Integration", "Version Control", "Project Monitoring"].map((skill) => (
                <span key={skill} style={{ fontSize: 11, fontWeight: 600, padding: "5px 14px", borderRadius: 20, background: "rgba(200,241,53,0.08)", color: "#c8f135", border: "1px solid rgba(200,241,53,0.1)" }}>{skill}</span>
              ))}
            </div>
            <p style={{ color: "#8a8a96", fontSize: 12, fontStyle: "italic", borderTop: "1px solid rgba(200,241,53,0.08)", paddingTop: 16, marginTop: 4 }}>
              <Quote size={12} style={{ display: "inline", marginRight: 4, opacity: 0.5 }} />
              Image placeholder — add photo here (80x80 px recommended)
            </p>
          </div>

          {/* AMMAR */}
          <div style={{ background: "linear-gradient(135deg, rgba(107,127,255,0.08), rgba(107,127,255,0.02))", border: "1px solid rgba(107,127,255,0.15)", borderRadius: 24, padding: 32, marginBottom: 20, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg, #6b7fff, #c8f135)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 28, fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#0a0a0f", overflow: "hidden" }}>
                <span id="ammar-img-placeholder">AE</span>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18 }}>Muhammad Ammar Elahi</h3>
                <p style={{ color: "#6b7fff", fontSize: 13, fontWeight: 600, marginTop: 4 }}>AI & Backend Developer</p>
              </div>
            </div>
            <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.8 }}>
              Muhammad Ammar Elahi played a key role in the <strong style={{ color: "#f0efe8" }}>AI components</strong> of SmartHire. He contributed significantly to the AI interview logic and resume analysis engine, and provided extensive support on the backend side of the AI features. In addition to his technical contributions, he took ownership of the project's <strong style={{ color: "#f0efe8" }}>complete documentation</strong>, ensuring every aspect of the system was thoroughly recorded and organized.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["AI Development", "Backend Support", "Prompt Engineering", "Documentation"].map((skill) => (
                <span key={skill} style={{ fontSize: 11, fontWeight: 600, padding: "5px 14px", borderRadius: 20, background: "rgba(107,127,255,0.08)", color: "#6b7fff", border: "1px solid rgba(107,127,255,0.1)" }}>{skill}</span>
              ))}
            </div>
            <p style={{ color: "#8a8a96", fontSize: 12, fontStyle: "italic", borderTop: "1px solid rgba(107,127,255,0.08)", paddingTop: 16, marginTop: 4 }}>
              <Quote size={12} style={{ display: "inline", marginRight: 4, opacity: 0.5 }} />
              Image placeholder — add photo here (80x80 px recommended)
            </p>
          </div>

          {/* ZAKRIA */}
          <div style={{ background: "linear-gradient(135deg, rgba(249,199,79,0.08), rgba(249,199,79,0.02))", border: "1px solid rgba(249,199,79,0.15)", borderRadius: 24, padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg, #f9c74f, #f8961e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 28, fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#0a0a0f", overflow: "hidden" }}>
                <span id="zakria-img-placeholder">ZM</span>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18 }}>Zakria Mehmood</h3>
                <p style={{ color: "#f9c74f", fontSize: 13, fontWeight: 600, marginTop: 4 }}>Frontend Developer</p>
              </div>
            </div>
            <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.8 }}>
              Zakria Mehmood contributed across all <strong style={{ color: "#f0efe8" }}>frontend development tasks</strong>, assisting with UI implementation, component building, and ensuring a smooth user experience throughout the platform. He also played a vital role in <strong style={{ color: "#f0efe8" }}>presentation preparation</strong>, helping craft compelling visual materials that effectively communicated the vision and impact of SmartHire.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Frontend Development", "UI Implementation", "Presentation Design"].map((skill) => (
                <span key={skill} style={{ fontSize: 11, fontWeight: 600, padding: "5px 14px", borderRadius: 20, background: "rgba(249,199,79,0.08)", color: "#f9c74f", border: "1px solid rgba(249,199,79,0.1)" }}>{skill}</span>
              ))}
            </div>
            <p style={{ color: "#8a8a96", fontSize: 12, fontStyle: "italic", borderTop: "1px solid rgba(249,199,79,0.08)", paddingTop: 16, marginTop: 4 }}>
              <Quote size={12} style={{ display: "inline", marginRight: 4, opacity: 0.5 }} />
              Image placeholder — add photo here (80x80 px recommended)
            </p>
          </div>
        </div>

        {/* CONTACT */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32, textAlign: "center" }}>
          <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.8 }}>
            Have questions? Reach out to us at{" "}
            <a href="mailto:support@smarthire.com" style={{ color: "#c8f135", textDecoration: "none", fontWeight: 600 }}>support@smarthire.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
