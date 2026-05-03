"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import Link from "next/link";

export default function ResumeHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get("/resume/history");
      setHistory(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch resume history:", err);
      setError("Could not load history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading analysis history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/50 p-6 rounded-2xl text-center">
        <p className="text-rose-600 dark:text-rose-400 font-medium">⚠️ {error}</p>
        <button 
          onClick={fetchHistory}
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
        <div className="text-6xl mb-6">📄</div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Reports Yet</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
          Start by analyzing your first resume to see detailed AI-powered insights here.
        </p>
        <Link 
          href="/dashboard/resume-analyzer"
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/25 hover:scale-105 transition-transform"
        >
          Analyze Resume Now 🚀
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">📊</span>
          Past Analysis Reports
        </h3>
        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-xs font-black uppercase tracking-widest">
          {history.length} Reports
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {history.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border
                    ${item.filename.endsWith('.pdf') 
                      ? 'bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20' 
                      : 'bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20'
                    }`}
                  >
                    {item.filename.endsWith('.pdf') ? '📕' : '📘'}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-2xl font-black ${
                      item.analysisResult.overallScore >= 80 ? 'text-emerald-500' : 
                      item.analysisResult.overallScore >= 60 ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {item.analysisResult.overallScore}%
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">SCORE</span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-800 dark:text-white truncate mb-2 pr-4" title={item.filename}>
                  {item.filename}
                </h4>
                
                <p className="text-xs text-slate-400 font-medium mb-6">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>

                <div className="flex gap-2">
                  <Link 
                    href={`/dashboard/resume-analyzer?id=${item._id}`}
                    className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black text-center hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    View Report
                  </Link>
                  <button className="w-10 h-10 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all">
                    🗑️
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
