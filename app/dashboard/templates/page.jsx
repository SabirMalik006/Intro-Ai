// app/dashboard/templates/page.js
"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function TemplatesPage() {
  const [open, setOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Templates", count: 12 },
    { id: "technical", name: "Technical", count: 5 },
    { id: "behavioral", name: "Behavioral", count: 4 },
    { id: "leadership", name: "Leadership", count: 2 },
    { id: "custom", name: "My Templates", count: 1 },
  ];

  const templates = [
    { id: 1, name: "Software Engineer", category: "technical", questions: 15, duration: "60 min", uses: 42 },
    { id: 2, name: "Product Manager", category: "behavioral", questions: 12, duration: "90 min", uses: 28 },
    { id: 3, name: "Data Scientist", category: "technical", questions: 18, duration: "75 min", uses: 35 },
    { id: 4, name: "UX Designer", category: "technical", questions: 10, duration: "45 min", uses: 19 },
    { id: 5, name: "Marketing Lead", category: "leadership", questions: 14, duration: "60 min", uses: 15 },
    { id: 6, name: "Sales Executive", category: "behavioral", questions: 11, duration: "50 min", uses: 22 },
    { id: 7, name: "DevOps Engineer", category: "technical", questions: 16, duration: "70 min", uses: 31 },
    { id: 8, name: "Custom Interview", category: "custom", questions: 20, duration: "Custom", uses: 5 },
  ];

  const filteredTemplates = templates.filter(template => 
    selectedCategory === "all" || template.category === selectedCategory
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar open={open} toggle={() => setOpen(!open)} />
      
      <main className={`flex-1 transition-all duration-300 ${open ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Interview Templates</h1>
              <p className="text-gray-600 mt-2">Choose from pre-built templates or create your own</p>
            </div>
            
            <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Template
            </button>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {category.name}
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    selectedCategory === category.id
                      ? "bg-white/20"
                      : "bg-gray-100"
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{template.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium mt-2 inline-block ${
                      template.category === "technical" ? "bg-blue-50 text-blue-700" :
                      template.category === "behavioral" ? "bg-teal-50 text-teal-700" :
                      template.category === "leadership" ? "bg-purple-50 text-purple-700" :
                      "bg-gray-50 text-gray-700"
                    }`}>
                      {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                    </span>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {template.questions} Questions
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {template.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Used {template.uses} times
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Preview
                  </button>
                  <button className="flex-1 py-2.5 text-sm bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Create Template Card */}
          <div className="mt-8">
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-dashed border-teal-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-teal-200">
                <span className="text-3xl text-teal-600">+</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Custom Template</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Design your own interview template with custom questions and evaluation criteria
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-medium">
                Start Creating
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}