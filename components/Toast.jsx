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
  const isSave = msg.includes("saved") || msg.includes("bookmark") || msg.includes("applied") || msg.includes("submitted");
  const isRemove = msg.includes("removed") || msg.includes("unsave");
  const isError = type === "error";

  if (isSave || (!isRemove && !isError)) {
    return {
      icon: msg.includes("applied") ? <Send className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />,
      bg: "bg-emerald-600",
      text: "text-white",
      bar: "bg-emerald-300",
    };
  }
  return {
    icon: isRemove ? <BookmarkX className="w-4 h-4" /> : <XCircle className="w-4 h-4" />,
    bg: "bg-red-600",
    text: "text-white",
    bar: "bg-red-300",
  };
}

function ToastItem({ t, onClose }) {
  const meta = getToastMeta(t.message, t.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.6 }}
      className="pointer-events-auto overflow-hidden rounded-full shadow-lg border border-white/20 min-w-[280px] max-w-sm"
    >
      <div className={`relative ${meta.bg} ${meta.text}`}>
        <div className="flex items-center gap-2.5 px-4 py-2.5">
          <div className="shrink-0 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            {meta.icon}
          </div>
          <span className="text-xs font-bold flex-1 leading-tight">{t.message}</span>
          <button onClick={onClose} className="shrink-0 w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all">
            <X className="w-3 h-3" />
          </button>
        </div>
        <div className="h-0.5 bg-white/15">
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
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2.5 pointer-events-none items-center">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} t={t} onClose={() => hideToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
