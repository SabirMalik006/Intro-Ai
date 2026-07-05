"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import useJobStore from "@/store/jobStore";
import { useToast } from "@/components/Toast";
import {
  MapPin, Briefcase, Clock, DollarSign,
  ChevronLeft, Building2, Calendar, CheckCircle2,
  ArrowRight, Send, BadgeCheck, Users, Bookmark,
  Share2, BarChart3, GraduationCap, Timer
} from "lucide-react";

import JobApplicationModal from "@/components/recruiter/JobApplicationModal";

const jobTypeMeta = {
  "full-time": { label: "Full Time", icon: "💼", color: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100" },
  "part-time": { label: "Part Time", icon: "⏳", color: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100" },
  "remote": { label: "Remote", icon: "🌍", color: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100" },
  "hybrid": { label: "Hybrid", icon: "🔄", color: "bg-violet-50 text-violet-700 border-violet-200 ring-violet-100" },
  "contract": { label: "Contract", icon: "📄", color: "bg-purple-50 text-purple-700 border-purple-200 ring-purple-100" },
};

const expMeta = {
  entry: { label: "Entry Level", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  mid: { label: "Mid Level", color: "bg-blue-50 text-blue-700 border-blue-200" },
  senior: { label: "Senior Level", color: "bg-purple-50 text-purple-700 border-purple-200" },
  lead: { label: "Lead Level", color: "bg-rose-50 text-rose-700 border-rose-200" },
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins + " minutes ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + " hours ago";
  const days = Math.floor(hrs / 24);
  if (days < 7) return days + " days ago";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function JobDetailsPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const toast = useToast();
  const { fetchJobById, applyToJob, saveJob, unsaveJob, fetchSavedJobs, savedJobIds, loading } = useJobStore();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

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

  const toggleBookmark = async () => {
    if (bookmarkLoading) return;
    setBookmarkLoading(true);
    const isSaved = savedJobIds.includes(resolvedParams.id);
    const res = isSaved ? await unsaveJob(resolvedParams.id) : await saveJob(resolvedParams.id);
    setBookmarkLoading(false);
    if (res.success) {
      toast(res.message, 'success');
    } else {
      toast(res.message, 'error');
    }
  };

  const handleModalSubmit = async (formData) => {
    setMessage(null);
    const res = await applyToJob(job._id, formData);
    if (res.success) {
      setApplied(true);
      setShowApplyModal(false);
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to submit application' });
      setShowApplyModal(false);
    }
  };

  if (loading && !job) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-5 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-3xl">⚠️</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Failed to load job</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
            <ChevronLeft className="w-4 h-4" /> Back to listings
          </button>
        </div>
      </div>
    );
  }

  if (!job) return null;

  const jt = jobTypeMeta[job.jobType] || jobTypeMeta["full-time"];
  const el = expMeta[job.experienceLevel] || expMeta.mid;

  const SidebarCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 transition-all hover:border-indigo-200 dark:hover:border-indigo-800">
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-500">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
        <p className="text-sm font-extrabold text-slate-800 dark:text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-28 lg:pb-20">
      {/* ─── BACK NAV ─── */}
      <button
        onClick={() => router.back()}
        className="group inline-flex items-center gap-2.5 text-sm font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:border-indigo-200 dark:group-hover:border-indigo-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-all">
          <ChevronLeft className="w-4 h-4" />
        </div>
        Back to all jobs
      </button>

      {/* ─── HEADER ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6"
      >
        <div className="relative p-6 lg:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-violet-500/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/3"></div>

          <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-start">
            {/* Company Logo */}
            <div className="w-16 h-16 lg:w-20 lg:h-20 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl lg:text-3xl font-extrabold shadow-xl shadow-indigo-500/20 ring-4 ring-white dark:ring-slate-800">
              {job.company?.charAt(0) || "C"}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider border ${jt.color}`}>
                  {jt.icon} {jt.label}
                </span>
                <span className={`px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider border ${el.color}`}>
                  {el.label}
                </span>
                {job.status === 'active' && (
                  <span className="px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Actively Hiring
                  </span>
                )}
              </div>

              <h1 className="text-2xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Building2 className="w-4 h-4 text-indigo-400" /> {job.company}
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <MapPin className="w-4 h-4 text-indigo-400" /> {job.location || "Remote"}
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <Calendar className="w-4 h-4 text-indigo-400" /> Posted {timeAgo(job.createdAt)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <button
                onClick={toggleBookmark}
                disabled={bookmarkLoading}
                className={`p-3.5 rounded-xl border-2 transition-all ${
                  savedJobIds.includes(resolvedParams.id)
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 hover:border-indigo-300'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${savedJobIds.includes(resolvedParams.id) ? 'fill-indigo-600' : ''} ${bookmarkLoading ? 'animate-pulse' : ''}`} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast("Link copied to clipboard!", "success");
                }}
                className="p-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                disabled={applied}
                onClick={() => setShowApplyModal(true)}
                className={`flex-1 lg:flex-none px-8 py-3.5 rounded-xl font-extrabold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                  applied
                    ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200 cursor-default shadow-emerald-500/10'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98] shadow-indigo-500/25'
                }`}
              >
                {applied ? (
                  <><CheckCircle2 className="w-5 h-5" /> Applied</>
                ) : (
                  <><Send className="w-4 h-4" /> Apply Now</>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 px-5 py-3.5 rounded-xl border font-bold text-sm flex items-center gap-3 ${
            message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${message.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
          {message.text}
        </motion.div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 lg:p-8"
          >
            <h2 className="text-lg font-black text-slate-800 dark:text-white mb-5 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full"></span>
              About this role
            </h2>
            <div className="text-slate-600 dark:text-slate-400 leading-[1.8] whitespace-pre-line text-[15px]">
              {job.description}
            </div>
          </motion.div>

          {/* Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 lg:p-8"
          >
            <h2 className="text-lg font-black text-slate-800 dark:text-white mb-5 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></span>
              Key Requirements
            </h2>
            <ul className="space-y-3">
              {job.requirements?.map((req, i) => (
                <li key={i} className="flex items-start gap-3.5 text-slate-600 dark:text-slate-400">
                  <div className="mt-0.5 shrink-0 w-6 h-6 rounded-lg bg-violet-50 dark:bg-violet-900/30 border border-violet-100 dark:border-violet-800 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-[15px] leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.11 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 lg:p-8"
          >
            <h2 className="text-lg font-black text-slate-800 dark:text-white mb-5 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {job.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-0.5 transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
              {(!job.skills || job.skills.length === 0) && (
                <p className="text-sm text-slate-400 dark:text-slate-500">No specific skills listed</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6"
          >
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Job Overview
            </h3>
            <div className="space-y-3">
              <SidebarCard
                icon={<DollarSign className="w-5 h-5" />}
                label="Salary Range"
                value={job.salary?.min ? `${(job.salary.min / 1000).toFixed(0)}k – ${(job.salary.max / 1000).toFixed(0)}k ${job.salary.currency || ''}` : 'Negotiable'}
              />
              <SidebarCard
                icon={<Timer className="w-5 h-5" />}
                label="Experience"
                value={el.label}
              />
              <SidebarCard
                icon={<Users className="w-5 h-5" />}
                label="Applicants"
                value={`${job.applicationsCount || 0} candidate${job.applicationsCount !== 1 ? 's' : ''}`}
              />
              <SidebarCard
                icon={<Calendar className="w-5 h-5" />}
                label="Deadline"
                value={job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : 'Open'}
              />
              <SidebarCard
                icon={<GraduationCap className="w-5 h-5" />}
                label="Department"
                value={job.department || 'General'}
              />
            </div>
          </motion.div>

          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl font-extrabold shadow-lg border border-white/10">
                  {job.company?.charAt(0) || "C"}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">{job.company}</h3>
                  <p className="text-indigo-200 text-xs font-semibold">Verified Employer</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 mb-4">
                <BadgeCheck className="w-4 h-4 text-emerald-300" />
                <span className="text-xs font-bold text-indigo-100">Trusted by SmartHire AI</span>
              </div>

              <p className="text-sm text-indigo-100 leading-relaxed">
                This job listing has been verified by our AI safety system to ensure legitimacy and professional standards.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6"
          >
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-3">Interested in this job?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Submit your application now. We'll review your profile and get back to you.
            </p>
            <button
              disabled={applied}
              onClick={() => setShowApplyModal(true)}
              className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
                applied
                  ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200 cursor-default'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98] shadow-lg shadow-indigo-500/20'
              }`}
            >
              {applied ? (
                <><CheckCircle2 className="w-4 h-4" /> Application Submitted</>
              ) : (
                <><ArrowRight className="w-4 h-4" /> Apply for this job</>
              )}
            </button>
          </motion.div>
        </div>
      </div>

      <JobApplicationModal
        job={job}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
