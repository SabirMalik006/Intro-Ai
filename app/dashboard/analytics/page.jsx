"use client";

import { useState, useEffect, useMemo } from "react";
import api from "@/services/api";
import useAuthStore from "@/store/authStore";
import {
  BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart
} from "recharts";
import {
  Users, FileText, Briefcase, Star,
  CheckCircle, ArrowUpRight
} from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm" style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}{p.name === 'Score' ? '%' : ''}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CHART_COLORS = ["#6366f1", "#14b8a6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function MetricCard({ icon, label, value, change, color }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border-2 ${color} shadow-sm`}>
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
            change.startsWith('+') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
            change.startsWith('-') ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800' :
            'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
          }`}>
            <ArrowUpRight className={`w-3 h-3 ${change.startsWith('-') ? 'rotate-90' : ''}`} />
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-0.5">{value ?? '—'}</div>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
    </div>
  );
}

function TrendChart({ data, label, color = "#6366f1" }) {
  const isEmpty = !data || data.length === 0;

  return (
    <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{label}</h3>
      <div className="h-72 mt-4">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <p className="text-slate-400 text-sm font-medium">No data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={3} fill={`url(#grad-${color.replace('#', '')})`} dot={{ fill: color, strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: color }} name="Value" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function BarChartCard({ data, label, color = "#6366f1", dataKey = "count", barKey = "name" }) {
  const isEmpty = !data || data.length === 0;

  return (
    <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{label}</h3>
      <div className="h-72 mt-4">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <p className="text-slate-400 text-sm font-medium">No data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey={barKey} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={dataKey} radius={[8, 8, 0, 0]} maxBarSize={50} name="Count">
                {data.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("6m");

  const role = (user?.role || '').toLowerCase().trim();
  const isRecruiter = role.includes('recruit') || role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/dashboard/stats');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load analytics');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // ─── Process data for recruiter ───
  const recruiterMetrics = useMemo(() => {
    if (!data?.stats || !isRecruiter) return null;
    const s = data.stats;
    return [
      { icon: <Briefcase className="w-5 h-5 text-indigo-600" />, label: "Active Jobs", value: s.activeJobs ?? 0, change: null, color: "bg-indigo-100 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400" },
      { icon: <FileText className="w-5 h-5 text-teal-600" />, label: "Total Applications", value: s.totalApplications ?? 0, change: null, color: "bg-teal-100 border-teal-200 text-teal-600 dark:bg-teal-900/20 dark:border-teal-800/50 dark:text-teal-400" },
      { icon: <Users className="w-5 h-5 text-amber-600" />, label: "Total Jobs Posted", value: s.totalJobs ?? 0, change: null, color: "bg-amber-100 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400" },
      { icon: <Star className="w-5 h-5 text-purple-600" />, label: "Avg Resume Score", value: s.avgScore ? `${s.avgScore}%` : '—', change: null, color: "bg-purple-100 border-purple-200 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800/50 dark:text-purple-400" },
    ];
  }, [data, isRecruiter]);

  const candidateMetrics = useMemo(() => {
    if (!data?.stats || isRecruiter) return null;
    const s = data.stats;
    return [
      { icon: <FileText className="w-5 h-5 text-indigo-600" />, label: "Resume Analyses", value: s.totalAnalyses ?? 0, change: null, color: "bg-indigo-100 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400" },
      { icon: <Briefcase className="w-5 h-5 text-teal-600" />, label: "Applications Sent", value: s.totalApplications ?? 0, change: null, color: "bg-teal-100 border-teal-200 text-teal-600 dark:bg-teal-900/20 dark:border-teal-800/50 dark:text-teal-400" },
      { icon: <Star className="w-5 h-5 text-amber-600" />, label: "Average Score", value: s.avgScore ? `${s.avgScore}%` : '—', change: s.avgScore ? (s.avgScore >= 70 ? '+high' : '+avg') : null, color: "bg-amber-100 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400" },
      { icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, label: "Completed Analyses", value: s.totalAnalyses ?? 0, change: null, color: "bg-emerald-100 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400" },
    ];
  }, [data, isRecruiter]);

  // ─── Recruiter Chart Data ───
  const jobsTrend = useMemo(() => {
    if (!data?.topJobs || !isRecruiter) return [];
    return data.topJobs.map(j => ({ name: j.title.length > 15 ? j.title.slice(0, 15) + '...' : j.title, count: j.applications }));
  }, [data, isRecruiter]);

  // ─── Candidate Chart Data ───
  const scoreTrend = useMemo(() => {
    if (!data?.performanceData || isRecruiter) return [];
    return data.performanceData.map(p => ({ label: p.month, value: p.score }));
  }, [data, isRecruiter]);

  const scoreDistribution = useMemo(() => {
    if (!data?.recentAnalyses || isRecruiter) return [];
    const ranges = [
      { name: "0-20", min: 0, max: 20, count: 0 },
      { name: "21-40", min: 21, max: 40, count: 0 },
      { name: "41-60", min: 41, max: 60, count: 0 },
      { name: "61-80", min: 61, max: 80, count: 0 },
      { name: "81-100", min: 81, max: 100, count: 0 },
    ];
    data.recentAnalyses.forEach(d => {
      const r = ranges.find(r => d.score >= r.min && d.score <= r.max);
      if (r) r.count++;
    });
    return ranges;
  }, [data, isRecruiter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-14 h-14 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-lg shadow-indigo-500/10" />
          <p className="text-slate-500 dark:text-slate-400 font-bold">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700 p-10 shadow-xl">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-200 dark:border-red-800/30">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Failed to load</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {isRecruiter ? '📈 Hiring Analytics' : '📊 My Analytics'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {isRecruiter ? 'Track your recruitment performance and pipeline' : 'Monitor your interview and resume progress'}
          </p>
        </div>
        <div className="flex gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {["1m", "3m", "6m", "1y"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                timeRange === range
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {range === "1m" ? "1 Month" : range === "3m" ? "3 Months" : range === "6m" ? "6 Months" : "1 Year"}
            </button>
          ))}
        </div>
      </div>

      {/* ─── METRICS — Recruiter ─── */}
      {isRecruiter && recruiterMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recruiterMetrics.map((m, i) => <MetricCard key={i} {...m} />)}
        </div>
      )}

      {/* ─── METRICS — Candidate ─── */}
      {!isRecruiter && candidateMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {candidateMetrics.map((m, i) => <MetricCard key={i} {...m} />)}
        </div>
      )}

      {/* ─── RECRUITER CHARTS ─── */}
      {isRecruiter && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendChart data={data?.performanceData?.map(p => ({ label: p.month, value: p.score })) || []} label="Resume Score Trend" color="#6366f1" />
            <BarChartCard data={jobsTrend} label="Top Jobs by Applications" color="#14b8a6" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChartCard data={[
              { name: "Active", count: data?.stats?.activeJobs ?? 0 },
              { name: "Inactive", count: (data?.stats?.totalJobs ?? 0) - (data?.stats?.activeJobs ?? 0) },
            ]} label="Job Status Breakdown" color="#f59e0b" />
            <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Quick Pipeline Summary</h3>
              <div className="space-y-5">
                {[
                  { label: "Total Jobs", value: data?.stats?.totalJobs ?? 0, total: Math.max(data?.stats?.totalJobs ?? 0, data?.stats?.activeJobs ?? 0, 1), color: "bg-indigo-500" },
                  { label: "Active Jobs", value: data?.stats?.activeJobs ?? 0, total: Math.max(data?.stats?.totalJobs ?? 0, 1), color: "bg-emerald-500" },
                  { label: "Applications Received", value: data?.stats?.totalApplications ?? 0, total: Math.max(data?.stats?.totalApplications ?? 0, 1), color: "bg-amber-500" },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{item.label}</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100">{item.value}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${item.color}`} style={{ width: `${Math.min(100, (item.value / item.total) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {data?.topJobs && data.topJobs.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Top Performing Jobs</p>
                  <div className="space-y-2">
                    {data.topJobs.slice(0, 3).map((job, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{job.title}</span>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">{job.applications} applicants</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ─── CANDIDATE CHARTS ─── */}
      {!isRecruiter && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendChart data={scoreTrend} label="My Resume Score Trend" color="#6366f1" />
            <BarChartCard data={scoreDistribution} label="My Score Distribution" color="#14b8a6" dataKey="count" barKey="name" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Activity</h3>
              {data?.recentAnalyses && data.recentAnalyses.length > 0 ? (
                <div className="space-y-3">
                  {data.recentAnalyses.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{item.filename}</p>
                          <p className="text-xs text-slate-400 truncate">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-extrabold px-3 py-1 rounded-lg border shrink-0 ml-2 ${
                        item.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' :
                        item.score >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                        'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                      }`}>
                        {item.score}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  <FileText className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-slate-400 text-sm font-medium">No activity yet</p>
                  <p className="text-slate-300 dark:text-slate-600 text-xs">Analyze your first resume to get started</p>
                </div>
              )}
            </div>
            <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Performance Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Total Analyses", value: data?.stats?.totalAnalyses ?? 0, icon: "📄" },
                  { label: "Applications", value: data?.stats?.totalApplications ?? 0, icon: "📝" },
                  { label: "Best Score", value: data?.recentAnalyses?.length ? `${Math.max(...data.recentAnalyses.map(a => a.score))}%` : '—', icon: "🏆" },
                  { label: "Avg Score", value: data?.stats?.avgScore ? `${data.stats.avgScore}%` : '—', icon: "⭐" },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/20 border border-slate-100 dark:border-slate-700/50 text-center">
                    <span className="text-2xl mb-2 block">{stat.icon}</span>
                    <div className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{stat.value}</div>
                    <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
