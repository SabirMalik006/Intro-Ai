"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import useJobStore from "@/store/jobStore";
import { useToast } from "@/components/Toast";
import { Search, MapPin, Briefcase, Clock, DollarSign, ChevronRight, Building2, Sparkles, SlidersHorizontal, X, Users, Bookmark } from "lucide-react";

const jobTypeIcons = {
  "full-time": { icon: "💼", color: "from-blue-500 to-blue-600 bg-blue-100 text-blue-600 border-blue-200" },
  "part-time": { icon: "⏳", color: "from-amber-500 to-amber-600 bg-amber-100 text-amber-600 border-amber-200" },
  "remote": { icon: "🌍", color: "from-emerald-500 to-emerald-600 bg-emerald-100 text-emerald-600 border-emerald-200" },
  "contract": { icon: "📄", color: "from-purple-500 to-purple-600 bg-purple-100 text-purple-600 border-purple-200" },
};

const expLevelColors = {
  entry: { label: "Entry", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  mid: { label: "Mid", color: "bg-blue-100 text-blue-700 border-blue-200" },
  senior: { label: "Senior", color: "bg-purple-100 text-purple-700 border-purple-200" },
  lead: { label: "Lead", color: "bg-rose-100 text-rose-700 border-rose-200" },
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  const days = Math.floor(hrs / 24);
  if (days < 7) return days + "d ago";
  return new Date(date).toLocaleDateString();
}

function FloatIcon({ children, delay = 0, x = 0, y = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className={`absolute pointer-events-none ${className}`}
      style={{ left: `${50 + x}%`, top: `${50 + y}%` }}
    >
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function FloatingOrb({ size, color, x, y, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 0.15, scale: 1 }}
      transition={{ duration: 2, delay }}
      className={`absolute rounded-full blur-3xl ${color}`}
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 25, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-full h-full"
      />
    </motion.div>
  );
}

function DotGrid({ opacity = 0.04, id = "dots" }) {
  return (
    <svg className="absolute inset-0 w-full h-full" style={{ opacity }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="white" />
          <circle cx="18" cy="18" r="1" fill="white" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function HeroShape({ className }) {
  return (
    <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0Z" fill="url(#grad)" opacity="0.3" />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── BACKGROUND VARIANTS ───
const BG_VARIANTS = [
  // 1. Orbs + Icons (current)
  () => (
    <>
      <FloatingOrb size={800} color="bg-indigo-500" x={80} y={-30} delay={0} />
      <FloatingOrb size={600} color="bg-violet-500" x={-15} y={70} delay={1} />
      <FloatingOrb size={450} color="bg-indigo-400" x={55} y={80} delay={2} />
      <DotGrid />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-indigo-400/8 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-violet-400/8 to-transparent rounded-full blur-3xl"></div>
      <FloatIcon delay={0.5} x={-40} y={-32}><div className="text-5xl opacity-25">💼</div></FloatIcon>
      <FloatIcon delay={1.2} x={42} y={-28}><div className="text-4xl opacity-20">🚀</div></FloatIcon>
      <FloatIcon delay={2} x={-38} y={30}><div className="text-4xl opacity-20">⭐</div></FloatIcon>
      <FloatIcon delay={0.8} x={44} y={34}><div className="text-5xl opacity-25">🎯</div></FloatIcon>
      <HeroShape className="w-64 h-64 top-[-40px] right-[-50px] opacity-50" />
      <HeroShape className="w-44 h-44 bottom-[-30px] left-[-30px] opacity-40 rotate-45" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="g1" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#g1)" />
      </svg>
    </>
  ),

  // 2. Twinkling Stars + Aurora
  () => {
    const stars = Array.from({ length: 40 }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
      dur: Math.random() * 2 + 1.5,
    }));
    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-transparent to-violet-500/20 blur-3xl"></div>
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[300px] bg-violet-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        {stars.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}
        <FloatIcon delay={1} x={-35} y={-25}><div className="text-4xl opacity-20">✨</div></FloatIcon>
        <FloatIcon delay={2.5} x={38} y={-20}><div className="text-3xl opacity-15">🌟</div></FloatIcon>
      </>
    );
  },

  // 3. Wavy Lines + Geometric
  () => (
    <>
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 1200 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path d="M0,300 C200,100 400,500 600,300 C800,100 1000,500 1200,300" stroke="url(#w1)" strokeWidth="40" fill="none" opacity="0.3"
          animate={{ d: ["M0,300 C200,100 400,500 600,300 C800,100 1000,500 1200,300", "M0,200 C200,400 400,100 600,400 C800,100 1000,400 1200,200", "M0,300 C200,100 400,500 600,300 C800,100 1000,500 1200,300"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path d="M0,400 C200,600 400,200 600,400 C800,600 1000,200 1200,400" stroke="url(#w2)" strokeWidth="25" fill="none" opacity="0.2"
          animate={{ d: ["M0,400 C200,600 400,200 600,400 C800,600 1000,200 1200,400", "M0,300 C200,100 400,500 600,300 C800,100 1000,500 1200,300", "M0,400 C200,600 400,200 600,400 C800,600 1000,200 1200,400"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="w1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient>
          <linearGradient id="w2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#6366f1" /></linearGradient>
        </defs>
      </svg>
      <div className="absolute top-[-20px] left-[-20px] w-[200px] h-[200px] border border-indigo-400/20 rounded-3xl rotate-12"></div>
      <div className="absolute bottom-[10%] right-[5%] w-[150px] h-[150px] border border-violet-400/20 rounded-full"></div>
      <div className="absolute top-[30%] right-[15%] w-[100px] h-[100px] border border-indigo-400/15 rounded-2xl -rotate-12"></div>
      <FloatIcon delay={0.5} x={-42} y={-30}><div className="text-4xl opacity-20">📈</div></FloatIcon>
      <FloatIcon delay={1.5} x={40} y={25}><div className="text-4xl opacity-15">💡</div></FloatIcon>
    </>
  ),

  // 4. Diagonal Gradient Bars + Floating Cubes
  () => (
    <>
      <div className="absolute inset-0 overflow-hidden">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <motion.div
            key={i}
            className="absolute h-[200px] w-[800px] bg-gradient-to-r from-indigo-500/5 via-violet-500/8 to-transparent -skew-y-12"
            style={{ top: `${i * 18 - 10}%`, left: `${i % 2 === 0 ? -10 : -20}%` }}
            animate={{ x: [0, i % 2 === 0 ? 30 : -30, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}
      </div>
      {[
        { x: 10, y: 15, s: 60, r: 15, d: 0 },
        { x: 85, y: 10, s: 40, r: 25, d: 1 },
        { x: 75, y: 60, s: 50, r: 10, d: 2 },
        { x: 15, y: 70, s: 35, r: 20, d: 0.5 },
      ].map((box, i) => (
        <motion.div
          key={`box${i}`}
          className="absolute border border-indigo-400/20 bg-indigo-400/5 backdrop-blur-sm"
          style={{ left: `${box.x}%`, top: `${box.y}%`, width: box.s, height: box.s, borderRadius: box.r }}
          animate={{ y: [0, -15, 0], rotate: [0, box.r, 0] }}
          transition={{ duration: 5 + box.d, repeat: Infinity, ease: "easeInOut", delay: box.d }}
        />
      ))}
      <FloatIcon delay={0.8} x={-38} y={-28}><div className="text-4xl opacity-20">🏢</div></FloatIcon>
      <FloatIcon delay={1.8} x={40} y={30}><div className="text-4xl opacity-15">📊</div></FloatIcon>
    </>
  ),

  // 5. Circuit / Connected Nodes
  () => {
    const nodes = [
      { x: 10, y: 20 }, { x: 30, y: 15 }, { x: 50, y: 25 }, { x: 70, y: 15 },
      { x: 85, y: 30 }, { x: 20, y: 55 }, { x: 45, y: 50 }, { x: 65, y: 60 },
      { x: 80, y: 70 }, { x: 35, y: 80 }, { x: 55, y: 75 }, { x: 15, y: 40 },
    ];
    const connections = [
      [0,1],[1,2],[2,3],[3,4],[5,6],[6,7],[7,8],[9,10],[0,5],[1,6],[2,7],[3,8],[4,8],[5,9],[6,10],[7,11],
    ];
    return (
      <>
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 100 100" preserveAspectRatio="none">
          {connections.map(([a, b], i) => (
            <motion.line
              key={i}
              x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
              stroke="url(#circuitGrad)" strokeWidth="0.3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
            />
          ))}
          <defs>
            <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        {nodes.map((n, i) => (
          <motion.div
            key={`n${i}`}
            className="absolute w-2 h-2 rounded-full bg-indigo-400/60 shadow-lg shadow-indigo-400/30"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          />
        ))}
        <div className="absolute top-[5%] right-[10%] w-[300px] h-[300px] bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-transparent rounded-full blur-[80px]"></div>
        <FloatIcon delay={1} x={-36} y={-22}><div className="text-4xl opacity-20">🔗</div></FloatIcon>
        <FloatIcon delay={2} x={42} y={28}><div className="text-3xl opacity-15">⚡</div></FloatIcon>
      </>
    );
  },
];

export default function ExploreJobsPage() {
  const toast = useToast();
  const { jobs, loading, error, fetchAllJobs, saveJob, unsaveJob, fetchSavedJobs, savedJobIds } = useJobStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    jobType: "",
    experienceLevel: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [focused, setFocused] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState({});

  useEffect(() => {
    fetchAllJobs();
    fetchSavedJobs();
  }, [fetchAllJobs, fetchSavedJobs]);

  const toggleBookmark = async (jobId) => {
    if (bookmarkLoading[jobId]) return;
    setBookmarkLoading(prev => ({ ...prev, [jobId]: true }));
    const isSaved = savedJobIds.includes(jobId);
    const res = isSaved ? await unsaveJob(jobId) : await saveJob(jobId);
    setBookmarkLoading(prev => ({ ...prev, [jobId]: false }));
    if (res.success) {
      toast(res.message, 'success');
    } else {
      toast(res.message, 'error');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAllJobs({ search: searchQuery, ...filters });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: filters[key] === value ? "" : value };
    setFilters(newFilters);
    fetchAllJobs({ search: searchQuery, ...newFilters });
  };

  const clearFilters = () => {
    setFilters({ jobType: "", experienceLevel: "" });
    fetchAllJobs({ search: searchQuery });
  };

  const hasActiveFilters = filters.jobType || filters.experienceLevel;

  const bgIndex = useMemo(() => Math.floor(Math.random() * BG_VARIANTS.length), []);
  const BgComponent = BG_VARIANTS[bgIndex];

  return (
    <div className="min-h-screen pb-20 space-y-8">
      {/* ─── HERO SECTION ─── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-8 lg:p-12 text-white shadow-2xl min-h-[420px] lg:min-h-[460px] flex items-center">
        <BgComponent />

        <div className="relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-5"
          >
            <div className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold text-indigo-200 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <motion.span
                key={jobs.length}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-block"
              >
                {jobs.length}
              </motion.span> opportunities available
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight"
          >
            Find your{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-200 bg-clip-text text-transparent">dream job</span>
            <br />
            and shape your future
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-indigo-200/80 text-lg mb-8 max-w-2xl leading-relaxed"
          >
            Browse thousands of curated opportunities from top companies. Your next career move starts here.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 bg-white/5 backdrop-blur-xl p-2 rounded-2xl border border-white/10 max-w-2xl"
          >
            <div className="flex-1 relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focused ? 'text-indigo-300' : 'text-indigo-400/50'}`} />
              <input
                type="text"
                placeholder="Search by title, company, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full bg-transparent border-none focus:ring-2 focus:ring-indigo-400/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-indigo-300/40 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-indigo-900 font-extrabold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-all active:scale-[0.97] shadow-lg shadow-indigo-500/20 whitespace-nowrap"
            >
              Search
            </button>
          </motion.form>
        </div>
      </div>

      {/* ─── FILTERS BAR ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all font-semibold text-sm ${
              showFilters ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            )}
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {['full-time', 'part-time', 'remote', 'contract'].map((type) => {
            const active = filters.jobType === type;
            return (
              <button
                key={type}
                onClick={() => handleFilterChange('jobType', type)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border-2 flex items-center gap-2 ${
                  active
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 -translate-y-0.5'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <span>{jobTypeIcons[type]?.icon}</span>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{jobs.length}</span> jobs found
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 uppercase tracking-wider">Experience Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {['entry', 'mid', 'senior', 'lead'].map(level => {
                    const active = filters.experienceLevel === level;
                    const lvl = expLevelColors[level];
                    return (
                      <button
                        key={level}
                        onClick={() => handleFilterChange('experienceLevel', level)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border-2 ${
                          active
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all font-bold text-sm"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── JOB LISTING ─── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[340px] bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-700">
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[1,2,3,4].map(j => <div key={j} className="h-7 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>)}
                </div>
                <div className="flex gap-1.5">
                  {[1,2,3].map(j => <div key={j} className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-10 rounded-2xl text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 font-bold mb-4">{error}</p>
          <button onClick={() => fetchAllJobs()} className="bg-red-600 text-white px-8 py-3 rounded-xl font-extrabold hover:bg-red-700 transition-all shadow-lg">
            Try Again
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="text-7xl mb-6 opacity-60">🔍</div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">No matching jobs</h3>
          <p className="text-slate-400 dark:text-slate-500 max-w-md mx-auto">We couldn't find any jobs matching your criteria. Try adjusting your filters or search terms.</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-6 text-indigo-600 font-bold text-sm hover:underline">
              Clear all filters →
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {jobs.map((job, index) => {
            const jobTypeInfo = jobTypeIcons[job.jobType] || jobTypeIcons["full-time"];
            const expInfo = expLevelColors[job.experienceLevel] || expLevelColors.mid;
            const skillsPreview = job.skills?.slice(0, 3) || [];
            const hasSalary = job.salary?.min && job.salary?.max;
            const appCount = job.applicantsCount || job.applicationsCount || 0;

            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.12)] dark:hover:shadow-none hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                {/* Top gradient accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Card shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <div className="p-5 relative z-10 flex flex-col h-full">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-extrabold shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl group-hover:shadow-indigo-500/30 transition-all duration-300">
                        {job.company?.charAt(0) || "C"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-extrabold text-slate-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate flex items-center gap-1">
                          <Building2 className="w-3 h-3 shrink-0" />
                          {job.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {job.hasApplied && (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border shadow-sm bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 flex items-center gap-1">
                          <span className="text-[8px]">✓</span> Applied
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.preventDefault(); toggleBookmark(job._id); }}
                        disabled={bookmarkLoading[job._id]}
                        className={`p-1.5 rounded-lg border transition-all ${
                          savedJobIds.includes(job._id)
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-300 hover:text-indigo-500 hover:border-indigo-300 opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${savedJobIds.includes(job._id) ? 'fill-indigo-600' : ''} ${bookmarkLoading[job._id] ? 'animate-pulse' : ''}`} />
                      </button>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border shadow-sm ${expInfo.color}`}>
                        {expInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span className="truncate">{job.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span className="capitalize">{job.jobType?.replace('-', ' ') || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span>{timeAgo(job.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                        <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span>{hasSalary ? `${(job.salary.min / 1000).toFixed(0)}k–${(job.salary.max / 1000).toFixed(0)}k` : 'Negotiable'}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  {skillsPreview.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {skillsPreview.map((skill, si) => (
                        <span key={si} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-lg border border-slate-100 dark:border-slate-700 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-all">
                          {skill}
                        </span>
                      ))}
                      {job.skills?.length > 3 && (
                        <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400 text-[10px] font-bold rounded-lg border border-indigo-100 dark:border-indigo-800">
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Spacer */}
                  <div className="flex-1"></div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        {appCount > 0 ? (
                          <>
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-[7px] font-bold text-white shadow-sm">
                                {String.fromCharCode(64 + i)}
                              </div>
                            ))}
                            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-500 flex items-center justify-center text-[7px] font-bold text-white shadow-sm">
                              {appCount > 3 ? `+${appCount - 3}` : appCount}
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-300 dark:text-slate-600">
                            <Users className="w-3 h-3" />
                            No applicants yet
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        {appCount > 0 && `${appCount} applied`}
                      </span>
                    </div>
                    <Link
                      href={`/dashboard/explore-jobs/${job._id}`}
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all group/link bg-indigo-50 dark:bg-indigo-900/20 px-3.5 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                    >
                      Explore Now
                      <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Bottom gradient glow */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-full blur-xl group-hover:scale-[2] transition-transform duration-500 ease-out pointer-events-none"></div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
