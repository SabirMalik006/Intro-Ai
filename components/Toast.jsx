"use client";

import { useState, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Bookmark, BookmarkX, Send, X } from "lucide-react";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

function getToastMeta(message, type) {
  const msg = message.toLowerCase();
  const isError = type === "error";
  const isSave = msg.includes("saved") || msg.includes("bookmark") || msg.includes("applied") || msg.includes("submitted");
  const isRemove = msg.includes("removed") || msg.includes("unsave");

  if (isError || isRemove) {
    return {
      icon: isRemove ? <BookmarkX className="w-4 h-4" /> : <XCircle className="w-4 h-4" />,
      bg: "bg-red-50 border-red-200 text-red-800",
      iconBg: "bg-red-100",
      bar: "bg-red-400",
    };
  }
  return {
    icon: isSave ? (msg.includes("applied") ? <Send className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />) : <CheckCircle2 className="w-4 h-4" />,
    bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    iconBg: "bg-emerald-100",
    bar: "bg-emerald-400",
  };
}

function ToastItem({ t, onClose }) {
  const meta = getToastMeta(t.message, t.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 350, damping: 26, mass: 0.7 }}
      className="pointer-events-auto overflow-hidden rounded-xl shadow-lg border min-w-[300px] max-w-sm"
    >
      <div className={`relative border-l-4 ${meta.bg}`}>
        <div className="flex items-center gap-2.5 px-4 py-2.5">
          <div className={`shrink-0 w-7 h-7 rounded-lg ${meta.iconBg} flex items-center justify-center`}>
            {meta.icon}
          </div>
          <span className="text-xs font-bold flex-1 leading-tight">{t.message}</span>
          <button onClick={onClose} className={`shrink-0 w-5 h-5 rounded-lg ${meta.iconBg} hover:bg-white/80 flex items-center justify-center opacity-60 hover:opacity-100 transition-all`}>
            <X className="w-3 h-3" />
          </button>
        </div>
        <div className="h-0.5 bg-black/5">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3.2, ease: "linear" }}
            className={`h-full rounded-r-full ${meta.bar}`}
          />
        </div>
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
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} t={t} onClose={() => hideToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
