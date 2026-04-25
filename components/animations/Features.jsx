"use client";

const FEATURES = [
  { icon: "🤖", tag: "Core",        tagColor: "#c8f135", title: "AI as a Backup Recruiter",    desc: "When human recruiters are unavailable, AI conducts structured, professional interviews with natural conversation flow." },
  { icon: "📄", tag: "Smart",       tagColor: "#7bf1a8", title: "Resume-Aware Interviews",      desc: "AI analyzes resumes in real-time, asking job-specific questions tailored to each candidate's experience and skills." },
  { icon: "📊", tag: "Analytics",   tagColor: "#6b7fff", title: "Smart Analytics Dashboard",    desc: "Comprehensive scoring, behavioral insights, and downloadable PDF reports for data-driven hiring decisions." },
  { icon: "🎯", tag: "Custom",      tagColor: "#f9c74f", title: "Custom Interview Templates",   desc: "Pre-built templates for various roles or create your own with specific competency frameworks and scoring rubrics." },
  { icon: "⚖️", tag: "Fair",        tagColor: "#f8961e", title: "Bias-Free Evaluation",         desc: "Objective assessment algorithms that minimize unconscious bias and ensure fair, consistent candidate evaluation." },
  { icon: "🔄", tag: "Integration", tagColor: "#c77dff", title: "Seamless Integration",          desc: "Integrate with your existing ATS, calendar, and HR tools for a completely smooth workflow experience." },
];

function FeatureCard({ icon, tag, tagColor, title, desc, delay }) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width * 100) + "%");
    e.currentTarget.style.setProperty("--my", ((e.clientY - rect.top) / rect.height * 100) + "%");
  };

  return (
    <div
      className="feat-card reveal"
      style={{
        padding: 36, borderRadius: 24, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)",
        transitionDelay: delay + "ms",
      }}
      onMouseMove={handleMouseMove}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <span style={{ fontSize: 36, lineHeight: 1 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 100, background: `${tagColor}18`, border: `1px solid ${tagColor}30`, color: tagColor }}>
          {tag}
        </span>
      </div>
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--surface)", marginBottom: 12, lineHeight: 1.3 }}>{title}</h3>
      <p style={{ color: "rgba(240,239,232,0.5)", fontSize: "0.93rem", lineHeight: 1.7 }}>{desc}</p>
      <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 6, color: tagColor, fontSize: 13, fontWeight: 600 }}>
        Learn more
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" style={{ padding: "120px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="reveal" style={{ marginBottom: 72, textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a96", marginBottom: 16 }}>Platform Features</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,4rem)", lineHeight: 1.08, letterSpacing: "-0.025em", color: "var(--surface)", maxWidth: 600, margin: "0 auto" }}>
            Why <span className="grad-text">SmartHire</span> Stands Out
          </h2>
          <p style={{ color: "rgba(240,239,232,0.5)", fontSize: "1.05rem", maxWidth: 480, margin: "18px auto 0", lineHeight: 1.7 }}>
            Transform your hiring process with cutting-edge AI technology designed for modern recruitment.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {FEATURES.map((feat, i) => <FeatureCard key={feat.title} {...feat} delay={i * 80} />)}
        </div>
      </div>
    </section>
  );
}

export default Features;