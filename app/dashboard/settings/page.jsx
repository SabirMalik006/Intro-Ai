// app/dashboard/settings/page.js
"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function SettingsPage() {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    email: true,
    interviews: true,
    candidates: true,
    reports: false,
  });

  return (
    <div className="flex min-h-screen bg-slate-50 text-gray-400">
      <DashboardSidebar open={open} toggle={() => setOpen(!open)} />
      
      <main className={`flex-1 transition-all duration-300 ${open ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account and preferences</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Settings Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <nav className="space-y-1">
                  {["profile", "account", "notifications", "integrations", "billing", "team"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full px-4 py-3 rounded-xl text-left transition-colors ${
                        activeTab === tab
                          ? "bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 border border-teal-100"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-medium capitalize">{tab}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:w-3/4">
              {activeTab === "profile" && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl text-teal-700 font-bold">AJ</span>
                      </div>
                      <div>
                        <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Change Photo
                        </button>
                        <p className="text-sm text-gray-500 mt-2">JPG, PNG up to 5MB</p>
                      </div>
                    </div>

                    {/* Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          defaultValue="Alex"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Johnson"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue="alex@company.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 123-4567"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea
                          rows={3}
                          defaultValue="Senior Recruiter at TechCorp. Specializing in technical roles and AI-powered hiring."
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100">
                      <button className="px-8 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-medium">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">{key}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {key === "email" && "Receive email notifications"}
                            {key === "interviews" && "Get notified about interview updates"}
                            {key === "candidates" && "Candidate status changes"}
                            {key === "reports" && "Weekly and monthly reports"}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            value ? "bg-teal-600" : "bg-gray-300"
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                            value ? "translate-x-7" : "translate-x-1"
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "integrations" && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Integrations</h2>
                  <div className="space-y-4">
                    {["Google Calendar", "Slack", "LinkedIn", "Zoom", "ATS System"].map((integration) => (
                      <div key={integration} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-teal-300 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-xl">🔗</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{integration}</h4>
                            <p className="text-sm text-gray-600">Connect your {integration.toLowerCase()} account</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}