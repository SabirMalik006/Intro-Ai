"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, ChevronRight, BookOpen } from "lucide-react";

const posts = [
  { title: "How AI is Transforming Recruitment in 2026", date: "Jun 28, 2026", readTime: "5 min read", category: "AI & Tech", excerpt: "Discover how artificial intelligence is reshaping the hiring landscape and why forward-thinking companies are adopting AI-powered interviews to stay ahead of the competition." },
  { title: "5 Tips to Optimize Your Resume for ATS", date: "Jun 15, 2026", readTime: "4 min read", category: "Career Advice", excerpt: "Learn the key strategies to make your resume pass through Applicant Tracking Systems and land more interviews with recruiters." },
  { title: "The Future of Bias-Free Hiring", date: "May 30, 2026", readTime: "6 min read", category: "Industry", excerpt: "How AI can help eliminate unconscious bias from the recruitment process and create more equitable opportunities for all candidates." },
  { title: "SmartHire Product Update: Summer 2026", date: "May 12, 2026", readTime: "3 min read", category: "Product", excerpt: "A roundup of all the new features and improvements shipped this quarter, including the redesigned dashboard and resume analyzer." },
];

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a0a0f 0%, #13131a 100%)", color: "#f0efe8", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM Sans:opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');`}</style>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 24px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#8a8a96", textDecoration: "none", fontSize: 14, fontWeight: 500, marginBottom: 48, transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#c8f135"}
          onMouseLeave={e => e.currentTarget.style.color = "#8a8a96"}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(200,241,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <BookOpen size={24} color="#c8f135" />
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,2.8rem)", lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 8px 0" }}>Blog</h1>
          <p style={{ color: "#8a8a96", fontSize: 15 }}>Insights and updates from the SmartHire team.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {posts.map((post) => (
            <div key={post.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 28, transition: "all 0.3s ease", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,241,53,0.2)"; e.currentTarget.style.background = "rgba(200,241,53,0.03)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 20, background: "rgba(200,241,53,0.08)", color: "#c8f135", border: "1px solid rgba(200,241,53,0.1)" }}>{post.category}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#8a8a96", fontSize: 12 }}>
                    <CalendarDays size={12} /> {post.date}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#8a8a96", fontSize: 12 }}>
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>
              </div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{post.title}</h3>
              <p style={{ color: "#8a8a96", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{post.excerpt}</p>
              <span style={{ color: "#c8f135", fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
                Read more <ChevronRight size={14} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
