"use client";

import { useState, useEffect, useMemo } from "react";
import api from "@/services/api";
import useAuthStore from "@/store/authStore";
import {
  BarChart, Bar, Cell, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart, Legend
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm" style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}{p.name.includes('Score') || p.name.includes('Rate') ? '%' : ''}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const COLORS = ["#14b8a6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#c8f135"];

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300" style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }} />
      <div className="relative bg-white/80 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-white/5 p-5 hover:border-slate-300 dark:hover:border-white/10 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
            {icon}
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full" style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
            {sub || 'Real-time'}
          </span>
        </div>
        <div className="text-2xl font-extrabold text-slate-800 dark:text-white mb-0.5">{value ?? '—'}</div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400" style={{ color: `${color}cc` }}>{label}</p>
      </div>
    </div>
  );
}

function ScoreChart({ data, label, color = "#14b8a6" }) {
  const isEmpty = !data || data.length === 0;
  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-white/5 p-6 hover:border-slate-300 dark:hover:border-white/10 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <svg className="w-4 h-4" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white">{label}</h3>
      </div>
      <div className="h-72">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl">
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill={`url(#grad-${color.replace('#', '')})`} dot={{ fill: color, strokeWidth: 2, r: 3 }} activeDot={{ r: 5, fill: color }} name="Score" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function SkillRadar({ data, label, color = "#8b5cf6" }) {
  const isEmpty = !data || data.length === 0;
  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-white/5 p-6 hover:border-slate-300 dark:hover:border-white/10 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <svg className="w-4 h-4" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white">{label}</h3>
      </div>
      <div className="h-72">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl">
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} tickCount={5} />
              <Tooltip content={<CustomTooltip />} />
              <Radar name="Score" dataKey="score" stroke={color} fill={color} fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: color }} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function BarCard({ data, label, color = "#f59e0b", dataKey = "count", barKey = "name" }) {
  const isEmpty = !data || data.length === 0;
  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-white/5 p-6 hover:border-slate-300 dark:hover:border-white/10 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <svg className="w-4 h-4" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white">{label}</h3>
      </div>
      <div className="h-72">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl">
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey={barKey} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={dataKey} radius={[6, 6, 0, 0]} maxBarSize={44} name="Count">
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function PieCard({ data, label, color = "#14b8a6" }) {
  const isEmpty = !data || data.length === 0;
  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-white/5 p-6 hover:border-slate-300 dark:hover:border-white/10 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <svg className="w-4 h-4" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white">{label}</h3>
      </div>
      <div className="h-72 flex items-center justify-center">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl w-full">
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function RecentList({ items, icon, emptyText, color = "#14b8a6" }) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-white/5 p-6 hover:border-slate-300 dark:hover:border-white/10 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <svg className="w-4 h-4" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white">Recent Activity</h3>
      </div>
      {items && items.length > 0 ? (
        <div className="space-y-2">
          {items.slice(0, 5).map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}10` }}>
                  <span className="text-sm">{icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{item.label || item.filename || item.title || 'Interview'}</p>
                  <p className="text-xs text-slate-400">{item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : item.sub || ''}</p>
                </div>
              </div>
              {item.score !== undefined && (
                <span className={`text-sm font-extrabold px-2.5 py-1 rounded-lg shrink-0 ml-2 ${
                  item.score >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                  item.score >= 60 ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                  'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                }`}>
                  {item.score}%
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl">
          <span className="text-2xl mb-2 opacity-30">{icon}</span>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">{emptyText || 'No activity yet'}</p>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("overview");

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

  const scores = useMemo(() => {
    if (!data?.performanceData) return [];
    return data.performanceData.map(p => ({ label: p.month, value: p.score }));
  }, [data]);

  const dist = useMemo(() => {
    if (!data?.recentAnalyses) return [];
    const r = [
      { name: "0-20", value: 0 },
      { name: "21-40", value: 0 },
      { name: "41-60", value: 0 },
      { name: "61-80", value: 0 },
      { name: "81-100", value: 0 },
    ];
    data.recentAnalyses.forEach(d => {
      if (d.score >= 0 && d.score <= 20) r[0].value++;
      else if (d.score <= 40) r[1].value++;
      else if (d.score <= 60) r[2].value++;
      else if (d.score <= 80) r[3].value++;
      else r[4].value++;
    });
    return r;
  }, [data]);

  const skills = useMemo(() => {
    if (!data?.recentAnalyses) return [];
    const skillMap = {};
    data.recentAnalyses.forEach(a => {
      if (a.strengths) a.strengths.forEach(s => { skillMap[s] = (skillMap[s] || 0) + 1; });
    });
    return Object.entries(skillMap).slice(0, 6).map(([skill, count]) => ({ skill, score: Math.min(100, count * 20 + 40) }));
  }, [data]);

  const passFail = useMemo(() => {
    if (!data?.recentAnalyses) return [{ name: "Pass", value: 0 }, { name: "Improve", value: 0 }];
    const pass = data.recentAnalyses.filter(a => a.score >= 70).length;
    return [
      { name: "Pass (70%+)", value: pass },
      { name: "Needs Work", value: data.recentAnalyses.length - pass },
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-14 h-14 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-bold">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-white/10 p-10 shadow-xl max-w-md">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-200 dark:border-red-500/20">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Failed to load</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all">Try Again</button>
        </div>
      </div>
    );
  }

  const baseData = data?.stats || {};

  return (
    <div className="space-y-8">
      {/* ─── HEADER ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-white/5 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-teal-500/10 border border-indigo-200 dark:border-teal-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                  AI Interview Analytics
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-sm font-medium">
                  {isRecruiter ? 'Candidate performance & hiring intelligence' : 'Your interview performance insights'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-white/5">
            {[
              { key: "overview", label: "Overview" },
              { key: "skills", label: "Skills" },
              { key: "trends", label: "Trends" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  tab === t.key
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === "overview" && (
        <>
          {/* ─── METRICS ─── */}
          {isRecruiter ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard icon="🎯" label="Interviews Conducted" value={baseData.totalAnalyses ?? 0} sub="Total" color="#14b8a6" />
              <StatCard icon="⭐" label="Avg Candidate Score" value={baseData.avgScore ? `${baseData.avgScore}%` : '—'} sub="AI Rated" color="#8b5cf6" />
              <StatCard icon="✅" label="Pass Rate" value={data?.recentAnalyses?.length ? `${Math.round((data.recentAnalyses.filter(a => a.score >= 70).length / data.recentAnalyses.length) * 100)}%` : '—'} sub="Score ≥70%" color="#f59e0b" />
              <StatCard icon="⏱️" label="Active Candidates" value={baseData.totalApplications ?? 0} sub="In Pipeline" color="#06b6d4" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard icon="🎤" label="Interviews Taken" value={baseData.totalAnalyses ?? 0} sub="Completed" color="#14b8a6" />
              <StatCard icon="🏆" label="Best Score" value={data?.recentAnalyses?.length ? `${Math.max(...data.recentAnalyses.map(a => a.score))}%` : '—'} sub="Personal Best" color="#8b5cf6" />
              <StatCard icon="📈" label="Average Score" value={baseData.avgScore ? `${baseData.avgScore}%` : '—'} sub="Overall" color="#f59e0b" />
              <StatCard icon="💪" label="Strengths Identified" value={skills.length || '—'} sub="Key Areas" color="#06b6d4" />
            </div>
          )}

          {/* ─── CHARTS ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScoreChart data={scores} label="Score Performance Over Time" color="#14b8a6" />
            <BarCard data={dist} label="Score Distribution" color="#8b5cf6" dataKey="value" barKey="name" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieCard data={passFail} label="Pass vs Needs Improvement" color="#14b8a6" />
            <RecentList items={data?.recentAnalyses?.map(a => ({ ...a, label: a.filename || a.title || 'Interview' }))} icon="📄" emptyText="No interviews yet" color="#8b5cf6" />
          </div>

          {/* ─── INSIGHTS ─── */}
          <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-white/5 p-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">💡 Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-500/5 border border-teal-200 dark:border-teal-500/10">
                <p className="text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">Top Strength</p>
                <p className="text-slate-800 dark:text-white text-sm font-semibold">{skills[0]?.skill || 'N/A'}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{skills[0] ? `Score: ${skills[0].score}%` : 'Complete more interviews'}</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/10">
                <p className="text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">Avg Duration</p>
                <p className="text-slate-800 dark:text-white text-sm font-semibold">{baseData.totalAnalyses ? '~25 min' : '—'}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Per interview session</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10">
                <p className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Recommendation</p>
                <p className="text-slate-800 dark:text-white text-sm font-semibold">{baseData.avgScore >= 80 ? 'Strong Hire' : baseData.avgScore >= 60 ? 'Consider' : 'Needs Practice'}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Based on AI evaluation</p>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === "skills" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkillRadar data={skills} label="Skill Proficiency Breakdown" color="#8b5cf6" />
            <BarCard data={dist} label="Score Range Distribution" color="#f59e0b" dataKey="value" barKey="name" />
          </div>
          <RecentList items={data?.recentAnalyses?.map(a => ({ ...a, label: a.filename || a.title || 'Interview' }))} icon="📄" emptyText="No data yet" color="#14b8a6" />
        </div>
      )}

      {tab === "trends" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScoreChart data={scores} label="Score Trend" color="#14b8a6" />
            <PieCard data={passFail} label="Overall Pass Rate" color="#8b5cf6" />
          </div>
          <RecentList items={data?.recentAnalyses?.map(a => ({ ...a, label: a.filename || a.title || 'Interview' }))} icon="📄" emptyText="No data yet" color="#f59e0b" />
        </div>
      )}
    </div>
  );
}
