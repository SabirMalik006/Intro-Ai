"use client";

import ResumeHistory from "@/components/candidate/ResumeHistory";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ReportsPage() {
  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-[2.5rem] p-8 md:p-12 mb-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -ml-10 -mb-10" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-widest uppercase text-teal-100">Live Analytics</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black mb-4 leading-tight"
            >
              Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Hub</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg max-w-lg font-medium"
            >
              Access all your AI-powered resume insights and hiring reports in one centralized dashboard.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link 
              href="/dashboard/resume-analyzer"
              className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-transform flex items-center gap-3"
            >
              New Analysis 🚀
            </Link>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-sm hover:bg-white/20 transition-all">
              Export Data ⬇️
            </button>
          </motion.div>
        </div>

        {/* QUICK STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-10 border-t border-white/5 relative z-10">
          {[
            { label: "Total Reports", value: "24", color: "text-teal-400" },
            { label: "Avg. ATS Score", value: "82%", color: "text-indigo-400" },
            { label: "Top Skill", value: "React", color: "text-amber-400" },
            { label: "Time Saved", value: "12h", color: "text-sky-400" }
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT: RESUME HISTORY */}
      <div className="bg-white dark:bg-slate-950/50 rounded-[3rem] p-6 md:p-10 border border-slate-100 dark:border-slate-800 shadow-xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <ResumeHistory />
      </div>

      {/* BOTTOM ACTION SECTION */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-xl">
          <div>
            <h3 className="text-2xl font-black mb-2">Automated Insights</h3>
            <p className="text-emerald-100 text-sm font-medium opacity-80">Schedule weekly summaries directly to your inbox.</p>
          </div>
          <button className="px-6 py-3 bg-white text-emerald-700 rounded-2xl font-black text-sm shadow-lg hover:scale-105 transition-transform">
            Setup Now
          </button>
        </div>
        
        <div className="bg-amber-500 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col justify-center text-center">
          <p className="text-amber-100 text-[10px] font-black uppercase tracking-widest mb-2">Pro Feature</p>
          <h3 className="text-xl font-black mb-4">Competitor Analysis</h3>
          <button className="w-full py-3 bg-black/20 hover:bg-black/30 rounded-2xl font-black text-sm transition-colors backdrop-blur-md">
            Unlock 🔓
          </button>
        </div>
      </div>
    </div>
  );
}