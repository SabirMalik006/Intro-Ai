"use client";

import { useState } from "react";
import AnalyticsChart from "@/components/AnalyticsChart";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");

  const metrics = [
    { label: "Total Interviews", value: "142", change: "+12%", icon: "📊" },
    { label: "Avg. Score", value: "8.2/10", change: "+0.5", icon: "⭐" },
    { label: "Time Saved", value: "84 hrs", change: "+18%", icon: "⏱️" },
    { label: "Success Rate", value: "78%", change: "+5%", icon: "📈" },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Detailed insights and performance metrics</p>
        </div>

        <div className="flex gap-2">
          {["week", "month", "quarter", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${timeRange === range
                ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{metric.icon}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${metric.change.startsWith('+')
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-600'
                }`}>
                {metric.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="text-gray-600 text-sm">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsChart type="interviews" title="Interviews Over Time" timeRange={timeRange} />
        <AnalyticsChart type="scores" title="Candidate Scores Distribution" timeRange={timeRange} />
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Roles</h3>
          <div className="space-y-4">
            {["Software Engineer", "Product Manager", "Data Scientist", "UX Designer"].map((role, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{role}</span>
                <span className="font-medium text-gray-900">{42 - index * 8} interviews</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Efficiency Gains</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Time Reduction</span>
                <span className="text-sm font-medium text-teal-600">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Bias Reduction</span>
                <span className="text-sm font-medium text-teal-600">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-600 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Candidate Satisfaction</span>
                <span className="text-sm font-medium text-teal-600">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 text-left rounded-xl border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-teal-600">📥</span>
              </div>
              <span className="font-medium text-gray-900">Export Report</span>
            </button>
            <button className="w-full p-3 text-left rounded-xl border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-teal-600">📧</span>
              </div>
              <span className="font-medium text-gray-900">Share Insights</span>
            </button>
            <button className="w-full p-3 text-left rounded-xl border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-teal-600">🎯</span>
              </div>
              <span className="font-medium text-gray-900">Set Goals</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}