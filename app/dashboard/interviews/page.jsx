// app/dashboard/interviews/page.js
"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import InterviewCard from "@/components/InterviewCard";

export default function InterviewsPage() {
  const [open, setOpen] = useState(true);
  const [filter, setFilter] = useState("all");

  const interviews = [
    { id: 1, title: "Senior Frontend Developer", status: "completed", candidates: 8, date: "Nov 20, 2023", duration: "45 min", type: "Technical" },
    { id: 2, title: "Backend Engineer", status: "active", candidates: 3, date: "Nov 22, 2023", duration: "60 min", type: "Technical" },
    { id: 3, title: "Product Manager", status: "scheduled", candidates: 5, date: "Nov 25, 2023", duration: "90 min", type: "Behavioral" },
    { id: 4, title: "UX Designer", status: "draft", candidates: 0, date: "-", duration: "Custom", type: "Portfolio Review" },
    { id: 5, title: "Data Scientist", status: "completed", candidates: 12, date: "Nov 18, 2023", duration: "75 min", type: "Technical" },
    { id: 6, title: "DevOps Engineer", status: "active", candidates: 6, date: "Nov 23, 2023", duration: "60 min", type: "Technical" },
  ];

  const filteredInterviews = interviews.filter(interview => {
    if (filter === "all") return true;
    return interview.status === filter;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar open={open} toggle={() => setOpen(!open)} />
      
      <main className={`flex-1 transition-all duration-300 ${open ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="p-6 lg:p-8">
          {/* Custom Header for Interviews */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Interviews</h1>
              <p className="text-gray-600 mt-2">Manage and track all your AI interviews</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-medium">
                  + New Interview
                </button>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {["all", "active", "scheduled", "completed", "draft"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === tab
                      ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab !== "all" && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                      {interviews.filter(i => i.status === tab).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Interview Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>

          {/* Empty State */}
          {filteredInterviews.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎤</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No interviews found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {filter === "all" 
                  ? "Create your first AI interview to get started"
                  : `No ${filter} interviews found. Try a different filter.`}
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-medium">
                + Create New Interview
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}