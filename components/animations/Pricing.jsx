"use client";

const PLANS = [
  { name: "Starter",      price: "$99",    period: "/month", desc: "Perfect for small teams getting started",      features: ["Up to 10 interviews/month", "Basic AI interviews", "Standard reports", "Email support"],                                                                featured: false },
  { name: "Professional", price: "$299",   period: "/month", desc: "Most popular for growing companies",           features: ["Up to 50 interviews/month", "Advanced AI interviews", "Detailed analytics", "Priority support", "Custom templates", "ATS integration"], featured: true  },
  { name: "Enterprise",   price: "Custom", period: "",       desc: "For large organizations with custom needs",    features: ["Unlimited interviews", "Custom AI models", "Dedicated support", "White-label option", "API access", "Custom training"],                  featured: false },
];

function Pricing() {
  return (
    <section id="pricing" style={{ padding: "120px 0", background: "linear-gradient(180deg,var(--ink) 0%,var(--ink-2) 100%)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a96", marginBottom: 16 }}>Pricing</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,4rem)", lineHeight: 1.08, letterSpacing: "-0.025em", color: "var(--surface)" }}>
            Simple, <span className="grad-text">Transparent</span> Pricing
          </h2>
          <p style={{ color: "rgba(240,239,232,0.5)", fontSize: "1.05rem", marginTop: 18 }}>No hidden fees, no surprises. Choose what fits your hiring needs.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`price-card reveal r${i + 1} ${plan.featured ? "featured" : ""}`}
              style={{
                padding: 40, borderRadius: 28, position: "relative", overflow: "hidden",
                ...(plan.featured
                  ? { background: "#c8f135", color: "#0a0a0f" }
                  : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
                ),
              }}
            >
              {plan.featured && (
                <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: "#0a0a0f", color: "#c8f135", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", padding: "6px 20px", borderRadius: "0 0 14px 14px", border: "1px solid rgba(255,255,255,0.1)", borderTop: "none", whiteSpace: "nowrap" }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.1rem", color: plan.featured ? "#0a0a0f" : "var(--surface)", marginBottom: 6 }}>{plan.name}</div>
              <div style={{ fontSize: 13, color: plan.featured ? "rgba(10,10,15,0.6)" : "#8a8a96", marginBottom: 24 }}>{plan.desc}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 32 }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "3rem", color: plan.featured ? "#0a0a0f" : "var(--surface)" }}>{plan.price}</span>
                {plan.period && <span style={{ color: plan.featured ? "rgba(10,10,15,0.5)" : "#8a8a96", fontSize: 15 }}>{plan.period}</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, background: plan.featured ? "rgba(10,10,15,0.12)" : "rgba(200,241,53,0.12)", color: plan.featured ? "#0a0a0f" : "#c8f135" }}>✓</div>
                    <span style={{ fontSize: "0.9rem", color: plan.featured ? "#16161e" : "rgba(240,239,232,0.7)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="/register" style={{ display: "block", textAlign: "center", padding: "14px 24px", borderRadius: 14, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, textDecoration: "none", transition: "all 0.3s ease", ...(plan.featured ? { background: "#0a0a0f", color: "#c8f135" } : { background: "rgba(200,241,53,0.1)", color: "#c8f135", border: "1px solid rgba(200,241,53,0.2)" }) }}>
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;