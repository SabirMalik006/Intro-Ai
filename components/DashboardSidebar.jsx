"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardSidebar({ open, toggle, isMobile }) {
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

  const sidebarClasses = `
    flex flex-col border-r border-slate-200 bg-white/80 backdrop-blur-xl h-full transition-all duration-300 ease-in-out
    ${isMobile ? "fixed inset-y-0 left-0 z-40 shadow-2xl" : "relative"}
    ${open ? "w-64" : "w-20"}
    ${!open && isMobile ? "-translate-x-full" : "translate-x-0"}
  `;

  return (
    <aside className={sidebarClasses}>
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="min-w-[40px] w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-bold text-lg">SH</span>
          </div>
          <div className={`transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 w-0"}`}>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              SmartHire
            </h2>
          </div>
        </Link>

        {!isMobile && (
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
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
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
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
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className={`flex items-center gap-3 transition-all duration-300 ${open ? "justify-start" : "justify-center"}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
            AJ
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${open ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            <h4 className="text-sm font-semibold text-slate-900 truncate">Alex Johnson</h4>
            <p className="text-xs text-slate-500 truncate">Recruiter Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
