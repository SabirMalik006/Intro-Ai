// app/dashboard/candidates/page.js
"use client";

import { useState } from "react";
import CandidateTable from "@/components/CandidateTable";

export default function CandidatesPage() {
  const [search, setSearch] = useState("");

  return (
    <>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-slate-100">Candidates</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Manage and review all candidate profiles</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full lg:w-64 px-4 py-3 pl-10 rounded-xl border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
            />
            <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-medium">
            + Add Candidate
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">128</div>
          <div className="text-gray-600 dark:text-slate-300 text-sm">Total Candidates</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-green-600">42</div>
          <div className="text-gray-600 dark:text-slate-300 text-sm">Hired</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-amber-600">18</div>
          <div className="text-gray-600 dark:text-slate-300 text-sm">In Process</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-blue-600">68</div>
          <div className="text-gray-600 dark:text-slate-300 text-sm">New This Month</div>
        </div>
      </div>

      {/* Candidate Table */}
      <CandidateTable search={search} />

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-teal-300 hover:bg-teal-50 transition-all flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <span className="text-teal-600 text-xl">📧</span>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-slate-100">Bulk Email</div>
              <div className="text-sm text-gray-600 dark:text-slate-300">Send emails to candidates</div>
            </div>
          </button>
          <button className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-teal-300 hover:bg-teal-50 transition-all flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <span className="text-teal-600 text-xl">📄</span>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-slate-100">Generate Reports</div>
              <div className="text-sm text-gray-600 dark:text-slate-300">Create candidate reports</div>
            </div>
          </button>
          <button className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-teal-300 hover:bg-teal-50 transition-all flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <span className="text-teal-600 text-xl">🔄</span>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-slate-100">Import Candidates</div>
              <div className="text-sm text-gray-600 dark:text-slate-300">Import from CSV/LinkedIn</div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
