"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthStore from "../store/authStore";

export default function DashboardSidebar({ open, toggle, isMobile }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    const useDark = nextTheme === "dark";
    document.documentElement.classList.toggle("dark", useDark);
    localStorage.setItem("dashboard-theme", nextTheme);
  };

  const menuItems = [
    { label: "Dashboard", icon: "📊", href: "/dashboard" },
    { label: "Explore Jobs", icon: "🌐", href: "/dashboard/explore-jobs" },
    { label: "Saved Jobs", icon: "🔖", href: "/dashboard/saved-jobs" },
    { label: "Interviews", icon: "🎤", href: "/dashboard/interviews" },
    { label: "Candidates", icon: "👥", href: "/dashboard/candidates", recruiterOnly: true },
    { label: "Templates", icon: "📝", href: "/dashboard/templates" },
    { label: "Analytics", icon: "📈", href: "/dashboard/analytics" },
    { label: "Reports", icon: "📋", href: "/dashboard/reports" },
    { label: "Messages", icon: "💬", href: "/dashboard/messages" },
    { label: "Settings", icon: "⚙️", href: "/dashboard/settings" },
    { label: "Recruiter", icon: "💼", href: "/dashboard/recruiter", recruiterOnly: true },
    { label: "Resume Analyzer", icon: "📄", href: "/dashboard/resume-analyzer" }
  ].filter(item => {
    if (!item.recruiterOnly) return true;
    if (!mounted) return false;
    const role = (user?.role || '').toLowerCase().trim();
    return role.includes('recruit') || role === 'admin';
  });

  const sidebarClasses = `
    flex flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 backdrop-blur-xl h-full transition-all duration-300 ease-in-out
    ${isMobile ? "fixed inset-y-0 left-0 z-40 shadow-2xl" : "relative"}
    ${open ? "w-64" : "w-24"}
    ${!open && isMobile ? "-translate-x-full" : "translate-x-0"}
  `;

  return (
    <aside className={sidebarClasses}>
      {/* Logo Section */}
      <div
        className={`h-16 relative flex items-center border-b border-slate-100 dark:border-slate-700 ${open ? "justify-between px-4" : "justify-between px-2"
          }`}
      >
        <Link
          href="/"
          className={`flex items-center overflow-hidden ${open ? "gap-3" : "justify-center w-10 flex-shrink-0"}`}
        >
          <div className="min-w-[40px] w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-bold text-lg">SH</span>
          </div>

          {open && (
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
              SmartHire
            </h2>
          )}
        </Link>

        {!isMobile && (
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-medium"
                : "text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
            >
              <span className={`text-xl transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                {item.icon}
              </span>

              <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"}`}>
                {item.label}
              </span>

              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile / Bottom Section */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
        <button
          onClick={toggleTheme}
          className={`mb-4 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition ${open ? "flex items-center justify-between" : "flex items-center justify-center"}`}
        >
          {open ? (
            <>
              <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
              <span>{theme === "dark" ? "🌙" : "☀️"}</span>
            </>
          ) : (
            <span>{theme === "dark" ? "🌙" : "☀️"}</span>
          )}
        </button>

        <div className={`flex items-center gap-3 transition-all duration-300 ${open ? "justify-start" : "justify-center"}`}>
          {mounted ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-800">
              {user?.fullName?.charAt(0) || "U"}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
          )}

          <div className={`overflow-hidden transition-all duration-300 ${open ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {mounted ? (user?.fullName || "Guest") : ""}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">
              {mounted ? (user?.role || "Candidate") : ""}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
