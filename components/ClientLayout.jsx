"use client";

import { ToastProvider } from "@/components/Toast";

export default function ClientLayout({ children }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
