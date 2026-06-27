"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import useJobStore from "@/store/jobStore";
import { useToast } from "@/components/Toast";
import { MapPin, Briefcase, Clock, DollarSign, ChevronRight, Building2, Bookmark, BookmarkX, Sparkles } from "lucide-react";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white">Saved Jobs</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-sm text-slate-500">
          <Bookmark className="w-4 h-4 text-indigo-500" />
          <span className="font-bold text-indigo-600">{savedJobs.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-56 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-700"></div>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl mb-4">🔖</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No saved jobs yet</h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">Start exploring and bookmark jobs you're interested in.</p>
          <Link href="/dashboard/explore-jobs" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Explore Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {savedJobs.map((job, index) => {
            const hasSalary = job.salary?.min && job.salary?.max;
            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-extrabold shadow-md">
                        {job.company?.charAt(0) || "C"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-extrabold text-slate-800 dark:text-white truncate">{job.title}</h3>
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {job.company}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnsave(job._id)}
                      disabled={removingId === job._id}
                      className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <BookmarkX className={`w-4 h-4 ${removingId === job._id ? 'animate-pulse' : ''}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3 h-3 text-indigo-400" /> {job.location || "Remote"}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Briefcase className="w-3 h-3 text-indigo-400" /> {job.jobType?.replace('-', ' ') || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3 h-3 text-indigo-400" /> {timeAgo(job.createdAt)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <DollarSign className="w-3 h-3 text-indigo-400" /> {hasSalary ? `${(job.salary.min / 1000).toFixed(0)}k–${(job.salary.max / 1000).toFixed(0)}k` : 'Nego'}
                    </div>
                  </div>

                  {job.skills?.slice(0, 3).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.skills.slice(0, 3).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100 dark:border-slate-700">{s}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <span className="text-xs">{jobTypeIcons[job.jobType] || "💼"}</span>
                      {job.experienceLevel}
                    </span>
                    <Link
                      href={`/dashboard/explore-jobs/${job._id}`}
                      className="flex items-center gap-1 text-xs font-extrabold text-indigo-600 hover:text-indigo-700 transition-all group/link"
                    >
                      View Details
                      <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
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
