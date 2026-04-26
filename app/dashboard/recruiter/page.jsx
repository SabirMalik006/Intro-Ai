"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────
const initialJobs = [
    {
        id: 1, title: "Senior React Developer", department: "Engineering",
        type: "Full-time", location: "Remote", posted: "2026-04-20",
        applications: 47, viewed: 890, status: "active", color: "#6366f1",
        applicants: [
            { name: "Ahmed Khan", score: 94, stage: "Final Round" },
            { name: "Sarah Ali", score: 88, stage: "Technical" },
            { name: "Zainab Bibi", score: 85, stage: "Screening" },
        ],
    },
    {
        id: 2, title: "UX Designer", department: "Design",
        type: "Full-time", location: "Hybrid - Lahore", posted: "2026-04-18",
        applications: 32, viewed: 650, status: "active", color: "#8b5cf6",
        applicants: [
            { name: "Fatima Zahra", score: 91, stage: "Final Round" },
            { name: "Usman Tariq", score: 79, stage: "Screening" },
        ],
    },
    {
        id: 3, title: "Backend Engineer", department: "Engineering",
        type: "Full-time", location: "Remote", posted: "2026-04-15",
        applications: 28, viewed: 520, status: "active", color: "#10b981",
        applicants: [
            { name: "Bilal Hussain", score: 96, stage: "Offer Sent" },
            { name: "Ayesha Malik", score: 82, stage: "Technical" },
        ],
    },
    {
        id: 4, title: "Product Manager", department: "Product",
        type: "Full-time", location: "On-site - Karachi", posted: "2026-04-10",
        applications: 56, viewed: 1200, status: "closed", color: "#f59e0b", applicants: [],
    },
    {
        id: 5, title: "DevOps Engineer", department: "Engineering",
        type: "Full-time", location: "Remote", posted: "2026-04-05",
        applications: 19, viewed: 380, status: "closed", color: "#ef4444", applicants: [],
    },
];

const analyticsData = {
    totalJobsPosted: 12, totalApplications: 387, screenedCandidates: 145,
    interviewedCandidates: 68, hiredCandidates: 8, applicationGrowth: "+24%",
    pipelineStages: [
        { label: "Applied", value: 387, color: "#6366f1" },
        { label: "Screened", value: 145, color: "#8b5cf6" },
        { label: "Interviewed", value: 68, color: "#f59e0b" },
        { label: "Offered", value: 15, color: "#10b981" },
        { label: "Hired", value: 8, color: "#06b6d4" },
    ],
    monthlyStats: [
        { month: "Jan", applications: 45, screened: 20, hired: 3 },
        { month: "Feb", applications: 52, screened: 25, hired: 4 },
        { month: "Mar", applications: 68, screened: 35, hired: 5 },
        { month: "Apr", applications: 87, screened: 42, hired: 6 },
        { month: "May", applications: 72, screened: 38, hired: 5 },
        { month: "Jun", applications: 63, screened: 30, hired: 8 },
    ],
    departmentStats: [
        { name: "Engineering", value: 45, color: "#6366f1" },
        { name: "Design", value: 20, color: "#8b5cf6" },
        { name: "Product", value: 15, color: "#10b981" },
        { name: "Marketing", value: 12, color: "#f59e0b" },
        { name: "Sales", value: 8, color: "#ef4444" },
    ],
    topCandidates: [
        { name: "Ahmed Khan", role: "Senior React Dev", score: 94, avatar: "AK" },
        { name: "Fatima Zahra", role: "UX Designer", score: 91, avatar: "FZ" },
        { name: "Bilal Hussain", role: "Backend Engineer", score: 96, avatar: "BH" },
    ],
};

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
            {/* Chart with centered label */}
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

            {/* Legend */}
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
// CIRCULAR PROGRESS - Fixed Alignment
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
                <span className="absolute text-base lg:text-lg font-bold text-gray-900 dark:text-white">{value}%</span>
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
function JobCard({ job, index }) {
    const [expanded, setExpanded] = useState(false);

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
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ backgroundColor: job.color }}>
                            {job.title.match(/\b(\w)/g)?.join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white truncate">{job.title}</h3>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-medium">{job.department}</span>
                                <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium">{job.type}</span>
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">📍 {job.location}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-6 flex-wrap">
                        <div className="text-center"><p className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">{job.applications}</p><p className="text-xs text-gray-500 dark:text-gray-400">Applied</p></div>
                        <div className="text-center"><p className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">{job.viewed}</p><p className="text-xs text-gray-500 dark:text-gray-400">Views</p></div>
                        <div className="text-center"><p className="text-xs text-gray-500 dark:text-gray-400">Posted</p><p className="text-sm font-medium text-gray-900 dark:text-white">{job.posted}</p></div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${job.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600'}`}>
                            {job.status === 'active' ? '🟢 Active' : '🔒 Closed'}
                        </span>
                        {job.applicants.length > 0 && (
                            <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                <motion.svg animate={{ rotate: expanded ? 180 : 0 }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </motion.svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {expanded && job.applicants.length > 0 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-900/50 px-4 lg:px-6 py-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">👥 Top Applicants</h4>
                        <div className="space-y-2">
                            {job.applicants.map((app, i) => (
                                <div key={i} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                            {app.name.split(" ").map(n => n[0]).join("")}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{app.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{app.stage}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{app.score}%</span>
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
    const [jobs] = useState(initialJobs);
    const [showPostJob, setShowPostJob] = useState(false);
    const [newJob, setNewJob] = useState({
        title: "", department: "", type: "Full-time", location: "",
        description: "", requirements: "", salary: "",
    });

    const handlePostJob = (e) => {
        e.preventDefault();
        setNewJob({ title: "", department: "", type: "Full-time", location: "", description: "", requirements: "", salary: "" });
        setShowPostJob(false);
    };

    const activeJobs = jobs.filter(j => j.status === "active");
    const closedJobs = jobs.filter(j => j.status === "closed");

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
                        <button onClick={() => setShowPostJob(true)} className="flex-1 sm:flex-none justify-center px-4 lg:px-5 py-2 lg:py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center gap-2 font-semibold text-xs lg:text-sm shadow-lg shadow-indigo-500/25">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            Post New Job
                        </button>
                    </div>
                </div>

                {/* ─── TABS ─── */}
                <div className="flex gap-1.5 lg:gap-2 mb-6 lg:mb-8 bg-white dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/30 rounded-2xl p-1 lg:p-1.5 inline-flex backdrop-blur overflow-x-auto w-full sm:w-auto">
                    {[{ id: "overview", label: "📊 Analytics" }, { id: "active", label: "🟢 Active" }, { id: "closed", label: "🔒 Closed" }].map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 sm:flex-none px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl font-medium transition-all text-xs lg:text-sm whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ─── OVERVIEW TAB ─── */}
                {activeTab === "overview" && (
                    <div className="space-y-4 lg:space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                            <StatCard icon="📋" label="Total Jobs" value={analyticsData.totalJobsPosted} trend={analyticsData.applicationGrowth} color="#6366f1" delay={0.1} />
                            <StatCard icon="👥" label="Applications" value={analyticsData.totalApplications} trend="+18%" color="#8b5cf6" delay={0.15} />
                            <StatCard icon="🎯" label="Screened" value={analyticsData.screenedCandidates} color="#10b981" delay={0.2} />
                            <StatCard icon="✅" label="Hired" value={analyticsData.hiredCandidates} trend="+2" color="#f59e0b" delay={0.25} />
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                            {/* Pipeline Donut */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 rounded-2xl p-4 lg:p-6">
                                <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white mb-4 lg:mb-6">📊 Hiring Pipeline</h3>
                                <DonutChart data={analyticsData.pipelineStages} centerLabel="Candidates" size={180} strokeWidth={28} />
                            </motion.div>

                            {/* Department Donut */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                className="bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 rounded-2xl p-4 lg:p-6">
                                <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white mb-4 lg:mb-6">🏢 By Department</h3>
                                <DonutChart data={analyticsData.departmentStats} centerLabel="Jobs" size={180} strokeWidth={28} />
                            </motion.div>

                            {/* Conversion Rates */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                className="bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 rounded-2xl p-4 lg:p-6">
                                <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white mb-5 lg:mb-7">🎯 Conversion Rates</h3>
                                <div className="grid grid-cols-2 gap-4 lg:gap-6 place-items-center">
                                    <CircularProgress value={37} max={100} color="#6366f1" label="App to Screen" delay={0.6} />
                                    <CircularProgress value={47} max={100} color="#10b981" label="Screen to Hire" delay={0.7} />
                                    <CircularProgress value={82} max={100} color="#f59e0b" label="Offer Accepted" delay={0.8} />
                                    <CircularProgress value={68} max={100} color="#8b5cf6" label="Satisfaction" delay={0.9} />
                                </div>
                            </motion.div>
                        </div>

                        {/* Top Candidates */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                            className="bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 rounded-2xl p-4 lg:p-6">
                            <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4">⭐ Top Performing Candidates</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                                {analyticsData.topCandidates.map((candidate, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border border-indigo-100 dark:border-indigo-800/30">
                                        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{candidate.avatar}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{candidate.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{candidate.role}</p>
                                        </div>
                                        <span className="text-base lg:text-lg font-bold text-indigo-600 dark:text-indigo-400">{candidate.score}%</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* ─── ACTIVE / CLOSED JOBS ─── */}
                {(activeTab === "active" || activeTab === "closed") && (
                    <div className="space-y-3 lg:space-y-4">
                        {(activeTab === "active" ? activeJobs : closedJobs).map((job, i) => (
                            <JobCard key={job.id} job={job} index={i} />
                        ))}
                        {(activeTab === "active" ? activeJobs : closedJobs).length === 0 && (
                            <div className="text-center py-16">
                                <span className="text-5xl lg:text-6xl mb-4 block">📭</span>
                                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2">No {activeTab} jobs</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Post a new job to get started!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ─── POST JOB MODAL ─── */}
            <AnimatePresence>
                {showPostJob && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPostJob(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-2xl w-full max-w-lg lg:max-w-2xl max-h-[85vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="p-5 lg:p-6 border-b border-gray-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 rounded-t-2xl z-10 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">📝 Post a New Job</h2>
                                    <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">Create a job listing to start receiving applications</p>
                                </div>
                                <button onClick={() => setShowPostJob(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                            </div>
                            <form onSubmit={handlePostJob} className="p-5 lg:p-6 space-y-4 lg:space-y-5">
                                <div className="grid grid-cols-1 gap-4 lg:gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title *</label>
                                        <input type="text" value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} placeholder="e.g., Senior React Developer" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                                            <select value={newJob.department} onChange={(e) => setNewJob({...newJob, department: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" required>
                                                <option value="">Select</option><option>Engineering</option><option>Design</option><option>Product</option><option>Marketing</option><option>Sales</option><option>HR</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Type</label>
                                            <select value={newJob.type} onChange={(e) => setNewJob({...newJob, type: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all">
                                                <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Freelance</option><option>Internship</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                                            <input type="text" value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} placeholder="e.g., Remote, Lahore" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salary Range</label>
                                            <input type="text" value={newJob.salary} onChange={(e) => setNewJob({...newJob, salary: e.target.value})} placeholder="e.g., $80k - $120k" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                        <textarea value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} rows={3} placeholder="Describe the role..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Requirements</label>
                                        <textarea value={newJob.requirements} onChange={(e) => setNewJob({...newJob, requirements: e.target.value})} rows={3} placeholder="List skills, experience..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none" required />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                                    <button type="button" onClick={() => setShowPostJob(false)} className="flex-1 px-6 py-3 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-medium text-sm">Cancel</button>
                                    <button type="submit" className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/25">🚀 Post Job</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}