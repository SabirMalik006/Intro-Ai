"use client";

const STEPS = [
  { n: "01", icon: "⚙️", title: "Setup Interview",        color: "#c8f135", desc: "Create custom interviews with role-specific questions or choose from our template library in minutes." },
  { n: "02", icon: "🎤", title: "AI Conducts Interview",  color: "#6b7fff", desc: "Candidates complete AI-led interviews at their convenience, with real-time adaptive analysis and scoring." },
  { n: "03", icon: "📈", title: "Review & Decide",        color: "#f9c74f", desc: "Access detailed reports, compare candidates side-by-side, and make informed hiring decisions fast." },
];

const PROGRESS = [
  { label: "Interview Scheduling", pct: 90, color: "#c8f135" },
  { label: "Candidate Screening",  pct: 82, color: "#6b7fff" },
  { label: "Report Generation",    pct: 95, color: "#f9c74f" },
];

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "120px 0", background: "linear-gradient(180deg,var(--ink-2) 0%,var(--ink) 100%)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 80 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a96", marginBottom: 16 }}>How It Works</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,4rem)", lineHeight: 1.08, letterSpacing: "-0.025em", color: "var(--surface)" }}>
            3 Steps to <span className="grad-text">Smarter Hiring</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
          {STEPS.map((step, i) => (
            <div key={step.n} className="reveal" style={{ transitionDelay: i * 0.15 + "s" }}>
              <div style={{ position: "relative", padding: 40, borderRadius: 28, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", height: "100%" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "4rem", color: `${step.color}15`, lineHeight: 1, marginBottom: 24, userSelect: "none" }}>{step.n}</div>
                <div style={{ fontSize: 48, marginBottom: 24 }}>{step.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--surface)", marginBottom: 14 }}>{step.title}</h3>
                <p style={{ color: "rgba(240,239,232,0.5)", lineHeight: 1.7, fontSize: "0.93rem" }}>{step.desc}</p>
                <div style={{ position: "absolute", bottom: 0, left: 40, right: 40, height: 2, borderRadius: "2px 2px 0 0", background: `linear-gradient(90deg,${step.color},transparent)` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: 64, padding: "36px 40px", borderRadius: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ color: "#8a8a96", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 28 }}>Time saved with SmartHire</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {PROGRESS.map(({ label, pct, color }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ color: "rgba(240,239,232,0.7)", fontSize: 14 }}>{label}</span>
                  <span style={{ color, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 }}>{pct}% faster</span>
                </div>
                <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)" }}>
                  <div className="bar-fill" style={{ height: "100%", borderRadius: 4, width: pct + "%", background: `linear-gradient(90deg,${color},${color}90)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;