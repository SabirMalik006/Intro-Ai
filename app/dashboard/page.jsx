"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import api from "@/services/api";
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart
} from "recharts";

function StatCard({ title, value, icon, color, href }) {
  const accentColors = {
    blue: { icon: "from-blue-500 to-blue-600 bg-blue-100 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400", ring: "ring-blue-500/20" },
    teal: { icon: "from-teal-500 to-teal-600 bg-teal-100 border-teal-200 text-teal-600 dark:bg-teal-900/20 dark:border-teal-800/50 dark:text-teal-400", ring: "ring-teal-500/20" },
    amber: { icon: "from-amber-500 to-amber-600 bg-amber-100 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400", ring: "ring-amber-500/20" },
    purple: { icon: "from-purple-500 to-purple-600 bg-purple-100 border-purple-200 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800/50 dark:text-purple-400", ring: "ring-purple-500/20" },
    rose: { icon: "from-rose-500 to-rose-600 bg-rose-100 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400", ring: "ring-rose-500/20" },
  };

  return (
    <div className={`${href ? 'cursor-pointer' : ''}`} onClick={() => href && window.location.assign(href)}>
      <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 shadow-sm transition-all duration-300 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white dark:to-transparent pointer-events-none" />
        <div className="relative">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 mb-4 ${accentColors[color].icon} shadow-sm`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-1 tracking-tight">
            {value ?? '—'}
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">{title}</p>
        </div>
      </div>
    </div>
  );
}

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
const PIE_COLORS = ["#6366f1", "#14b8a6", "#f59e0b", "#ef4444", "#8b5cf6"];


function TrendChart({ data }) {
  if (!data || data.length === 0) {
    data = [
      { month: "Jan", score: 0 }, { month: "Feb", score: 0 }, { month: "Mar", score: 0 },
      { month: "Apr", score: 0 }, { month: "May", score: 0 }, { month: "Jun", score: 0 },
    ];
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Score Trend</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Resume scores over time</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Avg Score</span>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fill="url(#scoreGrad)" dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#6366f1' }} name="Score" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-8 mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex-1 text-center">
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-0.5">Total Entries</div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100">{data.length}</div>
        </div>
        <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1 text-center">
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-0.5">Latest Score</div>
          <div className="text-xl font-black text-indigo-600">{data[data.length - 1]?.score ?? 0}%</div>
        </div>
        <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1 text-center">
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-0.5">Growth</div>
          <div className="text-xl font-black text-emerald-600">
            +{Math.max(0, (data[data.length - 1]?.score ?? 0) - (data[0]?.score ?? 0))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreDistribution({ data }) {
  const dist = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { range: "0-20", count: 0 }, { range: "21-40", count: 0 },
        { range: "41-60", count: 0 }, { range: "61-80", count: 0 }, { range: "81-100", count: 0 },
      ];
    }
    const ranges = [
      { range: "0-20", min: 0, max: 20, count: 0 },
      { range: "21-40", min: 21, max: 40, count: 0 },
      { range: "41-60", min: 41, max: 60, count: 0 },
      { range: "61-80", min: 61, max: 80, count: 0 },
      { range: "81-100", min: 81, max: 100, count: 0 },
    ];
    data.forEach(d => {
      const r = ranges.find(r => d.score >= r.min && d.score <= r.max);
      if (r) r.count++;
    });
    return ranges;
  }, [data]);

  return (
    <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Score Distribution</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">How your scores are spread across ranges</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dist} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={50} name="Analyses">
              {dist.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CircularProgress({ percent, size = 80, strokeWidth = 6, color }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90 drop-shadow-sm">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-slate-100 dark:text-slate-700" />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

function PieChartCard({ data }) {
  const categories = useMemo(() => {
    if (!data || data.length === 0) return [];
    const groups = [
      { label: "Excellent", range: "80+", min: 80, color: PIE_COLORS[0], icon: "🏆" },
      { label: "Good", range: "60-79", min: 60, max: 79, color: PIE_COLORS[1], icon: "⭐" },
      { label: "Average", range: "40-59", min: 40, max: 59, color: PIE_COLORS[2], icon: "📊" },
      { label: "Needs Work", range: "<40", max: 39, color: PIE_COLORS[3], icon: "💪" },
    ];
    const counts = [0, 0, 0, 0];
    data.forEach(d => {
      if (d.score >= 80) counts[0]++;
      else if (d.score >= 60) counts[1]++;
      else if (d.score >= 40) counts[2]++;
      else counts[3]++;
    });
    const total = counts.reduce((s, v) => s + v, 0);
    return groups.map((g, i) => ({ ...g, count: counts[i], percent: total ? Math.round((counts[i] / total) * 100) : 0 }));
  }, [data]);

  const total = categories.reduce((s, c) => s + c.count, 0);
  const avgScore = data && data.length > 0 ? Math.round(data.reduce((s, d) => s + d.score, 0) / data.length) : 0;

  return (
    <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Quality Breakdown</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Performance categorization</p>
        </div>
        {total > 0 && (
          <div className="flex flex-col items-center">
            <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{avgScore}</div>
            <div className="text-xs font-medium text-slate-400 dark:text-slate-500">Avg Score</div>
          </div>
        )}
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
          <div className="text-4xl mb-3 opacity-40">📋</div>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No analyses yet</p>
          <p className="text-slate-300 dark:text-slate-600 text-xs">Upload resumes to see quality breakdown</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="relative group p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/80 dark:to-slate-800/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                style={{ borderColor: cat.color + "20" }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <CircularProgress percent={cat.percent} size={68} strokeWidth={5} color={cat.color} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-base font-bold" style={{ color: cat.color }}>{cat.percent}%</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{cat.icon}</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{cat.label}</span>
                    </div>
                    <div className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{cat.count}</div>
                    <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{cat.range}</div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full opacity-60" style={{ background: `linear-gradient(90deg, ${cat.color}, ${cat.color}44)` }} />
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Distribution</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{total} total</span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shadow-inner">
              {categories.filter(c => c.count > 0).map((cat, i) => (
                <div
                  key={i}
                  style={{
                    width: cat.percent + "%",
                    backgroundColor: cat.color,
                  }}
                  className="h-full transition-all duration-700 first:rounded-l-full last:rounded-r-full"
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
              {categories.filter(c => c.count > 0).map((cat, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.label} ({cat.count})
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function RecentAnalyses({ analyses }) {
  if (!analyses || analyses.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <span className="text-3xl">📄</span>
          </div>
          <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No analyses yet</h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Upload your first resume for AI analysis</p>
          <Link href="/dashboard/resume-analyzer" className="inline-block mt-5 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
            Analyze Resume
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Analyses</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Your latest resume evaluations</p>
        </div>
        <Link href="/dashboard/resume-analyzer" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all">
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="space-y-3">
        {analyses.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/resume-analyzer?id=${item.id}`}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-transparent dark:hover:from-indigo-900/10 dark:hover:to-transparent hover:border-indigo-200 dark:hover:border-indigo-800/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center shadow-sm border border-indigo-200/50 dark:border-indigo-800/30">
                <span className="text-lg">📄</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate max-w-[180px]">{item.filename}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`text-sm font-extrabold px-3 py-1.5 rounded-lg border ${
                item.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30' :
                item.score >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30' :
                'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30'
              }`}>
                {item.score}%
              </div>
              <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TopJobs({ jobs, userRole }) {
  if (userRole !== 'recruiter') {
    return (
      <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Quick Actions</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">Jump to your tools</p>
        <div className="space-y-4">
          <Link href="/dashboard/interview-room" className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border border-indigo-200/60 dark:border-indigo-800/30 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/20">🎤</div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 dark:text-slate-100">AI Mock Interview</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Practice with AI interviewer</p>
            </div>
            <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/dashboard/resume-analyzer" className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/10 dark:to-blue-900/10 border border-teal-200/60 dark:border-teal-800/30 hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-700/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-xl shadow-lg shadow-teal-500/20">📊</div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 dark:text-slate-100">Analyze Resume</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Get AI feedback on your resume</p>
            </div>
            <svg className="w-5 h-5 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Top Jobs</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">Your most applied positions</p>
      {jobs && jobs.length > 0 ? (
        <div className="space-y-3">
          {jobs.map((job, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-800/40 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black shadow-sm ${
                  i === 0 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                  i === 1 ? 'bg-slate-200 text-slate-600 border border-slate-300' :
                  i === 2 ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                  'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{job.title}</h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{job.applications} applicant{job.applications !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                job.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30' : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
              }`}>
                {job.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">💼</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No jobs posted yet</p>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-14 h-14 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-lg shadow-indigo-500/10" />
          <p className="text-slate-500 dark:text-slate-400 font-bold">Loading dashboard...</p>
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
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { user, stats, recentAnalyses, topJobs, performanceData } = data || {};
  const userName = user?.fullName?.split(' ')[0] || 'User';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {user?.role === 'recruiter' ? 'Manage your hiring pipeline' : 'Track your interview progress'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/interview-room" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all font-bold shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Interview
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Resume Analyses" value={stats?.totalAnalyses ?? 0} icon="📊" color="blue" href="/dashboard/resume-analyzer" />
        <StatCard title="Applications" value={stats?.totalApplications ?? 0} icon="📝" color="teal" href={user?.role === 'recruiter' ? '/dashboard/recruiter' : '/dashboard/explore-jobs'} />
        <StatCard title={user?.role === 'recruiter' ? 'Active Jobs' : 'Avg. Score'} value={user?.role === 'recruiter' ? stats?.activeJobs ?? 0 : (stats?.avgScore ? `${stats.avgScore}%` : '—')} icon={user?.role === 'recruiter' ? '💼' : '⭐'} color="amber" />
        <StatCard title={user?.role === 'recruiter' ? 'Total Jobs' : 'Analyses Done'} value={user?.role === 'recruiter' ? stats?.totalJobs ?? 0 : stats?.totalAnalyses ?? 0} icon={user?.role === 'recruiter' ? '📋' : '✅'} color="purple" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={performanceData} />
        <PieChartCard data={recentAnalyses} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreDistribution data={recentAnalyses} />
        <TopJobs jobs={topJobs} userRole={user?.role} />
      </div>

      {/* Recent Analyses */}
      <RecentAnalyses analyses={recentAnalyses} />
    </div>
  );
}
