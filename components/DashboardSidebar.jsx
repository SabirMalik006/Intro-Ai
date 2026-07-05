"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthStore from "../store/authStore";
import { useToast } from "../components/Toast";
import { logoutUser } from "../app/api/auth";

const icons = {
  Dashboard: { outline: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", solid: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  "Explore Jobs": { outline: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", solid: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  "Saved Jobs": { outline: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z", solid: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" },
  Interviews: { outline: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", solid: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  Candidates: { outline: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", solid: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  Analytics: { outline: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", solid: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  Reports: { outline: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", solid: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  Messages: { outline: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", solid: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  Settings: { outline: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", solid: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  Recruiter: { outline: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", solid: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  "Resume Analyzer": { outline: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", solid: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
};

const menuGroups = [
  {
    label: "Main",
    items: ["Dashboard", "Explore Jobs", "Saved Jobs", "Interviews"],
  },
  {
    label: "Management",
    items: ["Candidates", "Analytics", "Reports"],
  },
  {
    label: "Tools",
    items: ["Messages", "Settings", "Recruiter", "Resume Analyzer"],
  },
];

export default function DashboardSidebar({ open, toggle, isMobile }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("dark");
  const toast = useToast();
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
    { label: "Dashboard", href: "/dashboard", recruiterOnly: false },
    { label: "Explore Jobs", href: "/dashboard/explore-jobs", recruiterOnly: false },
    { label: "Saved Jobs", href: "/dashboard/saved-jobs", recruiterOnly: false },
    { label: "Interviews", href: "/dashboard/interviews", recruiterOnly: false },
    { label: "Candidates", href: "/dashboard/candidates", recruiterOnly: true },
    { label: "Analytics", href: "/dashboard/analytics", recruiterOnly: false },
    { label: "Reports", href: "/dashboard/reports", recruiterOnly: false },
    { label: "Messages", href: "/dashboard/messages", recruiterOnly: false },
    { label: "Settings", href: "/dashboard/settings", recruiterOnly: false },
    { label: "Recruiter", href: "/dashboard/recruiter", recruiterOnly: true },
    { label: "Resume Analyzer", href: "/dashboard/resume-analyzer", recruiterOnly: false },
  ].filter(item => {
    if (!item.recruiterOnly) return true;
    if (!mounted) return false;
    const role = (user?.role || '').toLowerCase().trim();
    return role.includes('recruit') || role === 'admin';
  });

  const Icon = ({ name, active }) => {
    const icon = icons[name];
    if (!icon) return null;
    return (
      <svg className={`w-5 h-5 ${active ? "text-indigo-600 dark:text-indigo-300" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"} transition-colors duration-200 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d={active ? (icon.solid || icon.outline) : icon.outline} />
      </svg>
    );
  };

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  const getItemGroup = (label) => {
    for (const group of menuGroups) {
      if (group.items.includes(label)) return group.label;
    }
    return null;
  };

  const groupedItems = {};
  menuItems.forEach(item => {
    const groupLabel = getItemGroup(item.label);
    if (!groupedItems[groupLabel]) groupedItems[groupLabel] = [];
    groupedItems[groupLabel].push(item);
  });

  return (
    <aside className={`
      flex flex-col h-full bg-white dark:bg-slate-900/95 border-r border-slate-200/70 dark:border-slate-700/50
      transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
      ${isMobile ? "fixed inset-y-0 left-0 z-40 shadow-2xl" : "relative"}
      ${open ? "w-64" : "w-[72px]"}
      ${!open && isMobile ? "-translate-x-full shadow-none" : "translate-x-0"}
    `}>
      {/* Logo Section */}
      <div className={`h-[68px] flex items-center border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0 ${open ? "justify-between px-5" : "justify-between px-2"}`}>
        <Link href="/" className={`flex items-center ${open ? "gap-2.5" : "gap-0"}`}>
          <img src="/Gemini_Generated_Image_dqsy35dqsy35dqsy.png" alt="SmartHire" className={`rounded-xl object-cover ring-1 ring-white/20 dark:ring-white/5 ${open ? "w-11 h-11" : "w-8 h-8"}`} />
          {open && (
            <div>
              <h2 className="text-base font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400">
                SmartHire
              </h2>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wide">AI Platform</p>
            </div>
          )}
        </Link>

        {!isMobile && (
          <button onClick={toggle} className={`${open ? "p-1.5 rounded-lg" : "p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"} text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-300 transition-all duration-200`}>
            <svg className={`${open ? "w-4 h-4" : "w-3.5 h-3.5"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {open ? <path d="M15 19l-7-7 7-7" /> : <path d="M9 5l7 7-7 7" />}
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-none">
        {Object.entries(groupedItems).map(([groupLabel, items]) => (
          <div key={groupLabel}>
            {open && (
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {groupLabel}
              </p>
            )}
            <div className="space-y-0.5">
              {items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`
                      group relative flex items-center gap-3 rounded-xl transition-all duration-200
                      ${open ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                      ${active
                        ? "bg-gradient-to-r from-indigo-50 to-indigo-50/50 dark:from-indigo-500/15 dark:to-indigo-500/5 text-indigo-700 dark:text-indigo-200 font-medium shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                      }
                    `}
                    title={!open ? item.label : undefined}
                  >
                    <Icon name={item.label} active={active} />

                    {open && (
                      <span className="text-sm whitespace-nowrap">{item.label}</span>
                    )}

                    {/* Active indicator */}
                    {active && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-l-full" />
                    )}

                    {/* Tooltip when collapsed */}
                    {!open && (
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                        {item.label}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 flex-shrink-0 space-y-2">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className={`
          w-full rounded-xl border border-slate-200 dark:border-slate-700/60
          bg-white dark:bg-slate-800/50
          text-sm font-medium text-slate-600 dark:text-slate-300
          hover:bg-slate-50 dark:hover:bg-slate-700/50
          transition-all duration-200
          ${open ? "flex items-center justify-between px-3.5 py-2.5" : "flex items-center justify-center px-0 py-2.5"}
        `}>
          {open ? (
            <>
              <span className="flex items-center gap-2">
                <span>{theme === "dark" ? "🌙" : "☀️"}</span>
                <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                {theme === "dark" ? "On" : "Off"}
              </span>
            </>
          ) : (
            <span className="text-lg">{theme === "dark" ? "🌙" : "☀️"}</span>
          )}
        </button>

        {/* User Profile */}
        <div className={`flex items-center ${open ? "gap-3 px-1" : "justify-center"}`}>
          {mounted ? (
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-800">
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          )}

          {open && (
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                {mounted ? (user?.fullName || "Guest User") : ""}
              </h4>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate capitalize">
                  {mounted ? (user?.role || "Candidate") : ""}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button onClick={async () => {
          try { await logoutUser(); } catch {}
          toast?.('Logged out successfully', 'success');
          useAuthStore.getState().logout();
        }} className={`
          w-full rounded-xl border border-red-100 dark:border-red-900/20
          bg-white dark:bg-red-950/10
          text-sm font-medium text-red-600 dark:text-red-400
          hover:bg-red-50 dark:hover:bg-red-950/30
          transition-all duration-200
          ${open ? "flex items-center justify-center gap-2 px-3.5 py-2.5" : "flex items-center justify-center px-0 py-2.5"}
        `}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
