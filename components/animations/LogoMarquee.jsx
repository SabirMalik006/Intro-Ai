"use client";

function LogoMarquee() {
  const logos = ["Google", "Stripe", "Notion", "Linear", "Figma", "Vercel", "Airbnb", "Shopify", "Atlassian", "Salesforce"];
  const doubled = [...logos, ...logos];

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", padding: "40px 0" }}>
      <p style={{ textAlign: "center", marginBottom: 28, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8a96" }}>
        Trusted by teams at
      </p>
      <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
        <div className="marquee-track">
          {doubled.map((name, i) => (
            <span key={i} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, color: "rgba(240,239,232,0.18)", letterSpacing: "-0.01em" }}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LogoMarquee;