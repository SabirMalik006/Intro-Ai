"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/services/api";
import useAuthStore from "@/store/authStore";
import useJobStore from "@/store/jobStore";
import {
  FileText, ChevronRight, Loader2, User, Briefcase,
  Calendar, Star, ArrowLeft, TrendingUp, CheckCircle2, ArrowUpRight
} from "lucide-react";

const recommendationColors = {
  'Strong Hire': { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', icon: '🏆' },
  'Hire': { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', icon: '✅' },
  'Consider': { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800', icon: '💭' },
  'No Hire': { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', icon: '❌' },
};

function ScoreCircle({ score, size = 80 }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 65 ? '#6366f1' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-slate-100 dark:text-slate-700" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000" />
      </svg>
      <span className="absolute text-lg font-extrabold text-slate-800 dark:text-white">{score}</span>
    </div>
  );
}

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get('interview');
  const { user } = useAuthStore();
  const { fetchRecruiterInterviews, fetchMyInterviews } = useJobStore();

  const [interviews, setInterviews] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);

  const role = (user?.role || '').toLowerCase().trim();
  const isRecruiter = role.includes('recruit') || role === 'admin';

  // Load all completed interviews
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = isRecruiter
        ? await fetchRecruiterInterviews('completed')
        : await fetchMyInterviews('completed');
      setInterviews(data || []);
      setLoading(false);

      // If interviewId is specified, load that specific report
      if (interviewId && data?.length > 0) {
        const found = data.find(i => i._id === interviewId);
        if (found?.report) setSelectedReport(found);
      }
    };
    load();
  }, [isRecruiter, fetchRecruiterInterviews, fetchMyInterviews, interviewId]);

  // Fetch single interview if not in list
  useEffect(() => {
    if (interviewId && !selectedReport && !loading) {
      const fetchSingle = async () => {
        setReportLoading(true);
        try {
          const res = await api.get(`/interviews/${interviewId}`);
          if (res.data.data.interview?.report) {
            setSelectedReport(res.data.data.interview);
          }
        } catch (e) { /* ignore */ }
        setReportLoading(false);
      };
      fetchSingle();
    }
  }, [interviewId, selectedReport, loading]);

  if (selectedReport) {
    const r = selectedReport.report;
    const recConf = r?.recommendation ? recommendationColors[r.recommendation] : null;

    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedReport(null)} className="group inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:border-indigo-200 dark:group-hover:border-indigo-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Reports
        </button>

        {/* ─── REPORT HEADER ─── */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 lg:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold text-indigo-200 flex items-center gap-1.5">
                  <FileText className="w-3 h-3" />
                  Interview Report
                </div>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold mb-1">{selectedReport.jobRole}</h1>
              <p className="text-indigo-200 text-sm font-medium">
                Candidate: {selectedReport.candidate?.fullName || 'N/A'} • {new Date(r.completedAt || selectedReport.completedAt || selectedReport.assignedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
              <ScoreCircle score={r.overallScore || 0} size={64} />
            </div>
          </div>
        </div>

        {/* ─── RECOMMENDATION ─── */}
        {recConf && (
          <div className={`p-5 rounded-2xl border ${recConf.bg}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{recConf.icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommendation</p>
                <p className={`text-xl font-extrabold ${recConf.text}`}>{r.recommendation}</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── SUMMARY ─── */}
        {r.summary && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Summary</h3>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{r.summary}</p>
          </div>
        )}

        {/* ─── STRENGTHS & IMPROVEMENTS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {r.strengths?.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Strengths
              </h3>
              <ul className="space-y-2.5">
                {r.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                    <span className="text-emerald-500 mt-0.5">✅</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {r.areasForImprovement?.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Areas to Improve
              </h3>
              <ul className="space-y-2.5">
                {r.areasForImprovement.map((a, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                    <span className="text-amber-500 mt-0.5">💪</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ─── DETAILED FEEDBACK ─── */}
        {r.detailedFeedback?.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-5">Question Feedback</h3>
            <div className="space-y-3">
              {r.detailedFeedback.map((f, i) => {
                const answer = selectedReport.answers?.find(a => a.questionId === f.questionNumber);
                return (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">Question {f.questionNumber || i + 1}</span>
                      {answer?.score && (
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                          answer.score >= 80 ? 'bg-emerald-50 text-emerald-700' : answer.score >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                        }`}>{answer.score}%</span>
                      )}
                    </div>
                    {answer?.question && <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 italic">{answer.question}</p>}
                    <p className="text-sm text-slate-700 dark:text-slate-200">{f.feedback}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── SUGGESTED ROLES ─── */}
        {r.suggestedRoles?.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Suggested Roles</h3>
            <div className="flex flex-wrap gap-2">
              {r.suggestedRoles.map((role, i) => (
                <span key={i} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-sm font-bold rounded-lg border border-indigo-200 dark:border-indigo-800">{role}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 lg:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold text-indigo-200 flex items-center gap-1.5">
              <FileText className="w-3 h-3" />
              Reports
            </div>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-1">Interview Reports</h1>
          <p className="text-indigo-200 text-sm font-medium">
            {isRecruiter ? 'Review completed AI interviews for your candidates' : 'View your completed interview results'}
          </p>
        </div>
      </div>

      {/* ─── REPORTS LIST ─── */}
      {loading || reportLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : interviews.length === 0 && !interviewId ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 flex items-center justify-center text-4xl mb-5 shadow-inner">📋</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No reports yet</h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm text-center">
            {isRecruiter ? 'Assign AI interviews to candidates. Completed interview reports will appear here.' : 'Complete an AI interview to see your report here.'}
          </p>
          {isRecruiter && (
            <Link href="/dashboard/recruiter" className="mt-5 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Go to Recruiter Dashboard
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.filter(i => i.report).map((interview, idx) => {
            const r = interview.report;
            const recConf = r?.recommendation ? recommendationColors[r.recommendation] : null;

            return (
              <motion.div
                key={interview._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => setSelectedReport(interview)}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border border-slate-200 dark:border-slate-700">
                    <ScoreCircle score={r.overallScore || 0} size={56} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-800 dark:text-white">{interview.jobRole}</h3>
                        <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <User className="w-3 h-3" />
                          {interview.candidate?.fullName || 'Candidate'} • <Calendar className="w-3 h-3" />
                          {new Date(r.completedAt || interview.completedAt || interview.assignedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {recConf && (
                          <span className={`hidden sm:inline-flex text-xs font-bold px-3 py-1.5 rounded-full border ${recConf.bg}`}>
                            {recConf.icon} {r.recommendation}
                          </span>
                        )}
                        <div className="sm:hidden w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                          <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{r.overallScore || 0}%</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                    {r.summary && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">{r.summary}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
