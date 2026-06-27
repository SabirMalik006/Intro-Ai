"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "@/store/authStore";
import useJobStore from "@/store/jobStore";
import {
  Calendar, Clock, User, Briefcase, FileText,
  ChevronRight, Loader2, Play, CheckCircle, XCircle, ArrowRight
} from "lucide-react";

const statusConfig = {
  'pending': { label: 'Pending', color: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  'completed': { label: 'Completed', color: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
  'cancelled': { label: 'Cancelled', color: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
};

const recommendationConfig = {
  'Strong Hire': { color: 'bg-emerald-500', badge: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' },
  'Hire': { color: 'bg-blue-500', badge: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
  'Consider': { color: 'bg-amber-500', badge: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
  'No Hire': { color: 'bg-red-500', badge: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
};

export default function InterviewsPage() {
  const { user } = useAuthStore();
  const { fetchMyInterviews, fetchRecruiterInterviews } = useJobStore();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const role = (user?.role || '').toLowerCase().trim();
  const isRecruiter = role.includes('recruit') || role === 'admin';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = isRecruiter
        ? await fetchRecruiterInterviews(filter !== 'all' ? filter : null)
        : await fetchMyInterviews(filter !== 'all' ? filter : null);
      setInterviews(data || []);
      setLoading(false);
    };
    load();
  }, [filter, isRecruiter, fetchMyInterviews, fetchRecruiterInterviews]);

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {isRecruiter ? '🎤 Assigned Interviews' : '🎤 My Interviews'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {isRecruiter ? 'Track interviews assigned to your candidates' : 'Complete your assigned AI interviews'}
          </p>
        </div>
      </div>

      {/* ─── FILTERS ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-1.5 inline-flex shadow-sm overflow-x-auto w-full sm:w-auto">
        {["all", "pending", "in-progress", "completed", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              filter === tab
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* ─── LOADING ─── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" /><div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/3" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[1, 2, 3, 4].map(j => <div key={j} className="h-5 bg-slate-100 dark:bg-slate-800 rounded-lg" />)}
              </div>
            </div>
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 flex items-center justify-center text-4xl mb-5 shadow-inner">🎤</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No interviews yet</h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm text-center">
            {isRecruiter ? 'Assign interviews to your candidates to track their progress.' : 'You have no assigned interviews. Apply to jobs to get interviews.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviews.map((interview, idx) => {
            const status = statusConfig[interview.status] || statusConfig.pending;
            const recConfig = interview.report?.recommendation ? recommendationConfig[interview.report.recommendation] : null;

            return (
              <motion.div
                key={interview._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.1)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-extrabold text-slate-800 dark:text-white truncate">{interview.jobRole}</h3>
                        <p className="text-xs font-semibold text-slate-400 truncate flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {isRecruiter
                            ? (interview.candidate?.fullName || 'Candidate')
                            : (interview.recruiter?.company || 'Recruiter')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${status.bg}`}>{status.label}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0"><Calendar className="w-3.5 h-3.5 text-indigo-400" /></div>
                      <span>{new Date(interview.assignedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0"><Briefcase className="w-3.5 h-3.5 text-indigo-400" /></div>
                      <span className="truncate">{interview.job?.title || interview.jobRole}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0"><FileText className="w-3.5 h-3.5 text-indigo-400" /></div>
                      <span>{interview.questions?.length || 0} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0"><Clock className="w-3.5 h-3.5 text-indigo-400" /></div>
                      <span>{interview.answers?.length || 0} answered</span>
                    </div>
                  </div>

                  {interview.report?.overallScore && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-extrabold ${recConfig?.color || 'bg-indigo-500'}`}>
                        {interview.report.overallScore}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Overall Score</p>
                        <p className="text-sm font-extrabold text-slate-800 dark:text-white truncate">{interview.report.recommendation || 'Completed'}</p>
                      </div>
                      <Link href={`/dashboard/reports?interview=${interview._id}`} className="shrink-0 p-2 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}

                  {!isRecruiter && interview.status === 'pending' && (
                    <Link
                      href={`/dashboard/interview-room?assignment=${interview._id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.97] text-sm"
                    >
                      <Play className="w-4 h-4" /> Start Interview
                    </Link>
                  )}

                  {!isRecruiter && interview.status === 'in-progress' && (
                    <Link
                      href={`/dashboard/interview-room?assignment=${interview._id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.97] text-sm"
                    >
                      <Play className="w-4 h-4" /> Continue Interview
                    </Link>
                  )}

                  {isRecruiter && interview.status === 'completed' && interview.report && (
                    <Link
                      href={`/dashboard/reports?interview=${interview._id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.97] text-sm"
                    >
                      <FileText className="w-4 h-4" /> View Full Report
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
