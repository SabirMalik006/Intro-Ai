// components/DashboardSidebar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardSidebar({ open, toggle }) {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", icon: "📊", href: "/dashboard" },
    { label: "Interviews", icon: "🎤", href: "/dashboard/interviews" },
    { label: "Candidates", icon: "👥", href: "/dashboard/candidates" },
    { label: "Templates", icon: "📝", href: "/dashboard/templates" },
    { label: "Analytics", icon: "📈", href: "/dashboard/analytics" },
    { label: "Reports", icon: "📋", href: "/dashboard/reports" },
    { label: "Messages", icon: "💬", href: "/dashboard/messages" },
    { label: "Settings", icon: "⚙️", href: "/dashboard/settings" },
  ];

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } bg-white border-r border-gray-200 min-h-screen transition-all duration-300 fixed lg:sticky top-0 left-0 z-40 flex flex-col`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {open ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">SH</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Smart<span className="text-teal-600">Hire</span>
                </h2>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-lg">SH</span>
            </div>
          )}
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-gray-100">
        {open ? (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center">
              <span className="text-teal-700 font-bold text-lg">AJ</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">Alex Johnson</h3>
              <p className="text-sm text-gray-500 truncate">Recruiter</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-teal-700 font-bold">AJ</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center rounded-xl p-3 transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 border border-teal-100"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {open && <span className="font-medium">{item.label}</span>}
                {isActive && open && (
                  <span className="ml-auto w-2 h-2 bg-teal-500 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100">
        {open ? (
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
            <button className="w-full flex items-center justify-center gap-2 p-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}