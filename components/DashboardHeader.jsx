// components/DashboardHeader.js
"use client";

import { useState } from "react";

export default function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage interviews, review AI insights, and track hiring progress
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
        {/* Search Bar */}
        <div className="relative flex-1 lg:flex-none">
          <input
            type="text"
            placeholder="Search interviews, candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full lg:w-64 px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
          />
          <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Import
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Interview
          </button>
        </div>
      </div>
    </div>
  );
}