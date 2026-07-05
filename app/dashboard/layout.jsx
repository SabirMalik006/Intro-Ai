"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import useAuthStore from "@/store/authStore";
import { ToastProvider, useToast } from "@/components/Toast";

const recruiterOnlyPaths = ['/dashboard/candidates', '/dashboard/recruiter', '/dashboard/candidate'];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const { user, fetchMe, loading } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const welcomed = useRef(false);

  useEffect(() => {
    if ((!user && initialLoad) || (!user && !initialLoad)) {
      fetchMe().then((res) => {
        if (res.success && !welcomed.current) {
          welcomed.current = true;
          const name = res.user?.fullName || 'there';
          toast(`Welcome, ${name}!`, 'success');
        }
      }).finally(() => setInitialLoad(false));
    } else if (user) {
      setInitialLoad(false);
    }
  }, []);

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

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ─── Route Guard ───
  useEffect(() => {
    if (!user) return;
    const role = (user.role || '').toLowerCase().trim();
    const isRecruiter = role.includes('recruit') || role === 'admin';
    const isRestricted = recruiterOnlyPaths.some(p => pathname.startsWith(p));

    if (isRestricted && !isRecruiter) {
      router.replace('/dashboard');
    } else {
      setAuthorized(true);
    }
  }, [user, pathname, router]);

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
            {authorized ? children : (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <div className="w-14 h-14 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">Checking access...</p>
                </div>
              </div>
            )}
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
