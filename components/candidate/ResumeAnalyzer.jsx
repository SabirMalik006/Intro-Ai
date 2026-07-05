"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';
import { Upload, FileText, Download, RotateCcw, Loader2, CheckCircle2, AlertTriangle, Sparkles, Brain, ChevronRight, BarChart3, Target, TrendingUp, Award } from 'lucide-react';

const ScoreRing = ({ score, label, size = "large" }) => {
  const radius = size === "large" ? 52 : 40;
  const stroke = size === "large" ? 7 : 5;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color = score >= 71 ? "text-emerald-500" : score >= 41 ? "text-amber-500" : "text-rose-500";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <motion.circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={color}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-black ${size === "large" ? "text-3xl" : "text-xl"} ${color}`}>
            {score}%
          </span>
        </div>
      </div>
      <span className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    </div>
  );
};

const SectionCard = ({ label, score, feedback, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:shadow-blue-500/5 transition-all"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-lg">
          {icon}
        </div>
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{label}</h4>
      </div>
      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
        score >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
        score >= 50 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
      }`}>
        {score}/100
      </span>
    </div>
    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2.5">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${score}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
      />
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">"{feedback}"</p>
  </motion.div>
);

const AtsGauge = ({ score }) => {
  const color = score >= 80 ? 'from-emerald-500 to-emerald-400' : score >= 60 ? 'from-blue-500 to-cyan-400' : score >= 40 ? 'from-amber-500 to-amber-400' : 'from-rose-500 to-rose-400';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ATS Compatibility</span>
        <span className="text-lg font-black text-slate-800 dark:text-white">{score}%</span>
      </div>
      <div className="relative h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className={`h-full rounded-full bg-gradient-to-r ${color} shadow-sm`}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-slate-200 rounded-full shadow-md border-2 border-blue-500"
          style={{ left: `calc(${score}% - 10px)` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        {[
          { label: 'Poor', val: 0 },
          { label: 'Fair', val: 25 },
          { label: 'Good', val: 50 },
          { label: 'Great', val: 75 },
          { label: 'Excel', val: 90 },
        ].map((m) => (
          <span key={m.label} className={`text-[10px] font-bold ${score >= m.val ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const PercentileChart = ({ percentile }) => {
  const pct = percentile || 75;
  const position = 100 - pct;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Percentile Ranking</span>
        <span className="text-lg font-black text-slate-800 dark:text-white">{pct}th</span>
      </div>
      <div className="relative h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
        <div className="absolute inset-0 flex">
          {[0, 20, 40, 60, 80].map((band) => (
            <div key={band} className="flex-1 border-r border-white/30 dark:border-slate-700/30 last:border-0" />
          ))}
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.7, type: "spring", stiffness: 300 }}
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-200 shadow-lg border-2 border-blue-500 flex items-center justify-center"
          style={{ left: `calc(${pct}% - 16px)` }}
        >
          <span className="text-[8px] font-black text-blue-600">YOU</span>
        </motion.div>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-400 font-medium">0th</span>
        <span className="text-[10px] text-slate-400 font-medium">25th</span>
        <span className="text-[10px] text-slate-400 font-medium">50th</span>
        <span className="text-[10px] text-slate-400 font-medium">75th</span>
        <span className="text-[10px] text-slate-400 font-medium">100th</span>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 text-center"
      >
        {pct >= 90 ? 'You\'re in the top 10% of candidates!' :
         pct >= 75 ? 'You\'re in the top 25% of candidates!' :
         pct >= 50 ? 'You\'re above average!' :
         pct >= 25 ? 'You\'re in the middle range.' :
         'Focus on improving your resume.'}
      </motion.p>
    </div>
  );
};

const SectionBarChart = ({ sections }) => {
  const data = [
    { label: 'Contact', score: sections.contactInfo.score },
    { label: 'Summary', score: sections.summary.score },
    { label: 'Experience', score: sections.experience.score },
    { label: 'Education', score: sections.education.score },
    { label: 'Skills', score: sections.skills.score },
    { label: 'Formatting', score: sections.formatting.score },
  ];

  return (
    <div className="space-y-2.5">
      {data.map((item, i) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-20 text-[10px] font-bold text-slate-500 dark:text-slate-400 text-right shrink-0">{item.label}</span>
          <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.score}%` }}
              transition={{ duration: 0.8, delay: 0.1 * i, ease: "easeOut" }}
              className={`h-full rounded-lg ${
                item.score >= 80 ? 'bg-emerald-500' :
                item.score >= 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                'bg-amber-500'
              }`}
            />
          </div>
          <span className={`w-8 text-xs font-black text-right ${
            item.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
            item.score >= 50 ? 'text-blue-600 dark:text-blue-400' :
            'text-amber-600 dark:text-amber-400'
          }`}>{item.score}</span>
        </div>
      ))}
    </div>
  );
};

const NotificationModal = ({ isOpen, onClose, title, message, type = "success" }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
        >
          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-lg
            ${type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500'}
          `}>
            {type === 'success' ? <CheckCircle2 className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium text-sm leading-relaxed">{message}</p>
          <button
            onClick={onClose}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-transform active:scale-95 text-sm
              ${type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/20' : 'bg-gradient-to-r from-rose-500 to-rose-600 shadow-rose-500/20'}
            `}
          >
            Got it!
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState("");
  const fileInputRef = useRef(null);
  const reportRef = useRef(null);

  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "success" });

  const stages = [
    "Uploading your resume...",
    "Reading document...",
    "Analyzing experience & skills...",
    "Checking ATS compatibility...",
    "Generating your report..."
  ];

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const reportId = searchParams?.get('id');

  useEffect(() => {
    if (reportId) {
      loadExistingReport(reportId);
    }
  }, [reportId]);

  const loadExistingReport = async (id) => {
    try {
      setLoading(true);
      setLoadingStage("Fetching your report...");
      const response = await api.get(`/resume/report/${id}`);
      setReport(response.data.data.analysisResult);
      setFile({ name: response.data.data.filename });
    } catch (err) {
      setError("Failed to load existing report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (loading) {
      let currentProgress = 0;
      let stageIndex = 0;
      setLoadingStage(stages[0]);

      interval = setInterval(() => {
        currentProgress += Math.random() * 15;
        if (currentProgress > 100) currentProgress = 99;
        setProgress(Math.floor(currentProgress));

        const nextStageIndex = Math.floor((currentProgress / 100) * stages.length);
        if (nextStageIndex !== stageIndex && nextStageIndex < stages.length) {
          stageIndex = nextStageIndex;
          setLoadingStage(stages[stageIndex]);
        }
      }, 400);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setError(null);
  };

  const analyzeResume = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setTimeout(() => {
        setReport(response.data.data.analysisResult);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Processing failed. Please try again.');
      setLoading(false);
    }
  };

  const [downloading, setDownloading] = useState(false);

  const downloadReport = async () => {
    if (!reportRef.current) return;
    try {
      setDownloading(true);

      const { domToPng } = await import('modern-screenshot');
      const jsPDF = (await import('jspdf')).jsPDF;

      const dataUrl = await domToPng(reportRef.current, {
        scale: 2,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#020617' : '#f8fafc',
        style: {
          borderRadius: '0'
        }
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();

      const img = new Image();
      img.src = dataUrl;
      await new Promise(resolve => img.onload = resolve);
      const pdfHeight = (img.height * pdfWidth) / img.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Resume_Analysis_${file?.name.split('.')[0] || 'Report'}.pdf`);

      setModal({
        isOpen: true,
        title: "Success!",
        message: "Your premium resume report has been downloaded.",
        type: "success"
      });
    } catch (err) {
      console.error("PDF Export Error:", err);
      setModal({
        isOpen: true,
        title: "Download Issue",
        message: "We're having trouble capturing the styles. Please try refreshing or using a different browser.",
        type: "error"
      });
    } finally {
      setDownloading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setReport(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-6"
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          <p className="text-lg font-black text-slate-900 dark:text-white mb-1">{progress}%</p>
          <p className="text-blue-600 dark:text-blue-400 font-bold text-sm mb-5">{loadingStage}</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {stages.map((s, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
                i <= Math.floor((progress / 100) * stages.length)
                  ? 'bg-blue-500'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <NotificationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      {/* HEADER */}
      <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 lg:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan-400/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold text-blue-200 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              AI Analysis
            </div>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-1">Resume Analyzer</h1>
          <p className="text-blue-200 text-sm font-medium">Get instant AI-powered feedback and beat the ATS systems</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {!report ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden"
          >
            <div className="p-6 lg:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Upload Your Resume</h2>
                  <p className="text-sm text-slate-400 font-medium">Upload your resume for a comprehensive ATS analysis</p>
                </div>
              </div>

              {/* UPLOAD ZONE */}
              <div
                onClick={() => fileInputRef.current.click()}
                className="group border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-10 md:p-14 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/30 hover:bg-blue-50/30 dark:hover:bg-blue-900/10"
              >
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.docx" />

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg mx-auto flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                >
                  <Upload className="w-7 h-7 text-blue-500" />
                </motion.div>

                <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-1.5">
                  Drag & drop your resume here
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  or click to browse your files
                </p>

                <div className="flex flex-wrap justify-center gap-2.5">
                  <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-500">PDF</span>
                  <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-500">DOCX</span>
                  <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-500">MAX 10MB</span>
                </div>
              </div>

              <AnimatePresence>
                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mt-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-lg shadow-sm">
                        {file.name?.endsWith('.pdf') ? '📕' : '📘'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{file.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={() => setFile(null)} className="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                      <span className="text-lg leading-none">✕</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6">
                <button
                  onClick={analyzeResume}
                  disabled={!file}
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2.5
                    ${file
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 active:scale-[0.97] shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50'
                    }`}
                >
                  {file ? (
                    <><Brain className="w-5 h-5" /> Analyze My Resume</>
                  ) : (
                    'Select a File to Analyze'
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/50 rounded-xl flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{error}</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6" ref={reportRef}>
            {/* SCORE OVERVIEW */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              <div className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="shrink-0">
                    <ScoreRing score={report.overallScore} label="OVERALL SCORE" size="large" />
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">
                      {report.overallScore >= 80 ? 'Excellent Resume!'
                        : report.overallScore >= 60 ? 'Good Foundation'
                        : report.overallScore >= 40 ? 'Needs Improvement'
                        : 'Major Changes Needed'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      {report.overallScore >= 80
                        ? 'Your resume is well-optimized for ATS systems. Minor tweaks can push it to perfection.'
                        : report.overallScore >= 60
                        ? 'You have a solid base. Address the suggestions below to significantly boost your score.'
                        : 'Your resume needs substantial improvements to pass ATS filters. Follow the recommendations below.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-4 justify-center lg:justify-start">
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-blue-500" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">ATS Score: <span className="text-blue-600 dark:text-blue-400">{report.atsScore}%</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BarChart3 className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">Top 25% percentile</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <AtsGauge score={report.atsScore} />
                  <PercentileChart percentile={75} />
                </div>
                {report.atsFeedback && (
                  <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">"{report.atsFeedback}"</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* SECTION SCORES */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Section Breakdown</h3>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 mb-5">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Quick Comparison</h4>
                <SectionBarChart sections={report.sections} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <SectionCard label="Contact Info" score={report.sections.contactInfo.score} feedback={report.sections.contactInfo.feedback} icon="📇" />
                <SectionCard label="Professional Summary" score={report.sections.summary.score} feedback={report.sections.summary.feedback} icon="📝" />
                <SectionCard label="Work Experience" score={report.sections.experience.score} feedback={report.sections.experience.feedback} icon="💼" />
                <SectionCard label="Education" score={report.sections.education.score} feedback={report.sections.education.feedback} icon="🎓" />
                <SectionCard label="Skills" score={report.sections.skills.score} feedback={report.sections.skills.feedback} icon="🛠️" />
                <SectionCard label="Formatting" score={report.sections.formatting.score} feedback={report.sections.formatting.feedback} icon="📐" />
              </div>
            </motion.div>

            {/* STRENGTHS & IMPROVEMENTS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="p-6">
                  <h4 className="font-extrabold text-slate-800 dark:text-white mb-4 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    Key Strengths
                  </h4>
                  <ul className="space-y-3">
                    {report.strengthPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="p-6">
                  <h4 className="font-extrabold text-slate-800 dark:text-white mb-4 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    Areas to Improve
                  </h4>
                  <ul className="space-y-3">
                    {report.improvementAreas.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* ACTIONS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <button
                onClick={reset}
                className="flex-1 inline-flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.97] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Analyze Another Resume
              </button>
              <button
                onClick={downloadReport}
                disabled={downloading}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-[0.97]
                  ${downloading
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/20'
                  }`}
              >
                {downloading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...</>
                ) : (
                  <><Download className="w-4 h-4" /> Download PDF Report</>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
