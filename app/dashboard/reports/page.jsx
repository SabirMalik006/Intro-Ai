"use client";

import { useState } from "react";

export default function ReportsPage() {
  const reports = [
    { id: 1, name: "Q4 Hiring Report", date: "Nov 15, 2023", type: "Quarterly", status: "completed", size: "2.4 MB" },
    { id: 2, name: "Technical Roles Analysis", date: "Nov 10, 2023", type: "Monthly", status: "completed", size: "1.8 MB" },
    { id: 3, name: "Diversity & Inclusion", date: "Nov 5, 2023", type: "Monthly", status: "completed", size: "3.1 MB" },
    { id: 4, name: "November 2023 Summary", date: "Generating...", type: "Monthly", status: "processing", size: "-" },
    { id: 5, name: "Candidate Experience Survey", date: "Oct 28, 2023", type: "Custom", status: "completed", size: "1.2 MB" },
    { id: 6, name: "AI Performance Metrics", date: "Oct 20, 2023", type: "Monthly", status: "completed", size: "2.7 MB" },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-slate-100">Reports</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Generate and download detailed hiring reports</p>
        </div>

        <div className="flex gap-3">
          <button className="px-5 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export All
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Report
          </button>
        </div>
      </div>

      {/* Report Types */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Report Types</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {["Comprehensive", "Performance", "Diversity", "Custom"].map((type, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-teal-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">{["📋", "📊", "👥", "⚙️"][index]}</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">{type} Report</h4>
              <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">Detailed analysis of {type.toLowerCase()} metrics</p>
              <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                Generate →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Recent Reports</h3>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${report.status === "processing" ? "bg-amber-50" : "bg-teal-50"
                    }`}>
                    <span className={`text-xl ${report.status === "processing" ? "text-amber-600" : "text-teal-600"
                      }`}>
                      📋
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-slate-100">{report.name}</h4>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 rounded-full text-xs font-medium">
                        {report.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${report.status === "completed"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                        }`}>
                        {report.status === "completed" ? "Ready" : "Processing"}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-slate-400">
                        {report.date} • {report.size}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    Preview
                  </button>
                  {report.status === "completed" && (
                    <button className="px-4 py-2 text-sm bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300">
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Reports */}
      <div className="mt-8 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">Schedule Automatic Reports</h3>
            <p className="text-gray-600 dark:text-slate-300">Get regular reports delivered to your inbox automatically</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              Weekly
            </button>
            <button className="px-5 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              Monthly
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-medium">
              Schedule Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}