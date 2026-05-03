"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import useJobStore from "@/store/jobStore";
import { 
  MapPin, Briefcase, Clock, DollarSign, 
  ChevronLeft, Building2, Globe, Users, 
  Calendar, CheckCircle2, ShieldCheck, ArrowRight
} from "lucide-react";

import JobApplicationModal from "@/components/recruiter/JobApplicationModal";

export default function JobDetailsPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { fetchJobById, applyToJob, loading } = useJobStore();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadJob = async () => {
      const res = await fetchJobById(resolvedParams.id);
      if (res.success) {
        setJob(res.job);
      } else {
        setError(res.error);
      }
    };
    loadJob();
  }, [resolvedParams.id, fetchJobById]);

  const handleModalSubmit = async (formData) => {
    setMessage(null);
    const res = await applyToJob(job._id, formData);
    
    if (res.success) {
      setApplied(true);
      setShowApplyModal(false);
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to submit application' });
      // Keep modal open so user can fix issues
      setShowApplyModal(false); // Actually, maybe close it and show error on page
    }
  };

  if (loading && !job) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-sm">
        <p className="text-red-500 font-bold mb-4">⚠️ {error}</p>
        <button onClick={() => router.back()} className="text-indigo-600 font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all">
          <ChevronLeft className="w-5 h-5" /> Back to listings
        </button>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* ─── NAVIGATION ─── */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-colors group"
      >
        <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:border-indigo-200 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </div>
        Back to Explore
      </button>

      {/* ─── HEADER SECTION ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-10 border border-slate-100 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-indigo-500/20">
            {job.company?.charAt(0) || "C"}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-wider rounded-full border border-indigo-100 dark:border-indigo-800">
                {job.jobType?.replace('-', ' ')}
              </span>
              <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-extrabold uppercase tracking-wider rounded-full border border-purple-100 dark:border-purple-800">
                {job.experienceLevel} Level
              </span>
              {job.status === 'active' && (
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider rounded-full border border-emerald-100 dark:border-emerald-800 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  Accepting Apps
                </span>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white mb-2 leading-tight">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2 font-semibold">
                <Building2 className="w-4 h-4 text-indigo-500" />
                {job.company}
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <MapPin className="w-4 h-4 text-indigo-500" />
                {job.location}
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <button 
              disabled={applied}
              onClick={() => setShowApplyModal(true)}
              className={`w-full lg:w-auto px-10 py-4 rounded-2xl font-black text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2 ${
                applied 
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200 cursor-default shadow-emerald-500/10'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-indigo-500/25'
              }`}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Application Sent
                </>
              ) : (
                <>
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            {message && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center mt-3 text-xs font-bold ${message.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}
              >
                {message.text}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── LEFT COLUMN: DETAILS ─── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Description */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3 relative z-10">
              <div className="w-2 h-8 bg-indigo-600 rounded-full transition-all group-hover:h-10"></div>
              Job Description
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line relative z-10">
              {job.description}
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          </div>

          {/* Requirements */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm group">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-violet-600 rounded-full transition-all group-hover:h-10"></div>
              Key Requirements
            </h2>
            <ul className="space-y-4">
              {job.requirements?.map((req, i) => (
                <li key={i} className="flex items-start gap-4 text-slate-600 dark:text-slate-400">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm group">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-emerald-500 rounded-full transition-all group-hover:h-10"></div>
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {job.skills?.map((skill, i) => (
                <span key={i} className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: INFO CARDS ─── */}
        <div className="space-y-6">
          {/* Job Overview */}
          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
            <h3 className="text-lg font-bold mb-6 relative z-10">Job Overview</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-indigo-200 font-bold uppercase tracking-wider">Salary Range</p>
                  <p className="font-bold">{job.salary?.min / 1000}k - {job.salary?.max / 1000}k {job.salary?.currency}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-indigo-200 font-bold uppercase tracking-wider">Posted Date</p>
                  <p className="font-bold">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-indigo-200 font-bold uppercase tracking-wider">Deadline</p>
                  <p className="font-bold">{new Date(job.applicationDeadline).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-indigo-200 font-bold uppercase tracking-wider">Applications</p>
                  <p className="font-bold">{job.applicationsCount || 0} candidates</p>
                </div>
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          </div>

          {/* Safety & Verification */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white">SmartHire Verified</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              This job listing has been verified by our AI safety system to ensure legitimacy and professional standards.
            </p>
          </div>
        </div>
      </div>

      {/* ─── MODALS ─── */}
      <JobApplicationModal 
        job={job}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
