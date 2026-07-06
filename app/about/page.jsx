"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Code, Brain, Presentation, Target, CheckCircle2, Star } from "lucide-react";

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
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem,4vw,2rem)", marginBottom: 8 }}>Meet the Team</h2>
            <p style={{ color: "#8a8a96", fontSize: 14 }}>Built with passion by three dedicated developers.</p>
          </div>

          {[
            {
              name: "Muhammad Sabir Amir",
              role: "Full Lead Developer",
              badge: "Group Leader",
              color: "#c8f135",
              img: "/sabirr.jpeg",
              initials: "SA",
              description: 'Muhammad Sabir Amir served as the <span style="color:#f0efe8;font-weight:600">Group Leader</span> and <span style="color:#f0efe8;font-weight:600">Full Lead Developer</span> of the entire SmartHire project. He oversaw the complete development lifecycle — from frontend and backend architecture to AI integration and version control. He was responsible for monitoring the entire project pipeline, ensuring seamless collaboration, and driving the core technical vision forward. His leadership and full-stack expertise were instrumental in bringing SmartHire to life.',
              skills: ["Frontend", "Backend", "AI Integration", "Version Control", "Project Monitoring"],
              icon: Code
            },
            {
              name: "Muhammad Ammar Elahi",
              role: "AI & Backend Developer",
              badge: "Documentation Lead",
              color: "#6b7fff",
              img: "/ammar.jpeg",
              initials: "AE",
              description: 'Muhammad Ammar Elahi played a key role in the <span style="color:#f0efe8;font-weight:600">AI components</span> of SmartHire. He contributed significantly to the AI interview logic and resume analysis engine, and provided extensive support on the backend side of the AI features. In addition to his technical contributions, he took ownership of the project\'s <span style="color:#f0efe8;font-weight:600">complete documentation</span>, ensuring every aspect of the system was thoroughly recorded and organized.',
              skills: ["AI Development", "Backend Support", "Prompt Engineering", "Documentation"],
              icon: Brain
            },
            {
              name: "Zakria Mehmood",
              role: "Frontend Developer",
              badge: "Presentation Lead",
              color: "#f9c74f",
              img: "/zakria.jpeg",
              initials: "ZM",
              description: 'Zakria Mehmood contributed across all <span style="color:#f0efe8;font-weight:600">frontend development tasks</span>, assisting with UI implementation, component building, and ensuring a smooth user experience throughout the platform. He also played a vital role in <span style="color:#f0efe8;font-weight:600">presentation preparation</span>, helping craft compelling visual materials that effectively communicated the vision and impact of SmartHire.',
              skills: ["Frontend Development", "UI Implementation", "Presentation Design"],
              icon: Presentation
            }
          ].map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -6, scale: 1.01 }}
              style={{
                background: `linear-gradient(135deg, ${member.color}08, ${member.color}02)`,
                border: `1px solid ${member.color}20`,
                borderRadius: 28,
                padding: 0,
                marginBottom: 24,
                overflow: "hidden",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                boxShadow: `0 4px 30px ${member.color}08`,
                cursor: "default"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${member.color}50`;
                e.currentTarget.style.boxShadow = `0 16px 50px ${member.color}18`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = `${member.color}20`;
                e.currentTarget.style.boxShadow = `0 4px 30px ${member.color}08`;
              }}
            >
              <div style={{ display: "flex", height: "100%" }}>
                {/* Left: full-height image */}
                <div style={{ width: 200, minHeight: "100%", flexShrink: 0, overflow: "hidden", position: "relative" }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(135deg, ${member.color}, ${member.color}cc)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 48, fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#0a0a0f"
                  }}>
                    {member.img ? (
                      <img src={member.img} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                    ) : (
                      member.initials
                    )}
                  </div>
                  {/* Gradient overlay to blend into content */}
                  <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 40, background: `linear-gradient(90deg, transparent, ${member.color}04)` }} />
                </div>

                {/* Right: content */}
                <div style={{ flex: 1, padding: "32px 36px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, margin: 0, letterSpacing: "-0.01em" }}>{member.name}</h3>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "5px 16px",
                        borderRadius: 50,
                        background: `${member.color}18`,
                        color: member.color,
                        border: `1px solid ${member.color}25`
                      }}
                    >
                      <Star size={10} style={{ display: "inline", marginRight: 5, verticalAlign: "middle", opacity: 0.7 }} />
                      {member.badge}
                    </motion.span>
                  </div>
                  <p style={{ color: member.color, fontSize: 14, fontWeight: 600, margin: 0, letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: 6 }}>
                    <member.icon size={14} style={{ opacity: 0.7 }} />
                    {member.role}
                  </p>
                  <p
                    style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.8, margin: 0 }}
                    dangerouslySetInnerHTML={{ __html: member.description }}
                  />
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                    {member.skills.map((skill) => (
                      <motion.span
                        key={skill}
                        whileHover={{ scale: 1.08, y: -1 }}
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "5px 16px",
                          borderRadius: 50,
                          background: `${member.color}10`,
                          color: member.color,
                          border: `1px solid ${member.color}15`,
                          transition: "background 0.2s, border-color 0.2s",
                          cursor: "default"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${member.color}20`; e.currentTarget.style.borderColor = `${member.color}30`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${member.color}10`; e.currentTarget.style.borderColor = `${member.color}15`; }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
