"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, CheckCircle2, Clock, UserPlus, X, Mail, Phone, FileText, Download, ChevronRight, MessageSquare, Loader2 } from "lucide-react";
import useJobStore from "@/store/jobStore";

function ApplicantDetailsModal({ applicant, isOpen, onClose, onAssignInterview, assigningId }) {
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

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-indigo-500">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{applicant.email || "No email provided"}</p>
              </div>
            </div>
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-violet-500">
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{applicant.phone || "No phone provided"}</p>
              </div>
            </div>
          </div>

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
                href={applicant.resumeUrl ? `http://localhost:5000/${applicant.resumeUrl}` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3 bg-white text-indigo-600 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-lg active:scale-95 ${!applicant.resumeUrl ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <Download className="w-4 h-4" />
                View Resume
              </a>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              Cover Letter
            </h3>
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
              {applicant.coverLetter || "No cover letter provided by the candidate."}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Interview</h3>
            <button
              onClick={() => onAssignInterview(applicant)}
              disabled={assigningId === (applicant.candidate?._id || applicant.candidate || applicant._id)}
              className="px-5 py-2.5 rounded-2xl text-xs font-black transition-all border-2 active:scale-95 bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
            >
              {assigningId === (applicant.candidate?._id || applicant.candidate || applicant._id) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : "🎤"} Assign AI Interview
            </button>
          </div>
        </div>

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

export default function CandidatesPage() {
  const { jobs, loading, fetchMyJobs, assignInterview } = useJobStore();
  const [search, setSearch] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assigningId, setAssigningId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Extract all applicants across all jobs
  const allCandidates = useMemo(() => {
    const list = [];
    (jobs || []).forEach(job => {
      (job.applications || []).forEach(app => {
        list.push({
          ...app,
          jobTitle: job.title,
          jobId: job._id,
          candidateName: app.fullName || app.candidate?.fullName || 'Unknown',
          candidateEmail: app.email || app.candidate?.email || '',
        });
      });
    });
    return list.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  }, [jobs]);

  const filteredCandidates = allCandidates.filter(c =>
    c.candidateName.toLowerCase().includes(search.toLowerCase()) ||
    c.candidateEmail.toLowerCase().includes(search.toLowerCase()) ||
    c.jobTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = useMemo(() => ({
    total: allCandidates.length,
    hired: allCandidates.filter(c => c.status === 'hired').length,
    inProcess: allCandidates.filter(c => ['screened', 'interviewed', 'offered'].includes(c.status)).length,
    newThisMonth: allCandidates.filter(c => {
      const d = new Date(c.appliedAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
  }), [allCandidates]);

  const handleAssignInterview = async (applicant) => {
    const candidateId = applicant.candidate?._id || applicant.candidate || applicant._id;
    const jobId = applicant.jobId;
    if (!jobId || !candidateId) {
      showNotification('Missing job or candidate info', 'error');
      return;
    }
    setAssigningId(candidateId);
    const res = await assignInterview(jobId, candidateId);
    setAssigningId(null);
    showNotification(res.success ? 'AI Interview assigned successfully! 🎤' : (res.message || 'Failed'));
  };

  const getStatusColor = (status) => {
    const map = {
      hired: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
      rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      offered: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      interviewed: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800',
      screened: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
      applied: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
    };
    return map[status] || map.applied;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-blue-800 p-6 lg:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold text-teal-200 flex items-center gap-1.5">
              <Users className="w-3 h-3" /> Candidates
            </div>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-1">All Candidates</h1>
          <p className="text-teal-200 text-sm font-medium">
            Review applicants across all your job postings
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Users className="w-5 h-5" />, label: 'Total Candidates', value: stats.total, color: 'from-teal-500 to-emerald-600', bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400' },
          { icon: <CheckCircle2 className="w-5 h-5" />, label: 'Hired', value: stats.hired, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
          { icon: <Clock className="w-5 h-5" />, label: 'In Process', value: stats.inProcess, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
          { icon: <UserPlus className="w-5 h-5" />, label: 'New This Month', value: stats.newThisMonth, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center ${stat.text}`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-800 dark:text-white mb-0.5">{stat.value}</div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, or job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-sm"
          />
          <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-xs font-semibold text-slate-400">{filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Loading */}
      {loading && jobs.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
        </div>
      ) : allCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 flex items-center justify-center text-4xl mb-5 shadow-inner">👥</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No candidates yet</h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm text-center">Candidates who apply to your jobs will appear here.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Applied For</th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Applied</th>
                  <th className="px-6 py-4 text-right text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCandidates.map((candidate, i) => {
                  const candidateId = candidate.candidate?._id || candidate.candidate || candidate._id;
                  return (
                    <motion.tr
                      key={`${candidate._id}-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => { setSelectedApplicant(candidate); setShowModal(true); }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {candidate.candidateName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{candidate.candidateName}</p>
                            <p className="text-xs text-slate-400">{candidate.candidateEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{candidate.jobTitle || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{candidate.score || 0}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-400">{new Date(candidate.appliedAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleAssignInterview(candidate)}
                            disabled={assigningId === candidateId}
                            className="px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/40 disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {assigningId === candidateId ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : '🎤'} Assign Interview
                          </button>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notification */}
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
            <span className="font-bold text-sm tracking-wide">{notification.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Applicant Details Modal */}
      <AnimatePresence>
        {showModal && (
          <ApplicantDetailsModal
            applicant={selectedApplicant}
            isOpen={showModal}
            onClose={() => { setShowModal(false); setSelectedApplicant(null); }}
            onAssignInterview={handleAssignInterview}
            assigningId={assigningId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
