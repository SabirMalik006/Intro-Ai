"use client";

const TESTIMONIALS = [
  { q: "SmartHire reduced our time-to-hire by 65%. The AI interviews are incredibly natural and the insights are gold.", name: "Sarah Johnson", role: "HR Director, TechCorp", av: "SJ" },
  { q: "The bias-free evaluation helped us build a more diverse, talented team. An absolute game-changer.", name: "Michael Chen", role: "Talent Lead, StartupXYZ", av: "MC" },
  { q: "Candidates love the flexibility, and we love the detailed analytics. This is genuinely the future of hiring.", name: "Priya Patel", role: "Recruitment Manager, GrowthLabs", av: "PP" },
];

function Testimonials() {
  return (
    <section id="testimonials" style={{ padding: "120px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a96", marginBottom: 16 }}>What People Say</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,4rem)", lineHeight: 1.08, letterSpacing: "-0.025em", color: "var(--surface)" }}>
            Trusted by <span className="grad-text">Industry Leaders</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className={`testi-card reveal r${i + 1}`} style={{ padding: 36, borderRadius: 24, background: "linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                {[...Array(5)].map((_, s) => <span key={s} style={{ color: "#c8f135", fontSize: 16 }}>★</span>)}
              </div>
              <p style={{ color: "rgba(240,239,232,0.75)", lineHeight: 1.75, fontSize: "0.97rem", marginBottom: 28, fontStyle: "italic" }}>"{t.q}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#c8f135,#3b5bfc)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: "#0a0a0f", flexShrink: 0 }}>
                  {t.av}
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--surface)" }}>{t.name}</div>
                  <div style={{ color: "#8a8a96", fontSize: 13, marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;