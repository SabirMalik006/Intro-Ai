"use client";

import ResumeAnalyzer from '@/components/candidate/ResumeAnalyzer';
import Link from 'next/link';

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 mb-4">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Hub</h1>
              <p className="text-sm text-gray-500">Manage your resumes and analyze them with AI</p>
            </div>
          </div>
        </div>
        
        <ResumeAnalyzer />
      </div>
    </div>
  );
}
