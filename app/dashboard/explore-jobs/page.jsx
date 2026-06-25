"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import useJobStore from "@/store/jobStore";
import { Search, MapPin, Briefcase, Clock, DollarSign, ChevronRight, Building2, Sparkles, SlidersHorizontal, X } from "lucide-react";

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

export default function ExploreJobsPage() {
  const { jobs, loading, error, fetchAllJobs } = useJobStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    jobType: "",
    experienceLevel: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);

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

  return (
    <div className="min-h-screen pb-20 space-y-8">
      {/* ─── HERO SECTION ─── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-8 lg:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400/10 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-5"
          >
            <div className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold text-indigo-200 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              {jobs.length} opportunities available
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
            <div key={i} className="h-[320px] bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-700"></div>
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

            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Top gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="p-5 relative z-10 flex flex-col h-full">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-extrabold shadow-md shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
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
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${expInfo.color}`}>
                        {expInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span className="truncate">{job.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span className="capitalize">{job.jobType?.replace('-', ' ') || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span>{timeAgo(job.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span>{hasSalary ? `${(job.salary.min / 1000).toFixed(0)}k–${(job.salary.max / 1000).toFixed(0)}k` : 'Negotiable'}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  {skillsPreview.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {skillsPreview.map((skill, si) => (
                        <span key={si} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-lg border border-slate-100 dark:border-slate-700">
                          {skill}
                        </span>
                      ))}
                      {job.skills?.length > 3 && (
                        <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400 text-[10px] font-bold rounded-lg">
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
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[7px] font-bold text-slate-400">
                            {i}
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        {job.applicantsCount || job.applicationsCount || 0} applied
                      </span>
                    </div>
                    <Link 
                      href={`/dashboard/explore-jobs/${job._id}`}
                      className="flex items-center gap-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all group/link"
                    >
                      View Details
                      <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Background hover effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-full group-hover:scale-[2] transition-transform duration-500 ease-out"></div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
