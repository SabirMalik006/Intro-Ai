"use client";

const FOOTER_COLS = [
  { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
  { title: "Legal",   links: ["Privacy", "Terms", "Cookie Policy"] },
];

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "60px 24px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between", marginBottom: 48 }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#c8f135", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "var(--surface)" }}>SmartHire</span>
            </div>
            <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.7 }}>AI-powered hiring platform that helps modern teams find exceptional talent faster and smarter.</p>
          </div>
          {FOOTER_COLS.map(({ title, links }) => (
            <div key={title}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "var(--surface)", marginBottom: 16 }}>{title}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((l) => <a key={l} href="#" className="footer-link">{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#8a8a96", fontSize: 13 }}>© 2026 SmartHire Inc. All rights reserved.</p>
          <p style={{ color: "#8a8a96", fontSize: 13 }}>Made with ⚡ for the future of hiring</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;