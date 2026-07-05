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
  Trash2, Target, Lightbulb, Award, Sparkles,
  BarChart3, Clock, ExternalLink, Layers, Zap,
  BrainCircuit, Rocket, MessageSquareQuote
} from "lucide-react";

const recommendationColors = {
  'Strong Hire': { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', icon: '🏆' },
  'Hire': { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', icon: '✅' },
  'Consider': { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800', icon: '💭' },
  'No Hire': { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', icon: '❌' },
};

function ScoreRing({ score, size = 80 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : score >= 65 ? '#3b82f6' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-100 dark:text-slate-700/50" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} className="transition-all duration-1000 drop-shadow-sm" style={{ filter: `drop-shadow(0 0 4px ${color}40)` }} />
      </svg>
      <span className="absolute text-lg font-extrabold text-slate-800 dark:text-white">{score}</span>
    </div>
  );
}

function ConfirmModal({ isOpen, onClose, onConfirm, loading }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700/50 text-center">
            <div className="w-16 h-16 mx-auto bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-5">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">Delete this report?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              This action cannot be undone. The report will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} disabled={loading}
                className="flex-1 px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-extrabold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50">
                Cancel
              </button>
              <button onClick={onConfirm} disabled={loading}
                className="flex-1 px-5 py-3 rounded-xl bg-red-600 text-white font-extrabold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function deriveTopics(areas) {
  const keywords = areas?.map(a => a.toLowerCase()) || [];
  const topics = [];
  if (keywords.some(k => k.includes('communicat') || k.includes('present') || k.includes('speak')))
    topics.push({ label: 'Communication', icon: '🗣️', desc: 'Practice articulating technical concepts clearly.' });
  if (keywords.some(k => k.includes('problem') || k.includes('analyt') || k.includes('logic') || k.includes('reason')))
    topics.push({ label: 'Problem Solving', icon: '🧩', desc: 'Work through algorithmic challenges and case studies.' });
  if (keywords.some(k => k.includes('technical') || k.includes('code') || k.includes('program') || k.includes('develop') || k.includes('engineer')))
    topics.push({ label: 'Technical Skills', icon: '💻', desc: 'Deepen your understanding of core tech stack.' });
  if (keywords.some(k => k.includes('lead') || k.includes('manag') || k.includes('team') || k.includes('collabor')))
    topics.push({ label: 'Leadership', icon: '🤝', desc: 'Focus on team dynamics and delegation.' });
  if (keywords.some(k => k.includes('design') || k.includes('architect') || k.includes('system') || k.includes('scalab')))
    topics.push({ label: 'System Design', icon: '🏗️', desc: 'Study scalable architecture patterns.' });
  if (keywords.some(k => k.includes('domain') || k.includes('industr') || k.includes('business') || k.includes('context')))
    topics.push({ label: 'Domain Knowledge', icon: '📊', desc: 'Deepen industry-specific expertise.' });
  return topics.length > 0 ? topics : [{ label: 'Interview Skills', icon: '🎯', desc: 'Broad practice covering common scenarios.' }];
}

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get('interview');
  const { user } = useAuthStore();
  const { fetchRecruiterInterviews, fetchMyInterviews, deleteInterview } = useJobStore();

  const [interviews, setInterviews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notif, setNotif] = useState(null);

  const role = (user?.role || '').toLowerCase().trim();
  const isRecruiter = role.includes('recruit') || role === 'admin';

  const toast = (msg, type = 'success') => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = isRecruiter ? await fetchRecruiterInterviews('completed') : await fetchMyInterviews('completed');
      setInterviews(data || []);
      setLoading(false);
      if (interviewId && data?.length > 0) {
        const found = data.find(i => i._id === interviewId);
        if (found?.report) setSelected(found);
      }
    };
    load();
  }, [isRecruiter, fetchRecruiterInterviews, fetchMyInterviews, interviewId]);

  useEffect(() => {
    if (interviewId && !selected && !loading) {
      const fetchSingle = async () => {
        setReportLoading(true);
        try {
          const res = await api.get(`/interviews/${interviewId}`);
          if (res.data.data.interview?.report) setSelected(res.data.data.interview);
        } catch (e) { /* ignore */ }
        setReportLoading(false);
      };
      fetchSingle();
    }
  }, [interviewId, selected, loading]);

  const handleDelete = async () => {
    const id = deleteTarget || selected?._id;
    if (!id) return;
    setDeleting(id);
    const res = await deleteInterview(id);
    setDeleting(null);
    setShowDelete(false);
    setDeleteTarget(null);
    if (res.success) {
      toast('Report deleted');
      setInterviews(prev => prev.filter(i => i._id !== id));
      setSelected(null);
    } else {
      toast(res.message || 'Failed to delete', 'error');
    }
  };

  // ── DETAIL HEADER ──
  function DetailHeader({ data, onBack, onDelete }) {
    const r = data.report;
    const score = r.overallScore || 0;
    const rec = r?.recommendation ? recommendationColors[r.recommendation] : null;

    return (
      <div>
        <button onClick={onBack} className="group inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4">
          <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 shadow-sm group-hover:border-blue-200 dark:group-hover:border-blue-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Reports
        </button>

        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white shadow-xl border border-slate-700/50">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.06)_0%,transparent_50%)]" />

          <div className="relative z-10 p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                <Award className="w-3 h-3" />
                {!isRecruiter ? 'My Report' : 'Interview Report'}
              </div>
              <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-[10px] font-semibold text-white/60">
                {new Date(r.completedAt || data.completedAt || data.assignedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl lg:text-4xl font-extrabold mb-2 leading-tight">{data.jobRole}</h1>
                <p className="text-white/50 text-sm font-medium">
                  {!isRecruiter ? 'Your performance assessment' : `Candidate: ${data.candidate?.fullName || 'N/A'}`}
                </p>
                <div className="mt-5 flex items-center gap-6">
                  <div>
                    <span className="text-[10px] text-blue-300 font-semibold uppercase tracking-widest">Questions</span>
                    <p className="text-lg font-extrabold">{r.detailedFeedback?.length || data.answers?.length || 0}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <span className="text-[10px] text-blue-300 font-semibold uppercase tracking-widest">Strengths</span>
                    <p className="text-lg font-extrabold">{r.strengths?.length || 0}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <span className="text-[10px] text-blue-300 font-semibold uppercase tracking-widest">To Improve</span>
                    <p className="text-lg font-extrabold">{r.areasForImprovement?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <button onClick={onDelete}
                  className="p-2.5 bg-white/10 hover:bg-red-500/20 rounded-xl border border-white/10 transition-all group/del self-start mt-1"
                  title="Delete report">
                  <Trash2 className="w-4 h-4 text-white/50 group-hover/del:text-red-300 transition-colors" />
                </button>
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-3">
                    <ScoreRing score={score} size={80} />
                  </div>
                  <span className="text-[9px] font-bold text-blue-300 uppercase tracking-widest mt-1.5">Overall</span>
                </div>
              </div>
            </div>

            {rec && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <span className="text-lg">{rec.icon}</span>
                <span className="text-sm font-extrabold">{r.recommendation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Performance</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-white">{score}/100</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${score >= 80 ? 'from-emerald-500 to-green-500' : score >= 65 ? 'from-blue-500 to-cyan-500' : score >= 50 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500'} shadow-sm`}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] text-slate-400">Needs Work</span>
            <span className="text-[9px] text-slate-400">Excellent</span>
          </div>
        </div>
      </div>
    );
  }

  function Section({ title, icon, dotColor, children, className = "" }) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm ${className}`}>
        <div className="flex items-center gap-2.5 mb-4">
          {icon && <span className={dotColor || "text-blue-500"}>{icon}</span>}
          <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300">{title}</h3>
        </div>
        {children}
      </div>
    );
  }

  // ── CANDIDATE DETAIL ──
  if (selected && !isRecruiter) {
    const r = selected.report;
    const topics = deriveTopics(r.areasForImprovement);
    const score = r.overallScore || 0;

    return (
      <div className="space-y-5 max-w-4xl">
        <AnimatePresence>
          {notif && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`fixed top-6 right-6 z-[300] px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
                notif.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-emerald-600/90 text-white border-emerald-400'
              }`}
            >
              <span className="text-lg">{notif.type === 'error' ? '⚠️' : '✅'}</span>
              <span className="font-bold text-sm tracking-wide">{notif.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <DetailHeader data={selected} onBack={() => setSelected(null)} onDelete={() => setShowDelete(true)} />

        {/* Score Distribution */}
        {selected.answers?.length > 0 && (
          <Section title="Score Distribution" icon={<Layers className="w-4 h-4 text-blue-500" />}>
            {(() => {
              const scores = selected.answers.map(a => a.score || 0);
              const excellent = scores.filter(s => s >= 80).length;
              const good = scores.filter(s => s >= 65 && s < 80).length;
              const average = scores.filter(s => s >= 50 && s < 65).length;
              const weak = scores.filter(s => s < 50).length;
              const total = scores.length || 1;
              return (
                <div className="space-y-3">
                  <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {excellent > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(excellent / total) * 100}%` }} transition={{ duration: 0.8 }} className="bg-emerald-500" />}
                    {good > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(good / total) * 100}%` }} transition={{ duration: 0.8, delay: 0.15 }} className="bg-blue-400" />}
                    {average > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(average / total) * 100}%` }} transition={{ duration: 0.8, delay: 0.3 }} className="bg-amber-400" />}
                    {weak > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(weak / total) * 100}%` }} transition={{ duration: 0.8, delay: 0.45 }} className="bg-red-400" />}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Excellent', count: excellent, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
                      { label: 'Good', count: good, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
                      { label: 'Average', count: average, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
                      { label: 'Weak', count: weak, color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
                    ].map((item, i) => (
                      <div key={i} className={`px-2 py-2 rounded-xl ${item.color} text-center`}>
                        <p className="text-lg font-extrabold">{item.count}</p>
                        <p className="text-[9px] font-bold uppercase tracking-wider">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </Section>
        )}

        {/* Skills Assessed */}
        {selected.answers?.length > 0 && (
          <Section title="Skills Detected" icon={<BrainCircuit className="w-4 h-4 text-blue-500" />}>
            {(() => {
              const words = selected.answers.map(a => a.question || '').join(' ').replace(/[^a-zA-Z\s]/g, '');
              const skills = ['JavaScript', 'React', 'Node', 'Python', 'SQL', 'API', 'Database', 'Frontend', 'Backend', 'Full Stack', 'CSS', 'HTML', 'TypeScript', 'AWS', 'Docker', 'Git', 'Agile', 'REST', 'GraphQL', 'Testing', 'DevOps', 'Security', 'Performance', 'Architecture', 'Design Patterns', 'Algorithm', 'Data Structure', 'OOP', 'Microservices', 'CI/CD', 'Cloud', 'Mobile', 'UI/UX', 'Redux', 'Next.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis', 'Kubernetes', 'Linux', 'System Design', 'Product', 'Leadership', 'Communication', 'Problem Solving'];
              const found = skills.filter(k => words.toLowerCase().includes(k.toLowerCase()));
              return found.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {found.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-lg border border-blue-200 dark:border-blue-800">
                      {s}
                    </span>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-400">General skills evaluated</p>;
            })()}
          </Section>
        )}

        {/* Summary */}
        {r.summary && (
          <Section title="Summary" icon={<MessageSquareQuote className="w-4 h-4 text-blue-500" />}>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{r.summary}</p>
          </Section>
        )}

        {/* Strengths */}
        {r.strengths?.length > 0 && (
          <Section title="Strengths" icon={<Zap className="w-4 h-4 text-emerald-500" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {r.strengths.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                  <span className="text-lg mt-0.5 shrink-0">✨</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{s}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        )}

        {/* Areas to Improve + Practice */}
        {r.areasForImprovement?.length > 0 && (
          <Section title="Areas to Improve" icon={<TrendingUp className="w-4 h-4 text-amber-500" />}>
            <div className="space-y-2.5 mb-5">
              {r.areasForImprovement.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                  <span className="text-lg mt-0.5 shrink-0">📈</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{a}</p>
                </div>
              ))}
            </div>
            <Link href="/dashboard/interview-room"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-sm rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/20">
              <Target className="w-4 h-4" /> Practice These Areas
            </Link>
          </Section>
        )}

        {/* Practice Topics */}
        {topics.length > 0 && (
          <Section title="Suggested Topics" icon={<Lightbulb className="w-4 h-4 text-amber-500" />}>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Focus on these areas based on your improvement opportunities:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topics.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-gradient-to-br from-blue-50/40 to-cyan-50/40 dark:from-blue-900/10 dark:to-cyan-900/10 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <span className="text-2xl mb-2 block">{t.icon}</span>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mb-1">{t.label}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{t.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        )}

        {/* Feedback */}
        {r.detailedFeedback?.length > 0 && (
          <Section title="Question Feedback" icon={<Star className="w-4 h-4 text-amber-500 fill-amber-500" />}>
            <div className="space-y-3">
              {r.detailedFeedback.map((f, i) => {
                const answer = selected.answers?.find(a => a.questionId === f.questionNumber);
                const qScore = answer?.score || f.score;
                const qBorder = qScore >= 80 ? 'border-l-emerald-500' : qScore >= 60 ? 'border-l-amber-500' : 'border-l-red-500';
                const qBadge = qScore >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : qScore >= 60 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className={`p-4 rounded-xl border-l-4 ${qBorder} bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-extrabold">{f.questionNumber || i + 1}</span>
                        <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Q{f.questionNumber || i + 1}</span>
                      </div>
                      {qScore && <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${qBadge}`}>{qScore}%</span>}
                    </div>
                    {answer?.question && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700">
                        &ldquo;{answer.question}&rdquo;
                      </p>
                    )}
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.feedback}</p>
                  </motion.div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Suggested Roles */}
        {r.suggestedRoles?.length > 0 && (
          <Section title="Suggested Roles" icon={<Rocket className="w-4 h-4 text-blue-500" />}>
            <div className="flex flex-wrap gap-2">
              {r.suggestedRoles.map((role, i) => (
                <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-bold rounded-lg border border-blue-200 dark:border-blue-800">{role}</span>
              ))}
            </div>
          </Section>
        )}

        {/* Comparison */}
        {selected.answers?.length > 0 && (
          <Section title="How You Compare" icon={<BarChart3 className="w-4 h-4 text-blue-500" />}>
            {(() => {
              const rank = score >= 90 ? 'Top 5%' : score >= 80 ? 'Top 15%' : score >= 70 ? 'Top 30%' : score >= 60 ? 'Top 50%' : score >= 50 ? 'Top 70%' : 'Below Avg';
              const level = score >= 80 ? 'Advanced' : score >= 65 ? 'Intermediate' : score >= 50 ? 'Developing' : 'Beginner';
              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border border-emerald-200 dark:border-emerald-800 text-center">
                    <span className="text-2xl mb-1 block">📊</span>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-white">{rank}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Percentile</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border border-blue-200 dark:border-blue-800 text-center">
                    <span className="text-2xl mb-1 block">🎯</span>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-white">{level}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Level</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800 text-center">
                    <span className="text-2xl mb-1 block">📈</span>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-white">{selected.answers.length}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Answered</p>
                  </div>
                </div>
              );
            })()}
          </Section>
        )}

        {/* Practice CTA */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white shadow-xl p-6 lg:p-8 border border-slate-700/50">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/8 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold mb-1">Ready to level up?</h3>
              <p className="text-white/50 text-sm font-medium">Take another AI interview and track your growth over time.</p>
            </div>
            <Link href="/dashboard/interview-room"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-extrabold rounded-xl hover:bg-slate-100 transition-all shadow-lg shadow-black/20 shrink-0">
              <Target className="w-5 h-5" /> Start Practice
            </Link>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button onClick={() => setShowDelete(true)}
            className="px-5 py-2.5 rounded-xl border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-extrabold text-xs hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete Report
          </button>
        </div>

        <ConfirmModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} loading={deleting === selected._id} />
      </div>
    );
  }

  // ── RECRUITER DETAIL ──
  if (selected && isRecruiter) {
    const r = selected.report;
    const rec = r?.recommendation ? recommendationColors[r.recommendation] : null;

    return (
      <div className="space-y-5 max-w-4xl">
        <AnimatePresence>
          {notif && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`fixed top-6 right-6 z-[300] px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
                notif.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-emerald-600/90 text-white border-emerald-400'
              }`}
            >
              <span className="text-lg">{notif.type === 'error' ? '⚠️' : '✅'}</span>
              <span className="font-bold text-sm tracking-wide">{notif.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <DetailHeader data={selected} onBack={() => setSelected(null)} onDelete={() => setShowDelete(true)} />

        {rec && (
          <div className={`p-5 rounded-2xl border ${rec.bg}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{rec.icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommendation</p>
                <p className={`text-xl font-extrabold ${rec.text}`}>{r.recommendation}</p>
              </div>
            </div>
          </div>
        )}

        {r.summary && (
          <Section title="Summary" icon={<MessageSquareQuote className="w-4 h-4 text-blue-500" />}>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{r.summary}</p>
          </Section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {r.strengths?.length > 0 && (
            <Section title="Strengths" icon={<Zap className="w-4 h-4 text-emerald-500" />}>
              <ul className="space-y-2.5">
                {r.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-emerald-500 mt-0.5 shrink-0">✅</span> {s}
                  </li>
                ))}
              </ul>
            </Section>
          )}
          {r.areasForImprovement?.length > 0 && (
            <Section title="Areas to Improve" icon={<TrendingUp className="w-4 h-4 text-amber-500" />}>
              <ul className="space-y-2.5">
                {r.areasForImprovement.map((a, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-amber-500 mt-0.5 shrink-0">💪</span> {a}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {r.detailedFeedback?.length > 0 && (
          <Section title="Question Feedback" icon={<Star className="w-4 h-4 text-amber-500 fill-amber-500" />}>
            <div className="space-y-3">
              {r.detailedFeedback.map((f, i) => {
                const answer = selected.answers?.find(a => a.questionId === f.questionNumber);
                return (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">Q{f.questionNumber || i + 1}</span>
                      {answer?.score && (
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                          answer.score >= 80 ? 'bg-emerald-50 text-emerald-700' : answer.score >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                        }`}>{answer.score}%</span>
                      )}
                    </div>
                    {answer?.question && <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 italic">{answer.question}</p>}
                    <p className="text-sm text-slate-600 dark:text-slate-400">{f.feedback}</p>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {r.suggestedRoles?.length > 0 && (
          <Section title="Suggested Roles" icon={<Rocket className="w-4 h-4 text-blue-500" />}>
            <div className="flex flex-wrap gap-2">
              {r.suggestedRoles.map((role, i) => (
                <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-bold rounded-lg border border-blue-200 dark:border-blue-800">{role}</span>
              ))}
            </div>
          </Section>
        )}

        <div className="flex justify-end pt-2">
          <button onClick={() => setShowDelete(true)}
            className="px-5 py-2.5 rounded-xl border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-extrabold text-xs hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete Report
          </button>
        </div>

        <ConfirmModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} loading={deleting === selected._id} />
      </div>
    );
  }

  // ── CANDIDATE LIST ──
  if (!isRecruiter) {
    const completed = interviews.filter(i => i.report);
    const passed = completed.filter(i => (i.report.overallScore || 0) >= 65);
    const strong = completed.filter(i => i.report.recommendation === 'Strong Hire');

    return (
      <div className="space-y-6">
        <AnimatePresence>
          {notif && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`fixed top-6 right-6 z-[300] px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
                notif.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-emerald-600/90 text-white border-emerald-400'
              }`}
            >
              <span className="text-lg">{notif.type === 'error' ? '⚠️' : '✅'}</span>
              <span className="font-bold text-sm tracking-wide">{notif.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white shadow-xl border border-slate-700/50">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.06)_0%,transparent_50%)]" />
          <div className="relative z-10 p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                <Award className="w-3 h-3" /> My Reports
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold mb-1">Interview Reports</h1>
            <p className="text-white/50 text-sm font-medium">Track your performance across AI-powered interviews</p>

            <div className="mt-5 grid grid-cols-3 gap-4 sm:gap-6 max-w-lg">
              {[
                { label: 'Completed', value: completed.length, icon: '✅', color: 'from-emerald-400 to-emerald-300' },
                { label: 'Passed', value: passed.length, icon: '🏆', color: 'from-blue-400 to-cyan-300' },
                { label: 'Strong Hires', value: strong.length, icon: '⭐', color: 'from-amber-400 to-yellow-300' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
                  <span className="text-xl mb-1 block">{stat.icon}</span>
                  <p className="text-2xl font-extrabold">
                    <motion.span key={stat.value} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }}>{stat.value}</motion.span>
                  </p>
                  <p className="text-[9px] font-semibold text-blue-300 uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {loading || reportLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : completed.length === 0 && !interviewId ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700/50">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 flex items-center justify-center text-4xl mb-5 shadow-inner">🎤</div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No reports yet</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm text-center mb-6 leading-relaxed">
              Complete your first AI interview to unlock insights about your performance.
            </p>
            <Link href="/dashboard/interview-room"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
              <Target className="w-4 h-4" /> Start Interview
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {completed.map((item, idx) => {
              const r = item.report;
              const rec = r?.recommendation ? recommendationColors[r.recommendation] : null;
              const score = r.overallScore || 0;

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden relative"
                  onClick={() => setSelected(item)}
                >
                  <div className={`h-1.5 w-full bg-gradient-to-r ${score >= 80 ? 'from-emerald-500 to-green-500' : score >= 65 ? 'from-blue-500 to-cyan-500' : score >= 50 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500'}`} />

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-slate-200 dark:border-slate-700">
                          <span className={`text-sm font-extrabold ${score >= 80 ? 'text-emerald-600' : score >= 65 ? 'text-blue-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{score}%</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white truncate">{item.jobRole}</h3>
                          <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(r.completedAt || item.completedAt || item.assignedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(item._id); setShowDelete(true); }}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-3">
                      <span>💪 {r.strengths?.length || 0} strengths</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span>📈 {r.areasForImprovement?.length || 0} to improve</span>
                    </div>

                    {rec && (
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${rec.bg} text-[10px] font-bold`}>
                        <span>{rec.icon}</span>
                        <span>{r.recommendation}</span>
                      </div>
                    )}

                    {r.summary && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 line-clamp-2 leading-relaxed">{r.summary}</p>
                    )}

                    <div className="mt-3 flex items-center justify-end text-[10px] font-bold text-blue-500">
                      View Details <ChevronRight className="w-3 h-3 ml-0.5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <ConfirmModal isOpen={showDelete} onClose={() => { setShowDelete(false); setDeleteTarget(null); }} onConfirm={handleDelete} loading={deleting === (deleteTarget || selected?._id)} />
      </div>
    );
  }

  // ── RECRUITER LIST ──
  const completed = interviews.filter(i => i.report);
  return (
    <div className="space-y-6">
      <AnimatePresence>
        {notif && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[300] px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
              notif.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-emerald-600/90 text-white border-emerald-400'
            }`}
          >
            <span className="text-lg">{notif.type === 'error' ? '⚠️' : '✅'}</span>
            <span className="font-bold text-sm tracking-wide">{notif.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white shadow-xl border border-slate-700/50">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.06)_0%,transparent_50%)]" />
        <div className="relative z-10 p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold text-blue-300 flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> Reports
            </div>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-1">Interview Reports</h1>
          <p className="text-white/50 text-sm font-medium">Review completed AI interviews for your candidates</p>
        </div>
      </div>

      {loading || reportLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : completed.length === 0 && !interviewId ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700/50">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 flex items-center justify-center text-4xl mb-5 shadow-inner">📋</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No reports yet</h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm text-center">Assign AI interviews to candidates. Completed reports appear here.</p>
          <Link href="/dashboard/recruiter" className="mt-5 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Recruiter Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {completed.map((item, idx) => {
            const r = item.report;
            const rec = r?.recommendation ? recommendationColors[r.recommendation] : null;

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer relative overflow-hidden"
                onClick={() => setSelected(item)}
              >
                <div className="flex items-center gap-5">
                  <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-slate-200 dark:border-slate-700">
                    <ScoreRing score={r.overallScore || 0} size={56} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-800 dark:text-white">{item.jobRole}</h3>
                        <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <User className="w-3 h-3" />{item.candidate?.fullName || 'Candidate'} • <Calendar className="w-3 h-3" />
                          {new Date(r.completedAt || item.completedAt || item.assignedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {rec && (
                          <span className={`hidden sm:inline-flex text-xs font-bold px-3 py-1.5 rounded-full border ${rec.bg}`}>
                            {rec.icon} {r.recommendation}
                          </span>
                        )}
                        <div className="sm:hidden w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                          <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">{r.overallScore || 0}%</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(item._id); setShowDelete(true); }}
                          className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
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

      <ConfirmModal isOpen={showDelete} onClose={() => { setShowDelete(false); setDeleteTarget(null); }} onConfirm={handleDelete} loading={deleting === (deleteTarget || selected?._id)} />
    </div>
  );
}
