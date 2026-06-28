"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Building, Calendar, Shield, Briefcase, Star, Target, Award, Loader2, Users, CheckCircle } from "lucide-react";
import api from "@/services/api";

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getAvatarColor = (id) => {
  const colors = [
    ['#14b8a6', '#059669'],
    ['#6366f1', '#7c3aed'],
    ['#f59e0b', '#ea580c'],
    ['#f43f5e', '#e11d48'],
    ['#06b6d4', '#0284c7'],
    ['#a855f7', '#9333ea'],
  ];
  const idx = (id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return colors[idx];
};

const StatCard = ({ icon, label, value, color, loading }) => (
  <div className="bg-white dark:bg-slate-800/80 rounded-xl px-2 sm:px-3 py-2 sm:py-2.5 border border-slate-100 dark:border-slate-700 text-center shadow-sm">
    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-1.5 shadow-sm`}>
      {icon}
    </div>
    {loading ? (
      <div className="flex justify-center py-1">
        <div className="w-6 h-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    ) : (
      <p className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white leading-tight">{value}</p>
    )}
    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
  </div>
);

const InfoRow = ({ icon, label, value, color }) => (
  <div className="group flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-default">
    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-px">{label}</p>
      <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{value || 'Not specified'}</p>
    </div>
  </div>
);

export default function UserProfileModal({ user, otherUser, onClose }) {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!otherUser?._id) return;
    setStatsLoading(true);
    api.get(`/auth/${otherUser._id}/stats`)
      .then(res => { if (res.data.success) setStats(res.data.data); })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, [otherUser?._id]);

  if (!otherUser) return null;

  const fullName = otherUser.fullName || 'Unknown User';
  const role = otherUser.role || 'User';
  const isCandidate = role.toLowerCase().includes('candidate') || role.toLowerCase() === 'user';
  const roleLabel = isCandidate ? 'Candidate' : 'Recruiter';
  const joinedDate = otherUser.createdAt
    ? new Date(otherUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'N/A';
  const initials = getInitials(fullName);
  const [c1, c2] = getAvatarColor(otherUser._id);

  const candidateStats = [
    { icon: <Briefcase className="w-3.5 h-3.5 text-white" />, label: "Interviews", value: stats?.interviews ?? '—', color: "from-blue-400 to-indigo-500", key: "interviews" },
    { icon: <CheckCircle className="w-3.5 h-3.5 text-white" />, label: "Completed", value: stats?.completed ?? '—', color: "from-emerald-400 to-teal-500", key: "completed" },
    { icon: <Award className="w-3.5 h-3.5 text-white" />, label: "Avg Score", value: stats?.avgScore ? `${stats.avgScore}%` : '—', color: "from-violet-400 to-purple-500", key: "avgScore" },
  ];

  const recruiterStats = [
    { icon: <Briefcase className="w-3.5 h-3.5 text-white" />, label: "Jobs", value: stats?.jobs ?? '—', color: "from-blue-400 to-indigo-500", key: "jobs" },
    { icon: <Users className="w-3.5 h-3.5 text-white" />, label: "Applicants", value: stats?.candidates ?? '—', color: "from-emerald-400 to-teal-500", key: "candidates" },
    { icon: <Star className="w-3.5 h-3.5 text-white" />, label: "Hired", value: stats?.hired ?? '—', color: "from-amber-400 to-orange-500", key: "hired" },
  ];

  const displayStats = isCandidate ? candidateStats : recruiterStats;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
          className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden mx-auto"
        >
          {/* ─── HERO ─── */}
          <div className="relative h-28 sm:h-32 md:h-36" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
            <div className="absolute inset-0 opacity-15">
              <div className="absolute -top-8 -left-8 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-12 -right-8 w-36 sm:w-48 h-36 sm:h-48 rounded-full bg-white blur-3xl" />
              <div className="absolute top-10 right-16 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-white blur-2xl" />
            </div>
            <div className="absolute -top-6 -right-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full border-[3px] border-white/10" />
            <div className="absolute top-6 -left-4 w-12 sm:w-16 h-12 sm:h-16 rounded-full border-[3px] border-white/10" />
            <button
              onClick={onClose}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/15 backdrop-blur-md text-white hover:bg-white/30 hover:scale-105 transition-all z-10 shadow-lg"
            >
              <X className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </button>
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
              <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/15 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1 sm:gap-1.5">
                <Shield className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                {roleLabel}
              </div>
            </div>
          </div>

          {/* ─── AVATAR ─── */}
          <div className="flex justify-center -mt-10 sm:-mt-11 md:-mt-12 relative z-10">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-xl border-[3px] sm:border-[4px] border-white dark:border-slate-900"
                style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                {otherUser.avatar ? (
                  <img src={otherUser.avatar} alt={fullName} className="w-full h-full object-cover rounded-lg sm:rounded-xl" />
                ) : (
                  initials
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-emerald-500 border-[2px] sm:border-[3px] border-white dark:border-slate-900 shadow-md flex items-center justify-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />
              </div>
            </div>
          </div>

          {/* ─── CONTENT ─── */}
          <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
            {/* Name + Subtitle */}
            <div className="text-center mb-4 sm:mb-5 mt-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white truncate px-1">{fullName}</h3>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap px-1 mt-0.5">
                {otherUser.company ? (
                  <span className="text-xs sm:text-sm font-medium text-slate-400 truncate max-w-[140px] sm:max-w-[200px]">{otherUser.company}</span>
                ) : null}
                {otherUser.email && (
                  <>
                    {otherUser.company && <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />}
                    <span className="text-xs sm:text-sm font-medium text-slate-400 truncate max-w-[140px] sm:max-w-[200px]">{otherUser.email}</span>
                  </>
                )}
              </div>
            </div>

            {/* ─── REAL STATS ─── */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-4 sm:mb-5">
              {displayStats.map((stat) => (
                <StatCard key={stat.key} {...stat} loading={statsLoading} />
              ))}
            </div>

            {/* ─── DETAILS ─── */}
            <div className="bg-slate-100/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 divide-y divide-slate-200/50 dark:divide-slate-700/50">
              {otherUser.email && (
                <InfoRow
                  icon={<Mail className="w-4 h-4 text-white" />}
                  label="Email"
                  value={otherUser.email}
                  color="from-teal-400 to-emerald-500"
                />
              )}
              {otherUser.company && (
                <InfoRow
                  icon={<Building className="w-4 h-4 text-white" />}
                  label="Company"
                  value={otherUser.company}
                  color="from-indigo-400 to-violet-500"
                />
              )}
              {otherUser.bio && (
                <InfoRow
                  icon={<Briefcase className="w-4 h-4 text-white" />}
                  label="Bio"
                  value={otherUser.bio}
                  color="from-amber-400 to-orange-500"
                />
              )}
              <InfoRow
                icon={<Calendar className="w-4 h-4 text-white" />}
                label="Member Since"
                value={joinedDate}
                color="from-purple-400 to-pink-500"
              />
            </div>

            {/* ─── ACTIONS ─── */}
            <div className="mt-4 sm:mt-5 flex gap-2 sm:gap-2.5">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-200 font-extrabold text-xs sm:text-sm hover:from-slate-300 hover:to-slate-400 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all shadow-sm"
              >
                Close
              </button>
              {otherUser.email && (
                <button
                  onClick={() => window.open(`mailto:${otherUser.email}`)}
                  className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm text-white transition-all shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                >
                  <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  Email
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
