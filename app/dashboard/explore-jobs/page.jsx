"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import useJobStore from "@/store/jobStore";
import { Search, Filter, MapPin, Briefcase, Clock, DollarSign, ChevronRight, Star } from "lucide-react";

export default function ExploreJobsPage() {
  const { jobs, loading, error, fetchAllJobs } = useJobStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    jobType: "",
    experienceLevel: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAllJobs({ search: searchQuery, ...filters });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchAllJobs({ search: searchQuery, ...newFilters });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* ─── HERO SECTION ─── */}
      <div className="relative mb-8 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 lg:p-12 text-white shadow-2xl shadow-indigo-200 dark:shadow-none">
        <div className="relative z-10 max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-5xl font-extrabold mb-4 tracking-tight"
          >
            Find your dream job <br />
            <span className="text-indigo-200">anywhere, anytime.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-indigo-100 text-lg mb-8 max-w-xl leading-relaxed"
          >
            Browse through thousands of job opportunities from top recruiters and companies worldwide.
          </motion.p>

          {/* Search Bar */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-200" />
              <input 
                type="text" 
                placeholder="Search job titles, companies, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border-none focus:ring-2 focus:ring-white/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-indigo-200 outline-none transition-all"
              />
            </div>
            <button 
              type="submit"
              className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-all active:scale-95 shadow-lg"
            >
              Search Jobs
            </button>
          </motion.form>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* ─── FILTERS ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              showFilters ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-semibold">Filters</span>
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>

          {['full-time', 'part-time', 'remote', 'contract'].map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange('jobType', filters.jobType === type ? '' : type)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                filters.jobType === type 
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' 
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Showing <span className="text-indigo-600 dark:text-indigo-400 font-bold">{jobs.length}</span> jobs found
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 text-indigo-600 uppercase tracking-wider">Experience Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {['entry', 'mid', 'senior', 'lead'].map(level => (
                    <button
                      key={level}
                      onClick={() => handleFilterChange('experienceLevel', filters.experienceLevel === level ? '' : level)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        filters.experienceLevel === level 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 text-indigo-600 uppercase tracking-wider">Location Preference</label>
                <div className="flex flex-wrap gap-2">
                  {['Remote', 'On-site', 'Hybrid'].map(loc => (
                    <button key={loc} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end">
                <button 
                  onClick={() => { setFilters({ jobType: "", experienceLevel: "" }); fetchAllJobs(); }}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all font-bold text-sm"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-white dark:bg-slate-900 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-800"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-8 rounded-3xl text-center">
          <p className="text-red-600 dark:text-red-400 font-bold mb-4">⚠️ {error}</p>
          <button onClick={() => fetchAllJobs()} className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold">Retry Now</button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No jobs matched your criteria</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl font-bold shadow-inner group-hover:scale-110 transition-transform">
                    {job.company?.charAt(0) || "C"}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-emerald-100 dark:border-emerald-800">
                      Active
                    </span>
                    <button className="text-slate-300 hover:text-indigo-500 transition-colors">
                      <Star className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
                  {job.company}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    {job.jobType?.replace('-', ' ') || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                    {job.salary ? `${(job.salary.min || 0) / 1000}k - ${(job.salary.max || 0) / 1000}k ${job.salary.currency || 'PKR'}` : 'Not Specified'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[8px] font-bold">
                        {i}
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-600 flex items-center justify-center text-[8px] font-bold text-white">
                      +{job.applicationsCount || 0}
                    </div>
                  </div>
                  <Link 
                    href={`/dashboard/explore-jobs/${job._id}`}
                    className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-all"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
