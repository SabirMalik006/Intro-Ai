"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import Link from "next/link";
import { Loader2, FileText, Clock, ChevronRight, AlertTriangle, BarChart3 } from "lucide-react";

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
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse text-sm">Loading analysis history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/50 p-6 rounded-2xl text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <p className="text-rose-600 dark:text-rose-400 font-bold text-sm">{error}</p>
        </div>
        <button
          onClick={fetchHistory}
          className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-all active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-1.5">No Reports Yet</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
          Start by analyzing your first resume to see detailed AI-powered insights here.
        </p>
        <Link
          href="/dashboard/resume-analyzer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-cyan-700 active:scale-[0.97] transition-all text-sm"
        >
          Analyze Resume Now <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2.5">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Past Analysis Reports
        </h3>
        <span className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold">
          {history.length} Reports
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {history.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg hover:shadow-blue-500/5 transition-all relative overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner border
                    ${item.filename?.endsWith('.pdf')
                      ? 'bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20'
                      : 'bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20'
                    }`}
                  >
                    {item.filename?.endsWith('.pdf') ? '📕' : '📘'}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-xl font-black ${
                      item.analysisResult?.overallScore >= 80 ? 'text-emerald-500' :
                      item.analysisResult?.overallScore >= 60 ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {item.analysisResult?.overallScore}%
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">SCORE</span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-800 dark:text-white truncate mb-2 text-sm" title={item.filename}>
                  {item.filename}
                </h4>

                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-4">
                  <Clock className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>

                <Link
                  href={`/dashboard/resume-analyzer?id=${item._id}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                >
                  View Report <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
