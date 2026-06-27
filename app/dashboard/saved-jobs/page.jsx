"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useJobStore from "@/store/jobStore";
import { useToast } from "@/components/Toast";
import { MapPin, Briefcase, Clock, DollarSign, ChevronRight, Building2, Bookmark, BookmarkX, Sparkles, ChevronLeft, ArrowLeft, Heart } from "lucide-react";

const jobTypeIcons = {
  "full-time": "💼", "part-time": "⏳", "remote": "🌍", "contract": "📄"
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

export default function SavedJobsPage() {
  const router = useRouter();
  const toast = useToast();
  const { savedJobIds, unsaveJob, fetchSavedJobs } = useJobStore();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

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

  return (
    <div className="min-h-screen pb-20 space-y-6">
      {/* ─── BACK BUTTON ─── */}
      <button
        onClick={() => router.back()}
        className="group inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:border-indigo-200 dark:group-hover:border-indigo-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back
      </button>

      {/* ─── HERO HEADER ─── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 lg:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Your collection
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold mb-1">Saved Jobs</h1>
            <p className="text-indigo-200 text-sm font-medium">
              {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved for later
            </p>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
            <Bookmark className="w-5 h-5 text-indigo-200" />
            <span className="text-2xl font-extrabold text-white">{savedJobs.length}</span>
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-60 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[1,2,3,4].map(j => <div key={j} className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>)}
              </div>
            </div>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 flex items-center justify-center text-4xl mb-5 shadow-inner">
            🔖
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No saved jobs yet</h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-6 max-w-sm text-center">Jobs you bookmark will appear here. Start exploring and save opportunities that interest you.</p>
          <Link
            href="/dashboard/explore-jobs"
            className="px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2.5 active:scale-[0.97]"
          >
            <Sparkles className="w-4 h-4" /> Explore Jobs
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Showing <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{savedJobs.length}</span> saved job{savedJobs.length !== 1 ? 's' : ''}
            </p>
            <Link
              href="/dashboard/explore-jobs"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Find more
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {savedJobs.map((job, index) => {
              const hasSalary = job.salary?.min && job.salary?.max;
              const skillsPreview = job.skills?.slice(0, 3) || [];

              return (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.1)] dark:hover:shadow-none hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  <div className="p-5 relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-extrabold shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          {job.company?.charAt(0) || "C"}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-extrabold text-slate-800 dark:text-white truncate group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {job.company}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnsave(job._id)}
                        disabled={removingId === job._id}
                        className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group/btn"
                      >
                        <Heart className={`w-4 h-4 fill-red-500 text-red-500 ${removingId === job._id ? 'animate-pulse' : ''}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 mb-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span className="truncate">{job.location || "Remote"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span className="capitalize">{job.jobType?.replace('-', ' ') || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span>{timeAgo(job.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                          <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span>{hasSalary ? `${(job.salary.min / 1000).toFixed(0)}k–${(job.salary.max / 1000).toFixed(0)}k` : 'Negotiable'}</span>
                      </div>
                    </div>

                    {skillsPreview.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {skillsPreview.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-lg border border-slate-100 dark:border-slate-700 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all">{s}</span>
                        ))}
                        {job.skills?.length > 3 && (
                          <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 text-[10px] font-bold rounded-lg">+{job.skills.length - 3}</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                        <span>{jobTypeIcons[job.jobType] || "💼"}</span>
                        <span className="capitalize">{job.experienceLevel}</span>
                      </span>
                      <Link
                        href={`/dashboard/explore-jobs/${job._id}`}
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all group/link bg-indigo-50 dark:bg-indigo-900/20 px-3.5 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                      >
                        View Details
                        <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-full blur-xl group-hover:scale-[2] transition-transform duration-500 ease-out pointer-events-none"></div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
