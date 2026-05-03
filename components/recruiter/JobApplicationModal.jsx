"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Send, FileText, CheckCircle2, User, Mail, Phone, Info, ChevronLeft } from "lucide-react";

export default function JobApplicationModal({ job, isOpen, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 2) {
      setStep(2);
      return;
    }
    
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Apply for Job</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">
              {job?.title} at <span className="text-indigo-600">{job?.company}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl transition-all text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="px-8 flex gap-2 mb-6">
          <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 1 ? 'w-8 bg-indigo-600' : 'w-4 bg-slate-200 dark:bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 2 ? 'w-8 bg-indigo-600' : 'w-4 bg-slate-200 dark:bg-slate-800'}`} />
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-10">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      required
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Your Full Name"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email Address"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone Number"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="relative">
                  <textarea 
                    rows={3}
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    placeholder="Short cover letter (Optional)..."
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-sm resize-none"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="relative group">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className={`p-10 border-2 border-dashed rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/20 text-center transition-all ${
                    formData.resume ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-200 dark:border-slate-700 group-hover:border-indigo-500'
                  }`}>
                    {formData.resume ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-[1.25rem] flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-black text-slate-800 dark:text-white mb-1 truncate max-w-[200px]">{formData.resume.name}</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">File Ready to upload</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-[1.25rem] flex items-center justify-center text-slate-400 mb-4 shadow-xl shadow-slate-200/50 dark:shadow-none group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                          <Upload className="w-7 h-7" />
                        </div>
                        <p className="text-sm font-black text-slate-800 dark:text-white mb-1">Upload Resume</p>
                        <p className="text-xs text-slate-500 font-medium">PDF or Word (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border border-amber-100/50 dark:border-amber-800/50">
                  <Info className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    Please ensure your resume is up-to-date. Recruiters use this to evaluate your application.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Buttons */}
          <div className="mt-8 flex items-center gap-3">
            {step === 2 && (
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-2xl transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <button 
              type="submit"
              disabled={isSubmitting || (step === 2 && !formData.resume)}
              className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/25 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : step === 1 ? (
                <>
                  Continue
                  <ChevronLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Application
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
