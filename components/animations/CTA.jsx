"use client";

function CTA() {
  return (
    <section style={{ padding: "140px 0", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#0d1117 0%,#0a0a0f 50%,#0d1117 100%)" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%,rgba(200,241,53,0.08) 0%,transparent 70%)" }} />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="reveal">
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a96", marginBottom: 20 }}>Get Started Today</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,4rem)", lineHeight: 1.08, letterSpacing: "-0.025em", color: "var(--surface)", marginBottom: 20 }}>
            Ready to Transform<br /><span className="grad-text">Your Hiring?</span>
          </h2>
          <p style={{ color: "rgba(240,239,232,0.55)", fontSize: "1.05rem", marginBottom: 48, lineHeight: 1.7 }}>
            Join thousands of companies already making smarter hiring decisions with SmartHire.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 28 }}>
            <a href="/register" className="btn-primary" style={{ fontSize: 16, padding: "18px 44px" }}>
              Start Free 14-Day Trial
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
            <a href="/demo" className="btn-ghost" style={{ fontSize: 16, padding: "17px 44px" }}>Schedule a Demo</a>
          </div>
          <p style={{ color: "#8a8a96", fontSize: 13 }}>No credit card required · Cancel anytime · 24/7 Support</p>
        </div>
      </div>
    </section>
  );
}

export default CTA;