const GlobalStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink: #0a0a0f;
      --ink-2: #16161e;
      --surface: #f0efe8;
      --accent: #c8f135;
      --blue: #3b5bfc;
      --blue-light: #6b7fff;
      --warm: #ff6b35;
      --muted: #8a8a96;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--ink);
      color: var(--surface);
      overflow-x: hidden;
      cursor: none;
    }

    body::after {
      content: '';
      position: fixed; inset: 0; z-index: 9997;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      opacity: 0.028;
      pointer-events: none;
    }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--ink); }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33%       { transform: translateY(-12px) rotate(1deg); }
      66%       { transform: translateY(-6px) rotate(-1deg); }
    }
    @keyframes glow-pulse {
      0%, 100% { box-shadow: 0 0 20px rgba(200,241,53,0.3); }
      50%       { box-shadow: 0 0 50px rgba(200,241,53,0.6); }
    }
    @keyframes bar-fill {
      from { width: 0; }
    }
    @keyframes pulse-expand {
      0% { transform: scaleX(0.3) scaleY(0.3); opacity: 0.8; }
      100% { transform: scaleX(1.5) scaleY(1.5); opacity: 0; }
    }

    .anim-fade-up   { animation: fadeUp  0.7s cubic-bezier(0.16,1,0.3,1) both; }
    .anim-fade-in   { animation: fadeIn  0.6s ease both; }
    .anim-scale-in  { animation: scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) both; }

    .d100 { animation-delay: 0.10s; }
    .d200 { animation-delay: 0.20s; }
    .d300 { animation-delay: 0.30s; }
    .d400 { animation-delay: 0.40s; }
    .d500 { animation-delay: 0.50s; }

    .reveal {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1);
    }
    .reveal.vis { opacity: 1; transform: translateY(0); }
    .r1 { transition-delay: 0.10s; }
    .r2 { transition-delay: 0.20s; }
    .r3 { transition-delay: 0.30s; }
    .r4 { transition-delay: 0.40s; }

    .grad-text {
      background: linear-gradient(135deg, #c8f135 0%, #7bf1a8 50%, #6b7fff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .marquee-track {
      animation: marquee 28s linear infinite;
      display: inline-flex;
      gap: 60px;
    }
    .marquee-track:hover { animation-play-state: paused; }

    .float-badge { animation: float 6s ease infinite; }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.35;
      animation: float 14s ease infinite;
    }

    .feat-card {
      position: relative;
      transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1),
                  border-color 0.3s ease,
                  box-shadow 0.4s ease;
    }
    .feat-card::before {
      content: '';
      position: absolute; inset: 0;
      border-radius: inherit;
      background: radial-gradient(
        600px circle at var(--mx, 50%) var(--my, 50%),
        rgba(200,241,53,0.07),
        transparent 40%
      );
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
    }
    .feat-card:hover { transform: translateY(-6px); border-color: rgba(200,241,53,0.22) !important; box-shadow: 0 30px 80px rgba(0,0,0,0.4); }
    .feat-card:hover::before { opacity: 1; }

    .testi-card { transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s; }
    .testi-card:hover { transform: translateY(-8px); border-color: rgba(200,241,53,0.18) !important; }

    .price-card { transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1); }
    .price-card:hover { transform: translateY(-8px); }
    .price-card.featured { animation: glow-pulse 3s ease infinite; }

    .stat-card { transition: transform 0.3s ease, border-color 0.3s ease; }
    .stat-card:hover { transform: translateY(-4px); border-color: rgba(200,241,53,0.2) !important; }

    .bar-fill { animation: bar-fill 1.5s cubic-bezier(0.16,1,0.3,1) both; }

    .nav-link {
      color: rgba(240,239,232,0.65);
      font-size: 14px; font-weight: 500;
      text-decoration: none; position: relative;
      transition: color 0.25s ease;
    }
    .nav-link::after {
      content: ''; position: absolute;
      bottom: -2px; left: 0; right: 0; height: 1px;
      background: #c8f135;
      transform: scaleX(0); transform-origin: right;
      transition: transform 0.3s ease;
    }
    .nav-link:hover { color: var(--surface); }
    .nav-link:hover::after { transform: scaleX(1); transform-origin: left; }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 16px 36px; border-radius: 100px;
      background: #c8f135; color: #0a0a0f;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px;
      border: none; cursor: none; text-decoration: none;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
      position: relative; overflow: hidden;
    }
    .btn-primary:hover { transform: scale(1.05); box-shadow: 0 20px 60px rgba(200,241,53,0.4); }
    .btn-primary:active { transform: scale(0.98); }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 15px 36px; border-radius: 100px;
      background: transparent; color: var(--surface);
      font-family: 'Syne', sans-serif; font-weight: 600; font-size: 15px;
      border: 1.5px solid rgba(240,239,232,0.2); cursor: none; text-decoration: none;
      transition: all 0.3s ease;
    }
    .btn-ghost:hover { border-color: rgba(240,239,232,0.6); background: rgba(240,239,232,0.06); }

    .footer-link {
      color: #8a8a96; font-size: 14px; text-decoration: none;
      transition: color 0.25s;
    }
    .footer-link:hover { color: var(--surface); }

    /* Globe container */
    .globe-wrapper {
      position: relative;
      width: 100%;
      max-width: 560px;
      aspect-ratio: 1;
      flex-shrink: 0;
    }

    /* Hero layout: side by side on desktop, stacked on mobile */
    .hero-inner {
      display: flex;
      align-items: center;
      gap: 40px;
      width: 100%;
    }

    .hero-text-col {
      flex: 1;
      min-width: 0;
      text-align: left;
    }

    .hero-globe-col {
      flex: 0 0 auto;
      width: 46%;
      max-width: 560px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom : 80px;
    }

    @media (max-width: 900px) {
      .hide-mobile { display: none !important; }
      .hero-title  { font-size: clamp(2.4rem, 10vw, 3.6rem) !important; }
      section { padding-left: 16px !important; padding-right: 16px !important; }
      .grid-responsive { grid-template-columns: 1fr !important; }
      .mobile-center { text-align: center !important; }
      .stat-card { padding: 20px 16px !important; }

      .hero-inner {
        flex-direction: column;
        text-align: center;
      }
      .hero-text-col {
        text-align: center;
      }
      .hero-globe-col {
        width: 90%;
        max-width: 400px;
        
      }
      .hero-cta-btns {
        justify-content: center !important;
      }
    }

    @media (max-width: 480px) {
      .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
      .hero-globe-col {
        width: 100%;
        max-width: 320px;
      }
    }
  `}</style>
);

export default GlobalStyles;