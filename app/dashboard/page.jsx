// app/dashboard/page.js
"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import StatCard from "@/components/StatCard";
import RecentInterviews from "@/components/RecentInterviews";
import UpcomingInterviews from "@/components/UpcomingInterviews";
import PerformanceChart from "@/components/PerformanceChart";

export default function DashboardPage() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar open={open} toggle={() => setOpen(!open)} />

      <main className={`flex-1 transition-all duration-300 ${open ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="p-6 lg:p-8">
          <DashboardHeader />
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-6 text-white mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, Alex!</h2>
                <p className="text-teal-100">You have 3 upcoming interviews and 5 pending reviews</p>
              </div>
              <button className="mt-4 md:mt-0 px-6 py-3 bg-white text-teal-700 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-300">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Performance Chart */}
            <div className="lg:col-span-2">
              <PerformanceChart />
            </div>
            
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Saved</span>
                  <span className="font-semibold text-teal-600">42 hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Candidates Reviewed</span>
                  <span className="font-semibold text-teal-600">128</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Time/Interview</span>
                  <span className="font-semibold text-teal-600">25 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-teal-600">78%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent and Upcoming Interviews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentInterviews />
            <UpcomingInterviews />
          </div>
        </div>
      </main>
    </div>
  );
}