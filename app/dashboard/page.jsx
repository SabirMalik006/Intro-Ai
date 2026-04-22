// app/dashboard/page.js
"use client";

import DashboardHeader from "@/components/DashboardHeader";
import StatCard from "@/components/StatCard";
import RecentInterviews from "@/components/RecentInterviews";
import UpcomingInterviews from "@/components/UpcomingInterviews";
import PerformanceChart from "@/components/PerformanceChart";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white mb-8 shadow-xl shadow-indigo-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, Alex! 👋</h2>
            <p className="text-indigo-100 text-lg">You have 3 upcoming interviews and 5 pending reviews</p>
          </div>
          <button className="mt-6 md:mt-0 px-8 py-3 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-indigo-50 transition-all duration-300 shadow-lg">
            View Schedule
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Interviews"
          value="42"
          change="+12%"
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Completed"
          value="32"
          change="+8%"
          icon="✅"
          color="teal"
        />
        <StatCard
          title="Pending Review"
          value="5"
          change="-2%"
          icon="⏳"
          color="amber"
        />
        <StatCard
          title="Avg. Score"
          value="8.2"
          change="+0.5"
          icon="⭐"
          color="purple"
        />
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Performance Chart */}
        <div className="xl:col-span-2">
          <PerformanceChart />
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Stats</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-slate-600 font-medium">Time Saved</span>
              <span className="font-bold text-indigo-600 text-lg">42 hrs</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-slate-600 font-medium">Candidates Reviewed</span>
              <span className="font-bold text-indigo-600 text-lg">128</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-slate-600 font-medium">Avg. Time/Interview</span>
              <span className="font-bold text-indigo-600 text-lg">25 min</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-slate-600 font-medium">Success Rate</span>
              <span className="font-bold text-indigo-600 text-lg">78%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent and Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentInterviews />
        <UpcomingInterviews />
      </div>
    </>
  );
}
