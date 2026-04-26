// components/PerformanceChart.js
"use client";

import { useState } from "react";

export default function PerformanceChart() {
  const [timeRange, setTimeRange] = useState("month");

  const data = {
    month: [65, 70, 75, 80, 85, 90, 95, 85, 78, 82, 88, 92],
    week: [70, 75, 72, 80, 85, 88, 90],
    quarter: [60, 65, 70, 75, 80, 85, 90, 92, 88, 85, 90, 95],
  };

  const labels = timeRange === "week" 
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const currentData = data[timeRange];
  const maxValue = Math.max(...currentData);
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Interview Performance</h3>
          <p className="text-gray-600 dark:text-slate-300 text-sm">Average candidate scores over time</p>
        </div>
        
        <div className="flex gap-2">
          {["week", "month", "quarter"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white"
                  : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 flex items-end space-x-2 mt-8">
        {currentData.map((value, index) => {
          const height = (value / maxValue) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-teal-500 to-blue-500 rounded-t-lg transition-all duration-500"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-500 dark:text-slate-400 mt-2">{labels[index]}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-slate-300">Candidate Score</span>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">{currentData[currentData.length - 1]}/100</div>
          <div className="text-sm text-gray-500 dark:text-slate-400">Current Average</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">+{currentData[currentData.length - 1] - currentData[0]}</div>
          <div className="text-sm text-gray-500 dark:text-slate-400">Improvement</div>
        </div>
      </div>
    </div>
  );
}