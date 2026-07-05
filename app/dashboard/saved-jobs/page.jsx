"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useJobStore from "@/store/jobStore";
import { useToast } from "@/components/Toast";
import {
  MapPin, Briefcase, Clock, DollarSign, Building2, Bookmark,
  Sparkles, Trash2, ExternalLink, Search, Calendar, X,
  ChevronRight, LayoutGrid, List, Eye, Share2
} from "lucide-react";

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

const jobTypes = {
  "full-time": { icon: "💼", label: "Full-time" },
  "part-time": { icon: "⏳", label: "Part-time" },
  "remote": { icon: "🌍", label: "Remote" },
  "contract": { icon: "📄", label: "Contract" },
};

const expBadge = {
  entry: { label: "Entry", class: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  mid: { label: "Mid", class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  senior: { label: "Senior", class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  lead: { label: "Lead", class: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
};

export default function SavedJobsPage() {
  const router = useRouter();
  const toast = useToast();
  const { unsaveJob, fetchSavedJobs } = useJobStore();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [query, setQuery] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const jobs = await fetchSavedJobs();
      setSavedJobs(jobs || []);
      setLoading(false);
    };
    load();
  }, [fetchSavedJobs]);

  const handleUnsave = async (jobId) => {
    setRemovingId(jobId);
    const res = await unsaveJob(jobId);
    setRemovingId(null);
    if (res.success) {
      setSavedJobs(prev => prev.filter(j => j._id !== jobId));
      toast(res.message, 'success');
    } else {
      toast(res.message, 'error');
    }
  };

  const filtered = savedJobs.filter(job => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      job.title?.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q) ||
      job.skills?.some(s => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen pb-20">
      {/* ─── HERO ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8 mb-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/8 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03)_0%,transparent_60%)]" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold text-white/70 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Your personal collection
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-2">Saved Jobs</h1>
              <p className="text-white/60 text-sm max-w-lg">
                {savedJobs.length > 0
                  ? `You have ${savedJobs.length} saved job${savedJobs.length !== 1 ? 's' : ''} ready to review.`
                  : 'Save jobs you like and they will appear here.'}
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link
                href="/dashboard/explore-jobs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-sm font-bold rounded-xl border border-white/10 transition-all"
              >
                <Eye className="w-4 h-4" /> Browse Jobs
              </Link>
              {savedJobs.length > 0 && (
                <div className="flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <Bookmark className="w-5 h-5 text-teal-400" />
                  <span className="text-2xl font-extrabold text-white tabular-nums">{savedJobs.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          {savedJobs.length > 0 && (
            <div className="relative max-w-md mt-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Filter by title, company, or skill..."
                className="w-full pl-11 pr-10 py-3 text-sm rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 focus:outline-none transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── BODY ─── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-700/50 p-5 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 p-12 lg:p-16 text-center"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="w-28 h-28 mx-auto mb-6 rounded-[2rem] bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 flex items-center justify-center border border-slate-200/60 dark:border-white/5 shadow-inner">
              <span className="text-5xl">📌</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">No saved jobs yet</h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8">
              Start exploring and bookmark the opportunities that catch your eye. They will be waiting for you here.
            </p>
            <Link
              href="/dashboard/explore-jobs"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-extrabold rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all shadow-lg shadow-teal-500/25"
            >
              <Sparkles className="w-4 h-4" /> Discover Jobs
            </Link>
          </div>
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No results for &ldquo;{query}&rdquo;</h3>
          <p className="text-sm text-slate-400 mb-4">Try a different keyword or browse all saved jobs.</p>
          <button
            onClick={() => setQuery("")}
            className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Clear search
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              {filtered.length} saved job{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.map((job) => {
              const hasSalary = job.salary?.min && job.salary?.max;
              const skills = job.skills?.slice(0, 4) || [];
              const jt = jobTypes[job.jobType] || { icon: "💼", label: job.jobType };
              const exp = expBadge[job.experienceLevel] || expBadge.mid;
              const isRemoving = removingId === job._id;

              return (
                <motion.div
                  key={job._id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onMouseEnter={() => setHoveredId(job._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => router.push(`/dashboard/explore-jobs/${job._id}`)}
                  className={`relative bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isRemoving
                      ? "border-red-200 dark:border-red-900/50 opacity-60"
                      : hoveredId === job._id
                        ? "border-teal-200 dark:border-teal-800/60 shadow-xl shadow-teal-500/5 -translate-y-0.5"
                        : "border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* Left accent bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 to-emerald-500 transition-all duration-300 ${
                      hoveredId === job._id ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  <div className="p-5 lg:p-6 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                      {/* Company icon */}
                      <div className="shrink-0">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xl font-extrabold shadow-lg transition-all duration-300 ${
                            hoveredId === job._id ? "scale-110 -rotate-6 shadow-teal-500/30" : "shadow-teal-500/20"
                          }`}
                        >
                          {job.company?.charAt(0) || "C"}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                          <h3
                            className={`text-lg font-extrabold truncate transition-colors ${
                              hoveredId === job._id
                                ? "text-teal-600 dark:text-teal-400"
                                : "text-slate-800 dark:text-white"
                            }`}
                          >
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${exp.class}`}>
                              {exp.label}
                            </span>
                            <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600">{jt.icon} {jt.label}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{job.company}</span>
                          <span className="text-slate-300 dark:text-slate-600 mx-1.5">•</span>
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>{job.location || "Remote"}</span>
                          <span className="text-slate-300 dark:text-slate-600 mx-1.5">•</span>
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{timeAgo(job.createdAt)}</span>
                          {hasSalary && (
                            <>
                              <span className="text-slate-300 dark:text-slate-600 mx-1.5">•</span>
                              <DollarSign className="w-4 h-4 text-slate-400" />
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {job.salary.min.toLocaleString()} – {job.salary.max.toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Skills */}
                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {skills.map((s, i) => (
                              <span
                                key={i}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                                  hoveredId === job._id
                                    ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800"
                                    : "bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700"
                                }`}
                              >
                                {s}
                              </span>
                            ))}
                            {job.skills?.length > 4 && (
                              <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800">
                                +{job.skills.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 lg:flex-col">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(
                              `http://localhost:3000/dashboard/explore-jobs/${job._id}`
                            );
                            toast("Link copied to clipboard!", "success");
                          }}
                          className={`p-3 rounded-xl transition-all ${
                            hoveredId === job._id
                              ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400"
                          }`}
                          title="Share job"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/dashboard/explore-jobs/${job._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className={`p-3 rounded-xl transition-all ${
                            hoveredId === job._id
                              ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                          title="View details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnsave(job._id);
                          }}
                          disabled={isRemoving}
                          className={`p-3 rounded-xl transition-all ${
                            hoveredId === job._id
                              ? "bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 dark:hover:text-rose-400"
                          }`}
                          title="Remove from saved"
                        >
                          {isRemoving ? (
                            <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom glow on hover */}
                  <div
                    className={`absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-br from-teal-400/8 to-emerald-500/8 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${
                      hoveredId === job._id ? "scale-[2]" : "scale-100"
                    }`}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
