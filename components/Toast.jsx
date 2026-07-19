"use client";

import { useState, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

const toastTypes = {
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    border: "border-emerald-200 dark:border-emerald-800/40",
    text: "text-emerald-700 dark:text-emerald-300",
    iconBg: "bg-emerald-500",
    icon: "✓",
    bar: "bg-emerald-500",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-900/30",
    border: "border-red-200 dark:border-red-800/40",
    text: "text-red-700 dark:text-red-300",
    iconBg: "bg-red-500",
    icon: "✕",
    bar: "bg-red-500",
  },
};

function ToastItem({ t, onClose }) {
  const type = toastTypes[t.type] || toastTypes.success;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 400, damping: 24, mass: 0.5 }}
      className={`pointer-events-auto overflow-hidden rounded-xl border ${type.border} ${type.bg} min-w-[300px] max-w-sm shadow-lg`}
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div className={`w-6 h-6 rounded-full ${type.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
          <span className="text-white text-xs font-black">{type.icon}</span>
        </div>
        <span className={`flex-1 text-sm font-semibold ${type.text}`}>
          {t.message}
        </span>
        <button onClick={onClose} className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${type.text} opacity-50 hover:opacity-100 hover:bg-white/50 dark:hover:bg-white/10 transition-all`}>
          ✕
        </button>
      </div>
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-24 right-6 z-[99999] flex flex-col-reverse gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} t={t} onClose={() => hideToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
