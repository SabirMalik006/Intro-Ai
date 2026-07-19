"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Mail, Phone, FileText, Download, 
  ExternalLink, User, Calendar, CheckCircle2, 
  Award, Briefcase, ChevronRight, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import useJobStore from "@/store/jobStore";
import JobPostForm from "@/components/recruiter/JobPostForm";

// =============================================
// APPLICANT DETAILS MODAL
// =============================================
function ApplicantDetailsModal({ applicant, isOpen, onClose, onStatusChange, onAssignInterview, interviewReport, showReportOnly, updatingAppId }) {
  const [showReport, setShowReport] = useState(showReportOnly || false);
  const report = interviewReport || applicant._interviewReport;
  if (!isOpen || !applicant) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-start justify-between bg-slate-50/30 dark:bg-slate-900/50">
          <div className="flex gap-5 items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-500/20">
              {applicant.fullName?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{applicant.fullName || "Unnamed Candidate"}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
                  {applicant.score || 0}% AI Match
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-4 group hover:border-indigo-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-indigo-500">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{applicant.email || "No email provided"}</p>
              </div>
            </div>
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-4 group hover:border-indigo-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-violet-500">
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{applicant.phone || "No phone provided"}</p>
              </div>
            </div>
          </div>

          {/* Resume Card */}
          <div className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-lg">Candidate Resume</h4>
                  <p className="text-xs text-indigo-100 font-bold">Curriculum Vitae • PDF / DOC</p>
                </div>
              </div>
              <a 
                href={applicant.resumeUrl ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/${applicant.resumeUrl}` : "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-indigo-600 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-lg active:scale-95"
              >
                <Download className="w-4 h-4" />
                View Resume
              </a>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              Cover Letter
            </h3>
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
              {applicant.coverLetter || "No cover letter provided by the candidate."}
            </div>
          </div>

          {/* Interview Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Interview</h3>

            {!showReport ? (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onAssignInterview(applicant._id)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-black transition-all border-2 active:scale-95 bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 flex items-center gap-2"
                >
                  🎤 Assign AI Interview
                </button>
                {report && (
                  <button
                    onClick={() => setShowReport(true)}
                    className="px-5 py-2.5 rounded-2xl text-xs font-black transition-all border-2 active:scale-95 bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 flex items-center gap-2"
                  >
                    📋 View Report
                  </button>
                )}
              </div>
            ) : report ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-slate-800 dark:text-white">Interview Report</h4>
                  <button onClick={() => setShowReport(false)} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Close</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Overall Score', value: `${report.overallScore || report.score}%`, color: 'indigo' },
                    { label: 'Recommendation', value: report.recommendation || 'Consider', color: report.recommendation === 'Strong Hire' ? 'emerald' : report.recommendation === 'Hire' ? 'blue' : report.recommendation === 'Consider' ? 'amber' : 'red' },
                    { label: 'Questions', value: report.totalQuestions || report.detailedFeedback?.length || '—', color: 'violet' },
                    { label: 'Completed', value: report.completedAt ? new Date(report.completedAt).toLocaleDateString() : '—', color: 'teal' },
                  ].map((stat, i) => (
                    <div key={i} className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 border border-${stat.color}-200 dark:border-${stat.color}-800 text-center`}>
                      <div className={`text-lg font-extrabold text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.value}</div>
                      <p className={`text-[10px] font-bold text-${stat.color}-500 dark:text-${stat.color}-400 mt-0.5`}>{stat.label}</p>
                    </div>
                  ))}
                </div>

                {report.summary && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Summary</p>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{report.summary}</p>
                  </div>
                )}

                {report.strengths?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-emerald-600 mb-2 uppercase tracking-wider">Strengths</p>
                    <div className="flex flex-wrap gap-1.5">
                      {report.strengths.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800">✅ {s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {report.areasForImprovement?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-amber-600 mb-2 uppercase tracking-wider">Areas to Improve</p>
                    <div className="flex flex-wrap gap-1.5">
                      {report.areasForImprovement.map((a, i) => (
                        <span key={i} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg border border-amber-200 dark:border-amber-800">💪 {a}</span>
                      ))}
                    </div>
                  </div>
                )}

                {report.detailedFeedback?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Question Feedback</p>
                    <div className="space-y-2">
                      {report.detailedFeedback.map((f, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700">
                          <p className="text-xs font-bold text-indigo-600 mb-0.5">Q{f.questionNumber || i + 1}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{f.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No interview report available yet.</p>
            )}
          </div>

          {/* Status Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-5">Decision & Pipeline</h3>
            <div className="flex flex-wrap gap-2">
              {['screened', 'interviewed', 'offered', 'hired', 'rejected'].map(status => (
                <button
                  key={status}
                  disabled={updatingAppId}
                  onClick={() => onStatusChange(applicant._id, status)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all border-2 active:scale-95 ${
                    applicant.status === status
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${applicant.status === 'hired' ? 'bg-emerald-500' : applicant.status === 'rejected' ? 'bg-red-500' : 'bg-indigo-500'}`}></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Current Status: {applicant.status}</span>
          </div>
          <button onClick={onClose} className="text-sm font-black text-indigo-600 hover:text-indigo-700">Close Profile</button>
        </div>
      </motion.div>
    </div>
  );
}

// =============================================
// DONUT CHART - Fixed Alignment
// =============================================
function DonutChart({ data, size = 170, strokeWidth = 26, centerLabel = "" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  let offset = 0;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90 absolute inset-0">
          {data.map((item, i) => {
            const percentage = (item.value / total) * 100;
            const dashArray = (percentage / 100) * circumference;
            const currentOffset = offset;
            offset += dashArray;
            return (
              <motion.circle
                key={i}
                cx={size / 2} cy={size / 2} r={radius}
                fill="transparent" stroke={item.color} strokeWidth={strokeWidth}
                strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                strokeDashoffset={-currentOffset}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: -currentOffset }}
                transition={{ duration: 1.5, delay: i * 0.2, ease: "easeInOut" }}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-none">{total}</span>
          <span className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-center leading-tight px-2">{centerLabel}</span>
        </div>
      </div>
      <div className="w-full mt-4 space-y-1.5">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs lg:text-sm">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-gray-600 dark:text-gray-400 truncate">{item.label || item.name}</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white ml-2 flex-shrink-0">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================
// CIRCULAR PROGRESS
// =============================================
function CircularProgress({ value, max, color, label, delay = 0 }) {
  const size = 90;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / max) * 100;
  const dashArray = (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center gap-2.5 w-full"
    >
      <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent"
            stroke="currentColor" strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-gray-700/50" />
          <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="transparent"
            stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={`${dashArray} ${circumference - dashArray}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - dashArray }}
            transition={{ duration: 1.5, delay, ease: "easeInOut" }}
            strokeLinecap="round" />
        </svg>
        <span className="absolute text-base lg:text-lg font-bold text-gray-900 dark:text-white">{Math.round(value)}%</span>
      </div>
      <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 text-center leading-tight max-w-[95px]">
        {label}
      </p>
    </motion.div>
  );
}

// =============================================
// STAT CARD
// =============================================
function StatCard({ icon, label, value, trend, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 rounded-2xl p-4 lg:p-5 hover:shadow-xl dark:hover:shadow-slate-900/40 hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: `${color}18` }}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </motion.div>
  );
}

// =============================================
// JOB CARD
// =============================================
function JobCard({ job, index, onDelete, onEdit, onUpdateApplicationStatus, onViewApplicant, onAssignInterview, assigningId }) {
  const [expanded, setExpanded] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState(null);

  const colors = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];
  const bgColor = colors[index % colors.length];

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingAppId(appId);
    await onUpdateApplicationStatus(job._id, appId, { status: newStatus });
    setUpdatingAppId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 rounded-2xl hover:shadow-xl dark:hover:shadow-slate-900/40 transition-all duration-300 overflow-hidden"
    >
      <div className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex items-start gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ backgroundColor: bgColor }}>
              {job.title.match(/\b(\w)/g)?.join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white truncate">{job.title}</h3>
              <p className="text-xs text-gray-500 mb-2">{job.company}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-[10px] font-medium uppercase">{job.jobType}</span>
                <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-[10px] font-medium uppercase">{job.experienceLevel}</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-[10px] font-medium">📍 {job.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:gap-6 flex-wrap lg:flex-nowrap">
            <div className="text-center px-2 border-r border-gray-100 dark:border-slate-700"><p className="text-lg font-bold text-gray-900 dark:text-white">{job.applicationsCount || 0}</p><p className="text-[10px] text-gray-500 dark:text-gray-400">Apps</p></div>
            <div className="text-center px-2 border-r border-gray-100 dark:border-slate-700"><p className="text-lg font-bold text-gray-900 dark:text-white">{job.views || 0}</p><p className="text-[10px] text-gray-500 dark:text-gray-400">Views</p></div>
            
            <div className="flex flex-col items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${job.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : job.status === 'draft' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                {job.status}
              </span>
              <p className="text-[10px] text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center gap-2 ml-auto lg:ml-4">
              <button onClick={() => onEdit(job)} className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
              </button>
              <button onClick={() => setShowConfirmDelete(true)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
              {(job.applications?.length > 0) && (
                <button onClick={() => setExpanded(!expanded)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white flex items-center gap-1">
                  <span className="text-[10px] font-bold uppercase">{expanded ? "Close" : "View Applicants"}</span>
                  <motion.svg animate={{ rotate: expanded ? 180 : 0 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">Are you sure you want to delete this job listing?</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setShowConfirmDelete(false)} className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700">Cancel</button>
                <button onClick={() => { onDelete(job._id); setShowConfirmDelete(false); }} className="px-5 py-2 bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-500/30">Delete Permanently</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && job.applications?.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-900/50 px-4 lg:px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">👥 All Applicants ({job.applications.length})</h4>
            </div>
            <div className="space-y-3">
              {job.applications.map((app, i) => (
                <div key={i} className="group/app flex items-center justify-between py-3 px-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
                  <div 
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => onViewApplicant(app)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm group-hover/app:scale-110 transition-transform">
                      {app.fullName?.split(" ").map(n => n[0]).join("") || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white group-hover/app:text-indigo-600 transition-colors">{app.fullName}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{app.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{app.score || 0}% Match</p>
                      <p className="text-[10px] text-gray-400">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>

                    <div className="relative">
                      <select 
                        value={app.status}
                        disabled={updatingAppId === app._id}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border appearance-none pr-8 outline-none transition-all ${
                          updatingAppId === app._id ? 'opacity-50 grayscale' : ''
                        } ${
                          app.status === 'hired' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          app.status === 'offered' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {['applied', 'screened', 'interviewed', 'offered', 'hired', 'rejected'].map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-3 h-3 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onAssignInterview(job._id, app.candidate?._id || app.candidate || app._id, app)}
                      disabled={assigningId === (app.candidate?._id || app.candidate || app._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all disabled:opacity-50"
                      title="Assign AI Interview"
                    >
                      {assigningId === (app.candidate || app._id) ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v3m0 0h3m-3 0H9" /></svg>
                      )}
                    </button>
                    <button 
                      onClick={() => onViewApplicant(app)}
                      className="p-1.5 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// =============================================
// MAIN PAGE
// =============================================
export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPostJob, setShowPostJob] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const [assigningId, setAssigningId] = useState(null);
  const [interviewReports, setInterviewReports] = useState({});
  
  const { 
    jobs, loading, error, analytics, 
    fetchMyJobs, fetchAnalytics, createJob, updateJob, deleteJob, updateApplicationStatus,
    assignInterview
  } = useJobStore();

  useEffect(() => {
    fetchMyJobs();
    fetchAnalytics();
  }, [fetchMyJobs, fetchAnalytics]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleViewApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicantModal(true);
  };

  const handleAssignInterview = async (jobId, candidateId, app) => {
    setAssigningId(candidateId || app._id);
    const res = await assignInterview(jobId, candidateId || app.candidate);
    setAssigningId(null);
    if (res.success) {
      showNotification('AI Interview assigned successfully! 🎤');
      fetchAnalytics();
    } else {
      showNotification(res.message || 'Failed to assign interview', 'error');
    }
  };

  const handleViewInterviewReport = (applicant) => {
    setSelectedApplicant({ ...applicant, _interviewReport: interviewReports[applicant._id] });
    setShowApplicantModal(true);
  };

  const handleCreateOrUpdate = async (data) => {
    let res;
    if (editingJob) {
      res = await updateJob(editingJob._id, data);
      if (res.success) showNotification('Job updated successfully!');
    } else {
      res = await createJob(data);
      if (res.success) showNotification('Job posted successfully!');
    }
    
    if (res.success) {
      setShowPostJob(false);
      setEditingJob(null);
      fetchAnalytics(); // Refresh analytics after change
    } else {
      showNotification(res.error || 'Operation failed', 'error');
    }
  };

  const handleDeleteJob = async (id) => {
    const res = await deleteJob(id);
    if (res.success) {
      showNotification('Job deleted successfully!');
      fetchAnalytics(); // Refresh analytics after delete
    } else {
      showNotification(res.error || 'Failed to delete job', 'error');
    }
  };

  const handleUpdateApplicationStatus = async (jobId, appId, data) => {
    const res = await updateApplicationStatus(jobId, appId, data);
    if (res.success) {
      showNotification('Application status updated!');
      fetchAnalytics(); // Refresh analytics to update stats
    } else {
      showNotification(res.error || 'Failed to update status', 'error');
    }
  };

  const handleEdit = (job) => {
    // Format date for the input field (YYYY-MM-DD)
    const formattedJob = { ...job };
    if (job.applicationDeadline) {
      formattedJob.applicationDeadline = new Date(job.applicationDeadline).toISOString().split('T')[0];
    }
    setEditingJob(formattedJob);
    setShowPostJob(true);
  };

  const activeJobs = jobs.filter(j => j.status === "active");
  const closedJobs = jobs.filter(j => j.status === "closed");
  const draftJobs = jobs.filter(j => j.status === "draft");

  // Chart data formatting
  const pipelineStages = analytics ? [
    { label: "Applied", value: analytics.totalApplications, color: "#6366f1" },
    { label: "Active Jobs", value: analytics.activeJobs, color: "#10b981" },
    { label: "Closed Jobs", value: analytics.closedJobs, color: "#ef4444" },
  ] : [];

  const jobTypeData = analytics ? Object.entries(analytics.jobTypeStats).map(([key, value], index) => ({
    label: key.replace('-', ' '),
    value,
    color: ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"][index % 5]
  })) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-slate-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* ─── HEADER ─── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
          <div>
            <div className="flex items-center gap-2 lg:gap-3 mb-1 lg:mb-2">
              <span className="text-2xl lg:text-3xl">👔</span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Recruiter Dashboard</h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-0 sm:ml-10 lg:ml-12">Post jobs, track applications & manage your hiring pipeline</p>
          </div>
          <div className="flex gap-2 lg:gap-3 w-full sm:w-auto">
            <Link href="/dashboard" className="flex-1 sm:flex-none justify-center px-3 lg:px-4 py-2 lg:py-2.5 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 text-xs lg:text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Back
            </Link>
            <button onClick={() => { setEditingJob(null); setShowPostJob(true); }} className="flex-1 sm:flex-none justify-center px-4 lg:px-5 py-2 lg:py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center gap-2 font-semibold text-xs lg:text-sm shadow-lg shadow-indigo-500/25">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Post New Job
            </button>
          </div>
        </div>

        {/* ─── TABS ─── */}
        <div className="flex gap-1.5 lg:gap-2 mb-6 lg:mb-8 bg-white dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/30 rounded-2xl p-1 lg:p-1.5 inline-flex backdrop-blur overflow-x-auto w-full sm:w-auto">
          {[
            { id: "overview", label: "📊 Analytics" }, 
            { id: "active", label: `🟢 Active (${activeJobs.length})` }, 
            { id: "draft", label: `📝 Drafts (${draftJobs.length})` },
            { id: "closed", label: `🔒 Closed (${closedJobs.length})` }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 sm:flex-none px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl font-medium transition-all text-xs lg:text-sm whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading / Error States */}
        {loading && jobs.length === 0 && (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex justify-between items-center">
            <p className="text-sm">⚠️ {error}</p>
            <button onClick={() => fetchMyJobs()} className="text-xs font-bold underline">Retry</button>
          </div>
        )}

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === "overview" && analytics && (
          <div className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <StatCard icon="📋" label="Total Jobs" value={analytics.totalJobs} trend="+5%" color="#6366f1" delay={0.1} />
              <StatCard icon="👥" label="Applications" value={analytics.totalApplications} trend="+12%" color="#8b5cf6" delay={0.15} />
              <StatCard icon="🟢" label="Active Jobs" value={analytics.activeJobs} color="#10b981" delay={0.2} />
              <StatCard icon="👁️" label="Total Views" value={analytics.totalViews} trend="+18%" color="#f59e0b" delay={0.25} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 rounded-2xl p-4 lg:p-6">
                <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white mb-4 lg:mb-6">📊 Pipeline Overview</h3>
                {pipelineStages.length > 0 && <DonutChart data={pipelineStages} centerLabel="Hiring Overview" size={180} strokeWidth={28} />}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 rounded-2xl p-4 lg:p-6">
                <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white mb-4 lg:mb-6">💼 By Job Type</h3>
                {jobTypeData.length > 0 ? (
                  <DonutChart data={jobTypeData} centerLabel="Job Types" size={180} strokeWidth={28} />
                ) : (
                  <div className="h-[180px] flex items-center justify-center text-xs text-gray-400">No data available</div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 rounded-2xl p-4 lg:p-6">
                <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white mb-5 lg:mb-7">🎯 Key Performance</h3>
                <div className="grid grid-cols-2 gap-4 lg:gap-6 place-items-center">
                  <CircularProgress value={analytics.totalApplications > 0 ? (analytics.activeJobs / analytics.totalJobs) * 100 : 0} max={100} color="#6366f1" label="Active Rate" delay={0.6} />
                  <CircularProgress value={analytics.totalViews > 0 ? (analytics.totalApplications / analytics.totalViews) * 100 : 0} max={100} color="#10b981" label="Conv. Rate" delay={0.7} />
                  <CircularProgress value={75} max={100} color="#f59e0b" label="Retention" delay={0.8} />
                  <CircularProgress value={92} max={100} color="#8b5cf6" label="Uptime" delay={0.9} />
                </div>
              </motion.div>
            </div>

            {/* Recent Candidates List */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 rounded-2xl p-4 lg:p-6">
              <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4">⭐ Recent Applicants</h3>
              <div className="space-y-3">
                {analytics.recentApplications.length > 0 ? analytics.recentApplications.map((app, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 hover:border-indigo-200 cursor-pointer transition-all group/app"
                    onClick={() => handleViewApplicant(app)}
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs group-hover/app:scale-110 transition-transform">
                      {app.fullName?.split(" ").map(n => n[0]).join("") || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover/app:text-indigo-600 transition-colors">{app.fullName || app.candidate?.fullName}</p>
                      <p className="text-[10px] text-gray-500 truncate">Applied for: <span className="font-medium text-indigo-600">{app.jobTitle}</span></p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">{new Date(app.appliedAt).toLocaleDateString()}</span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase">{app.status}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-center py-8 text-sm text-gray-400">No recent applications yet.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* ─── JOB LIST TABS ─── */}
        {(activeTab !== "overview") && (
          <div className="space-y-3 lg:space-y-4">
            {(activeTab === "active" ? activeJobs : activeTab === "draft" ? draftJobs : closedJobs).map((job, i) => (
              <JobCard 
                key={job._id} 
                job={job} 
                index={i} 
                onDelete={handleDeleteJob}
                onEdit={handleEdit}
                onUpdateApplicationStatus={handleUpdateApplicationStatus}
                onViewApplicant={handleViewApplicant}
                onAssignInterview={handleAssignInterview}
                assigningId={assigningId}
              />
            ))}
            {(activeTab === "active" ? activeJobs : activeTab === "draft" ? draftJobs : closedJobs).length === 0 && !loading && (
              <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
                <span className="text-5xl lg:text-6xl mb-4 block opacity-50">📭</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No {activeTab} jobs found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ready to hire? Post your first job listing today!</p>
                <button onClick={() => { setEditingJob(null); setShowPostJob(true); }} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20">Post a Job</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── NOTIFICATION ─── */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
              notification.type === 'error' 
                ? 'bg-red-500/90 text-white border-red-400' 
                : 'bg-emerald-600/90 text-white border-emerald-400'
            }`}
          >
            <span className="text-lg">{notification.type === 'error' ? '⚠️' : '✅'}</span>
            <span className="font-bold text-sm tracking-wide">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── POST JOB MODAL ─── */}
      <AnimatePresence>
        {showPostJob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
              <JobPostForm 
                onSubmit={handleCreateOrUpdate}
                onCancel={() => { setShowPostJob(false); setEditingJob(null); }}
                initialData={editingJob}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── APPLICANT DETAILS MODAL ─── */}
      <AnimatePresence>
        {showApplicantModal && (
          <ApplicantDetailsModal 
            applicant={selectedApplicant}
            isOpen={showApplicantModal}
            onClose={() => { setShowApplicantModal(false); setSelectedApplicant(null); }}
            onStatusChange={(appId, newStatus) => {
              handleUpdateApplicationStatus(selectedApplicant.jobId || selectedApplicant.job, appId, { status: newStatus });
              setSelectedApplicant(prev => ({ ...prev, status: newStatus }));
            }}
            onAssignInterview={(appId) => handleAssignInterview(selectedApplicant.jobId || selectedApplicant.job, (selectedApplicant.candidate?._id || selectedApplicant.candidate || appId), selectedApplicant)}
            interviewReport={interviewReports[selectedApplicant?._id]}
          />
        )}
      </AnimatePresence>
    </div>
  );
}