"use client";

import { useState, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

const toastTypes = {
  success: {
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    glow: "rgba(16,185,129,0.4)",
    icon: "✓",
  },
  error: {
    gradient: "linear-gradient(135deg, #dc2626, #ef4444)",
    glow: "rgba(239,68,68,0.4)",
    icon: "✕",
  },
};

function ToastItem({ t, onClose }) {
  const type = toastTypes[t.type] || toastTypes.success;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 400, damping: 22, mass: 0.6 }}
      whileHover={{ scale: 1.04 }}
      className="pointer-events-auto overflow-hidden rounded-full min-w-[280px] max-w-sm cursor-default shadow-lg"
      style={{
        background: type.gradient,
        boxShadow: `0 4px 25px ${type.glow}`,
      }}
    >
      <div className="flex items-center gap-2.5 px-4 py-3">
        <span className="text-white text-lg font-bold drop-shadow-md">
          {type.icon}
        </span>
        <span className="flex-1 text-sm font-semibold text-white/95 drop-shadow-sm">
          {t.message}
        </span>
        <button
          onClick={onClose}
          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white/60 hover:text-white hover:bg-white/20 transition-all"
        >
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
      <div className="fixed bottom-6 right-6 z-[99999] flex flex-col-reverse gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} t={t} onClose={() => hideToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
