"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import useAuthStore from "@/store/authStore";
import useJobStore from "@/store/jobStore";
import {
  FileText, ChevronRight, Loader2, User, Briefcase,
  Calendar, Star, ArrowLeft, TrendingUp, CheckCircle2,
  Trash2, X, AlertTriangle, Target, Lightbulb, Award
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

function DeleteConfirmModal({ isOpen, onClose, onConfirm, deleting }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-16 h-16 mx-auto bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-5">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">Delete Report?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              This will permanently delete this interview report. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} disabled={deleting}
                className="flex-1 px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-extrabold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50">
                Cancel
              </button>
              <button onClick={onConfirm} disabled={deleting}
                className="flex-1 px-5 py-3 rounded-xl bg-red-600 text-white font-extrabold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get('interview');
  const { user } = useAuthStore();
  const { fetchRecruiterInterviews, fetchMyInterviews, deleteInterview } = useJobStore();

  const [interviews, setInterviews] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [notification, setNotification] = useState(null);

  const role = (user?.role || '').toLowerCase().trim();
  const isRecruiter = role.includes('recruit') || role === 'admin';

  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Load all completed interviews
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = isRecruiter
        ? await fetchRecruiterInterviews('completed')
        : await fetchMyInterviews('completed');
      setInterviews(data || []);
      setLoading(false);

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

  const handleDelete = async () => {
    const id = deleteTargetId || selectedReport?._id;
    if (!id) return;
    setDeletingId(id);
    const res = await deleteInterview(id);
    setDeletingId(null);
    setShowDeleteModal(false);
    setDeleteTargetId(null);
    if (res.success) {
      showNotif('Report deleted successfully');
      setInterviews(prev => prev.filter(i => i._id !== id));
      setSelectedReport(null);
    } else {
      showNotif(res.message || 'Failed to delete', 'error');
    }
  };

  // ── HELPER: derive practice topics from areas for improvement ──
  const deriveTopics = (areas) => {
    const keywords = areas?.map(a => a.toLowerCase()) || [];
    const topics = [];
    if (keywords.some(k => k.includes('communicat') || k.includes('present') || k.includes('speak')))
      topics.push({ label: 'Communication Skills', icon: '🗣️', desc: 'Practice articulating technical concepts clearly and concisely.' });
    if (keywords.some(k => k.includes('problem') || k.includes('analyt') || k.includes('logic') || k.includes('reason')))
      topics.push({ label: 'Problem Solving', icon: '🧩', desc: 'Work through algorithmic challenges and case studies.' });
    if (keywords.some(k => k.includes('technical') || k.includes('code') || k.includes('program') || k.includes('develop') || k.includes('engineer')))
      topics.push({ label: 'Technical Skills', icon: '💻', desc: 'Deepen your understanding of core tech stack and coding patterns.' });
    if (keywords.some(k => k.includes('lead') || k.includes('manag') || k.includes('team') || k.includes('collabor')))
      topics.push({ label: 'Leadership & Collaboration', icon: '🤝', desc: 'Focus on team dynamics, conflict resolution, and delegation.' });
    if (keywords.some(k => k.includes('design') || k.includes('architect') || k.includes('system') || k.includes('scalab')))
      topics.push({ label: 'System Design', icon: '🏗️', desc: 'Study scalable architecture patterns and trade-off analysis.' });
    if (keywords.some(k => k.includes('domain') || k.includes('industr') || k.includes('business') || k.includes('context')))
      topics.push({ label: 'Domain Knowledge', icon: '📊', desc: 'Deepen industry-specific expertise and business acumen.' });
    return topics.length > 0 ? topics : [{ label: 'General Interview Skills', icon: '🎯', desc: 'Broad practice covering common interview scenarios.' }];
  };

  // ── DETAIL VIEW ──
  if (selectedReport) {
    const r = selectedReport.report;
    const recConf = r?.recommendation ? recommendationColors[r.recommendation] : null;
    const isCandidateOwner = !isRecruiter && selectedReport.candidate?._id === user?._id;

    // ── CANDIDATE OWNER VIEW ──
    if (isCandidateOwner) {
      const topics = deriveTopics(r.areasForImprovement);
      const scoreColor = (r.overallScore || 0) >= 80 ? 'from-emerald-500 to-green-600'
        : (r.overallScore || 0) >= 65 ? 'from-teal-500 to-emerald-600'
        : (r.overallScore || 0) >= 50 ? 'from-amber-500 to-orange-600'
        : 'from-red-500 to-rose-600';

      return (
        <div className="space-y-5">
          {/* Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className={`fixed top-6 right-6 z-[300] px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
                  notification.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-emerald-600/90 text-white border-emerald-400'
                }`}
              >
                <span className="text-lg">{notification.type === 'error' ? '⚠️' : '✅'}</span>
                <span className="font-bold text-sm tracking-wide">{notification.msg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back */}
          <button onClick={() => setSelectedReport(null)} className="group inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:border-teal-200 dark:group-hover:border-teal-800 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Reports
          </button>

          {/* ─── HERO HEADER ─── */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal-600 via-emerald-700 to-green-800 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-teal-400/5 rounded-full blur-xl" />
            <div className="relative z-10 p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                  <Award className="w-3 h-3" /> My Report
                </div>
                <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-[10px] font-semibold text-white/80">
                  {new Date(r.completedAt || selectedReport.completedAt || selectedReport.assignedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl lg:text-4xl font-extrabold mb-2 leading-tight">{selectedReport.jobRole}</h1>
                  <p className="text-emerald-200 text-sm font-medium">Your performance assessment</p>

                  {/* Mini stats */}
                  <div className="mt-5 flex items-center gap-6">
                    <div>
                      <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">Questions</span>
                      <p className="text-lg font-extrabold">{r.detailedFeedback?.length || selectedReport.answers?.length || 0}</p>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div>
                      <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">Strengths</span>
                      <p className="text-lg font-extrabold">{r.strengths?.length || 0}</p>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div>
                      <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">To Improve</span>
                      <p className="text-lg font-extrabold">{r.areasForImprovement?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Score circle */}
                <div className="flex items-center gap-4 shrink-0">
                  <button onClick={() => setShowDeleteModal(true)}
                    className="p-2.5 bg-white/10 hover:bg-red-500/20 rounded-xl border border-white/10 transition-all group/del self-start mt-1"
                    title="Delete report">
                    <Trash2 className="w-4 h-4 text-white/70 group-hover/del:text-red-300 transition-colors" />
                  </button>
                  <div className="flex flex-col items-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-3">
                      <ScoreCircle score={r.overallScore || 0} size={80} />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider mt-1.5">Overall Score</span>
                  </div>
                </div>
              </div>

              {/* Recommendation chip */}
              {recConf && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <span className="text-lg">{recConf.icon}</span>
                  <span className="text-sm font-extrabold">{r.recommendation}</span>
                </div>
              )}
            </div>
          </div>

          {/* ─── SCORE BAR ─── */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Performance Score</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-white">{r.overallScore || 0}/100</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${r.overallScore || 0}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${scoreColor} shadow-sm`}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-slate-400">Needs Work</span>
              <span className="text-[10px] text-slate-400">Excellent</span>
            </div>
          </div>

          {/* ─── SCORE DISTRIBUTION ─── */}
          {selectedReport.answers?.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" /> Score Distribution
              </h3>
              {(() => {
                const scores = selectedReport.answers.map(a => a.score || 0);
                const excellent = scores.filter(s => s >= 80).length;
                const good = scores.filter(s => s >= 65 && s < 80).length;
                const average = scores.filter(s => s >= 50 && s < 65).length;
                const weak = scores.filter(s => s < 50).length;
                const total = scores.length || 1;
                return (
                  <div className="space-y-3">
                    <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {excellent > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(excellent / total) * 100}%` }} transition={{ duration: 0.8 }} className="bg-emerald-500" />}
                      {good > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(good / total) * 100}%` }} transition={{ duration: 0.8, delay: 0.15 }} className="bg-teal-400" />}
                      {average > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(average / total) * 100}%` }} transition={{ duration: 0.8, delay: 0.3 }} className="bg-amber-400" />}
                      {weak > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(weak / total) * 100}%` }} transition={{ duration: 0.8, delay: 0.45 }} className="bg-red-400" />}
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: 'Excellent', count: excellent, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
                        { label: 'Good', count: good, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400' },
                        { label: 'Average', count: average, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
                        { label: 'Needs Work', count: weak, color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
                      ].map((item, i) => (
                        <div key={i} className={`px-2 py-1.5 rounded-lg ${item.color}`}>
                          <p className="text-sm font-extrabold">{item.count}</p>
                          <p className="text-[9px] font-semibold uppercase tracking-wider">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ─── SKILLS ASSESSED ─── */}
          {selectedReport.answers?.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Skills Assessed
              </h3>
              {(() => {
                const allWords = selectedReport.answers
                  .map(a => a.question || '')
                  .join(' ')
                  .replace(/[^a-zA-Z\s]/g, '');
                const skillKeywords = ['JavaScript', 'React', 'Node', 'Python', 'SQL', 'API', 'Database', 'Frontend', 'Backend', 'Full Stack', 'CSS', 'HTML', 'TypeScript', 'AWS', 'Docker', 'Git', 'Agile', 'REST', 'GraphQL', 'Testing', 'DevOps', 'Security', 'Performance', 'Architecture', 'Design Patterns', 'Algorithm', 'Data Structure', 'OOP', 'Functional', 'Microservices', 'CI/CD', 'Cloud', 'Mobile', 'UI/UX', 'Redux', 'Next.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis', 'Kubernetes', 'Linux', 'System Design', 'Product', 'Leadership', 'Communication', 'Problem Solving'];
                const found = skillKeywords.filter(k => allWords.toLowerCase().includes(k.toLowerCase()));
                return found.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {found.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">General interview skills evaluated</p>
                );
              })()}
            </div>
          )}

          {/* ─── PERFORMANCE TIP ─── */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-2xl border border-teal-200 dark:border-teal-800 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                <span className="text-lg">💡</span>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-teal-800 dark:text-teal-300 mb-1">Performance Tip</h4>
                <p className="text-sm text-teal-700 dark:text-teal-400 leading-relaxed">
                  {(r.overallScore || 0) >= 80
                    ? 'Excellent performance! Focus on maintaining consistency and deepening your expertise in advanced topics.'
                    : (r.overallScore || 0) >= 65
                    ? 'Good job! Review the areas for improvement and practice targeted topics to push your score higher.'
                    : (r.overallScore || 0) >= 50
                    ? 'You have a solid foundation. Spend more time on the weaker areas identified above to improve your score.'
                    : 'Consider revisiting the fundamentals in the areas listed for improvement. Regular practice will help build confidence.'}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400">
              <span className="font-bold">Pro tip:</span>
              <span>Try taking mock interviews weekly to track your growth.</span>
            </div>
          </div>

          {/* ─── SUMMARY ─── */}
          {r.summary && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-500" /> Summary
              </h3>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{r.summary}</p>
            </div>
          )}

          {/* ─── STRENGTHS ─── */}
          {r.strengths?.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Your Strengths
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {r.strengths.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                    <span className="text-lg mt-0.5">✨</span>
                    <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{s}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ─── AREAS TO IMPROVE ─── */}
          {r.areasForImprovement?.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Areas to Improve
              </h3>
              <div className="space-y-2.5 mb-5">
                {r.areasForImprovement.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                    <span className="text-lg mt-0.5">📈</span>
                    <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{a}</p>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/interview-room"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-sm rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/20">
                <Target className="w-4 h-4" /> Practice These Areas
              </Link>
            </div>
          )}

          {/* ─── SUGGESTED PRACTICE TOPICS ─── */}
          {topics.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Suggested Practice Topics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Based on your improvement areas, focus on these topics:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {topics.map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/10 dark:to-violet-900/10 hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <span className="text-2xl mb-2 block">{t.icon}</span>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mb-1">{t.label}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{t.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ─── QUESTION FEEDBACK ─── */}
          {r.detailedFeedback?.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Question Feedback
              </h3>
              <div className="space-y-3">
                {r.detailedFeedback.map((f, i) => {
                  const answer = selectedReport.answers?.find(a => a.questionId === f.questionNumber);
                  const qScore = answer?.score || f.score;
                  const qColor = qScore >= 80 ? 'border-emerald-200 dark:border-emerald-800' : qScore >= 60 ? 'border-amber-200 dark:border-amber-800' : 'border-red-200 dark:border-red-800';
                  const qBadge = qScore >= 80 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : qScore >= 60 ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className={`p-4 rounded-xl border-l-4 ${qColor} bg-slate-50/50 dark:bg-slate-800/30`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-xs font-extrabold">{f.questionNumber || i + 1}</span>
                          <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Question {f.questionNumber || i + 1}</span>
                        </div>
                        {qScore && (
                          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${qBadge}`}>{qScore}%</span>
                        )}
                      </div>
                      {answer?.question && (
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 italic bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                          "{answer.question}"
                        </p>
                      )}
                      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{f.feedback}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── SUGGESTED ROLES ─── */}
          {r.suggestedRoles?.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-teal-500" /> Suggested Roles
              </h3>
              <div className="flex flex-wrap gap-2">
                {r.suggestedRoles.map((role, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 text-teal-700 dark:text-teal-400 text-sm font-bold rounded-lg border border-teal-200 dark:border-teal-800">{role}</span>
                ))}
              </div>
            </div>
          )}

          {/* ─── HOW YOU COMPARE ─── */}
          {selectedReport.answers?.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-500" /> How You Compare
              </h3>
              {(() => {
                const score = r.overallScore || 0;
                const rank = score >= 90 ? 'Top 5%' : score >= 80 ? 'Top 15%' : score >= 70 ? 'Top 30%' : score >= 60 ? 'Top 50%' : score >= 50 ? 'Top 70%' : 'Below Average';
                const level = score >= 80 ? 'Advanced' : score >= 65 ? 'Intermediate' : score >= 50 ? 'Developing' : 'Beginner';
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border border-emerald-200 dark:border-emerald-800 text-center">
                      <span className="text-2xl mb-1 block">📊</span>
                      <p className="text-lg font-extrabold text-slate-800 dark:text-white">{rank}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Percentile Rank</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/10 dark:to-violet-900/10 border border-indigo-200 dark:border-indigo-800 text-center">
                      <span className="text-2xl mb-1 block">🎯</span>
                      <p className="text-lg font-extrabold text-slate-800 dark:text-white">{level}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Proficiency Level</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800 text-center">
                      <span className="text-2xl mb-1 block">📈</span>
                      <p className="text-lg font-extrabold text-slate-800 dark:text-white">{selectedReport.answers.length} Q</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Questions Answered</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ─── PRACTICE CTA ─── */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal-600 via-emerald-700 to-green-800 text-white shadow-xl p-6 lg:p-8">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-400/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold mb-1">Ready to improve?</h3>
                <p className="text-emerald-200 text-sm font-medium">Take another AI interview and track your progress over time.</p>
              </div>
              <Link href="/dashboard/interview-room"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 font-extrabold rounded-xl hover:bg-emerald-50 transition-all shadow-lg shadow-black/10 shrink-0">
                <Target className="w-5 h-5" /> Start Practice Interview
              </Link>
            </div>
          </div>

          {/* ─── DELETE ─── */}
          <div className="flex justify-end pt-1">
            <button onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2.5 rounded-xl border-2 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 font-extrabold text-xs hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete Report
            </button>
          </div>

          <DeleteConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} deleting={deletingId === selectedReport._id} />
        </div>
      );
    }

    // ── RECRUITER VIEW ──
    return (
      <div className="space-y-6">
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`fixed top-6 right-6 z-[300] px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
                notification.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-emerald-600/90 text-white border-emerald-400'
              }`}
            >
              <span className="text-lg">{notification.type === 'error' ? '⚠️' : '✅'}</span>
              <span className="font-bold text-sm tracking-wide">{notification.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={() => setSelectedReport(null)} className="group inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:border-indigo-200 dark:group-hover:border-indigo-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Reports
        </button>

        {/* ─── REPORT HEADER ─── */}
        <div className="relative rounded-2xl overflow-hidden p-6 lg:p-8 text-white shadow-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800">
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
            <div className="flex items-center gap-2">
              <button onClick={() => setShowDeleteModal(true)}
                className="p-2.5 bg-white/10 hover:bg-red-500/20 rounded-xl border border-white/10 transition-all group/del"
                title="Delete report">
                <Trash2 className="w-4 h-4 text-white/70 group-hover/del:text-red-300 transition-colors" />
              </button>
              <div className="px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <ScoreCircle score={r.overallScore || 0} size={64} />
              </div>
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

        {/* ─── DELETE ─── */}
        <div className="flex justify-end pt-2">
          <button onClick={() => setShowDeleteModal(true)}
            className="px-5 py-2.5 rounded-xl border-2 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 font-extrabold text-xs hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete Report
          </button>
        </div>

        <DeleteConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} deleting={deletingId === selectedReport._id} />
      </div>
    );
  }

  // ── CANDIDATE LIST VIEW ──
  if (!isRecruiter) {
    const completed = interviews.filter(i => i.report);
    const passed = completed.filter(i => (i.report.overallScore || 0) >= 65);
    const strongHires = completed.filter(i => i.report.recommendation === 'Strong Hire');

    return (
      <div className="space-y-6">
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`fixed top-6 right-6 z-[300] px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
                notification.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-emerald-600/90 text-white border-emerald-400'
              }`}
            >
              <span className="text-lg">{notification.type === 'error' ? '⚠️' : '✅'}</span>
              <span className="font-bold text-sm tracking-wide">{notification.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── HERO ─── */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal-600 via-emerald-700 to-green-800 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
          <div className="relative z-10 p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold flex items-center gap-1.5">
                <Award className="w-3 h-3" /> My Reports
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold mb-1">Interview Reports</h1>
            <p className="text-emerald-200 text-sm font-medium">Track your performance across AI interviews</p>

            {/* Stats row */}
            <div className="mt-5 grid grid-cols-3 gap-4 sm:gap-6 max-w-lg">
              {[
                { label: 'Completed', value: completed.length, icon: '✅', color: 'from-emerald-400 to-emerald-300' },
                { label: 'Passed', value: passed.length, icon: '🏆', color: 'from-teal-400 to-cyan-300' },
                { label: 'Strong Hires', value: strongHires.length, icon: '⭐', color: 'from-amber-400 to-yellow-300' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
                  <span className="text-xl mb-1 block">{stat.icon}</span>
                  <p className="text-2xl font-extrabold">
                    <motion.span key={stat.value} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }}>{stat.value}</motion.span>
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-200 uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── BODY ─── */}
        {loading || reportLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : completed.length === 0 && !interviewId ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 flex items-center justify-center text-4xl mb-5 shadow-inner">🎤</div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No reports yet</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm text-center mb-6">
              Complete an AI interview to see your report here and track your progress.
            </p>
            <Link href="/dashboard/interview-room"
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-extrabold rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2">
              <Target className="w-4 h-4" /> Start a Practice Interview
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {completed.map((interview, idx) => {
              const r = interview.report;
              const recConf = r?.recommendation ? recommendationColors[r.recommendation] : null;
              const score = r.overallScore || 0;

              return (
                <motion.div
                  key={interview._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden relative"
                  onClick={() => setSelectedReport(interview)}
                >
                  {/* Top accent bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${score >= 80 ? 'from-emerald-500 to-green-500' : score >= 65 ? 'from-teal-500 to-emerald-500' : score >= 50 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500'}`} />

                  <div className="p-5">
                    {/* Score + badge row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-slate-200 dark:border-slate-700">
                          <span className={`text-sm font-extrabold ${score >= 80 ? 'text-emerald-600' : score >= 65 ? 'text-teal-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{score}%</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white truncate">{interview.jobRole}</h3>
                          <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(r.completedAt || interview.completedAt || interview.assignedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteTargetId(interview._id); setShowDeleteModal(true); }}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-3">
                      <span className="flex items-center gap-1">💪 {r.strengths?.length || 0} strengths</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span className="flex items-center gap-1">📈 {r.areasForImprovement?.length || 0} to improve</span>
                    </div>

                    {/* Recommendation */}
                    {recConf && (
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${recConf.bg} text-[10px] font-bold`}>
                        <span>{recConf.icon}</span>
                        <span>{r.recommendation}</span>
                      </div>
                    )}

                    {/* Summary preview */}
                    {r.summary && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 line-clamp-2 leading-relaxed">{r.summary}</p>
                    )}

                    {/* Bottom chevron */}
                    <div className="mt-3 flex items-center justify-end text-[10px] font-bold text-teal-500">
                      View Details <ChevronRight className="w-3 h-3 ml-0.5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <DeleteConfirmModal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setDeleteTargetId(null); }} onConfirm={handleDelete} deleting={deletingId === (deleteTargetId || selectedReport?._id)} />
      </div>
    );
  }

  // ── RECRUITER LIST VIEW ──
  return (
    <div className="space-y-6">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[300] px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
              notification.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-emerald-600/90 text-white border-emerald-400'
            }`}
          >
            <span className="text-lg">{notification.type === 'error' ? '⚠️' : '✅'}</span>
            <span className="font-bold text-sm tracking-wide">{notification.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HEADER ─── */}
      <div className="relative rounded-2xl overflow-hidden p-6 lg:p-8 text-white shadow-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> Reports
            </div>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-1">Interview Reports</h1>
          <p className="text-white/70 text-sm font-medium">Review completed AI interviews for your candidates</p>
        </div>
      </div>

      {/* ─── REPORTS LIST ─── */}
      {loading || reportLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : interviews.filter(i => i.report).length === 0 && !interviewId ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 flex items-center justify-center text-4xl mb-5 shadow-inner">📋</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No reports yet</h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm text-center">Assign AI interviews to candidates. Completed interview reports will appear here.</p>
          <Link href="/dashboard/recruiter" className="mt-5 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Go to Recruiter Dashboard
          </Link>
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
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedReport(interview)}
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
                          <User className="w-3 h-3" />{interview.candidate?.fullName || 'Candidate'} • <Calendar className="w-3 h-3" />
                          {new Date(r.completedAt || interview.completedAt || interview.assignedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {recConf && (
                          <span className={`hidden sm:inline-flex text-xs font-bold px-3 py-1.5 rounded-full border ${recConf.bg}`}>
                            {recConf.icon} {r.recommendation}
                          </span>
                        )}
                        <div className="sm:hidden w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                          <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{r.overallScore || 0}%</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteTargetId(interview._id); setShowDeleteModal(true); }}
                          className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
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

      <DeleteConfirmModal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setDeleteTargetId(null); }} onConfirm={handleDelete} deleting={deletingId === (deleteTargetId || selectedReport?._id)} />
    </div>
  );
}
