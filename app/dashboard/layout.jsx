"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { ToastProvider } from "@/components/Toast";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsSidebarOpen(false);
      } else {
        setIsMobile(false);
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors">
      {/* Sidebar - Passed state and toggle function */}
      <DashboardSidebar
        open={isSidebarOpen}
        toggle={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen && !isMobile ? "ml-0" : "ml-0"
          }`}
      >
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {/* Mobile Header / Toggle (Visible only on small screens if sidebar is closed) */}
          {isMobile && !isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-900 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <ToastProvider>
            {children}
          </ToastProvider>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
