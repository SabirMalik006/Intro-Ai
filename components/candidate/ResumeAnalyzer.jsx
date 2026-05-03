"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';

const ScoreRing = ({ score, label, size = "large" }) => {
  const radius = size === "large" ? 50 : 40;
  const stroke = size === "large" ? 6 : 4;
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
          <span className={`font-black ${size === "large" ? "text-2xl" : "text-xl"} ${color}`}>
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
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-xl">
          {icon}
        </div>
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{label}</h4>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
        score >= 80 ? 'bg-emerald-50 text-emerald-600' : 
        score >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
      }`}>
        {score}/100
      </span>
    </div>
    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
      <motion.div 
        initial={{ width: 0 }} 
        whileInView={{ width: `${score}%` }} 
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className={`h-full ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
      />
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">"{feedback}"</p>
  </motion.div>
);

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
          className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
        >
          <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-lg
            ${type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}
          `}>
            {type === 'success' ? '✅' : '❌'}
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">{message}</p>
          <button 
            onClick={onClose}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-transform active:scale-95
              ${type === 'success' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'}
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
      console.log("🎨 Capturing report with modern-screenshot...");
      
      const { domToPng } = await import('modern-screenshot');
      const jsPDF = (await import('jspdf')).jsPDF;

      const dataUrl = await domToPng(reportRef.current, {
        scale: 2,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#020617' : '#f8fafc',
        style: {
          borderRadius: '0' // Better for PDF
        }
      });

      console.log("📸 Image captured, creating PDF...");
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Calculate height to maintain aspect ratio
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
        <div className="max-w-md w-full text-center">
          <motion.div 
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-2xl shadow-indigo-500/40 mb-8"
          >
            🧠
          </motion.div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{progress}%</h2>
          <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-6 animate-pulse">{loadingStage}</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-600 to-violet-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
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

      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            AI Resume Analyzer
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-indigo-100 text-lg md:text-xl font-medium"
          >
            Get instant feedback on your resume and beat the ATS systems
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        {!report ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 md:p-12"
          >
            {/* UPLOAD ZONE */}
            <div 
              onClick={() => fileInputRef.current.click()}
              className="group border-3 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-3xl p-10 md:p-16 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.docx" />
              
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-lg mx-auto flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform"
              >
                📄
              </motion.div>
              
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-2">
                Drag & drop your resume here
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                or click to browse your files
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-500">PDF</span>
                <span className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-500">DOCX</span>
                <span className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-500">MAX 10MB</span>
              </div>
            </div>

            <AnimatePresence>
              {file && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                      {file.name.endsWith('.pdf') ? '📕' : '📘'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{file.name}</h4>
                      <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10">
              <button 
                onClick={analyzeResume}
                disabled={!file}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3
                  ${file 
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-[1.02] active:scale-95 shadow-indigo-500/25' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50'
                  }`}
              >
                {file ? 'Analyze My Resume 🚀' : 'Please Select a File'}
              </button>
            </div>
            
            {error && <p className="mt-4 text-center text-rose-500 font-bold">⚠️ {error}</p>}
          </motion.div>
        ) : (
          <div className="space-y-8" ref={reportRef}>
            {/* TOP CARDS */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* MAIN SCORE CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 flex flex-col md:flex-row items-center gap-10">
                <div className="shrink-0">
                  <ScoreRing score={report.overallScore} label="OVERALL" size="large" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Resume Score</h2>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Your resume performs better than 75% of applicants. Address the suggestions below to reach 90%+.
                  </p>
                </div>
              </div>

              {/* ATS SCORE CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 flex flex-col md:flex-row items-center gap-10">
                <div className="shrink-0">
                  <ScoreRing score={report.atsScore} label="ATS SCORE" size="large" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3 flex items-center justify-center md:justify-start gap-2">
                    <span className="text-3xl">🤖</span> ATS Check
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed italic font-medium">
                    "{report.atsFeedback}"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* SECTION SCORES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SectionCard label="Contact Info" score={report.sections.contactInfo.score} feedback={report.sections.contactInfo.feedback} icon="📇" />
              <SectionCard label="Professional Summary" score={report.sections.summary.score} feedback={report.sections.summary.feedback} icon="📝" />
              <SectionCard label="Work Experience" score={report.sections.experience.score} feedback={report.sections.experience.feedback} icon="💼" />
              <SectionCard label="Education" score={report.sections.education.score} feedback={report.sections.education.feedback} icon="🎓" />
              <SectionCard label="Skills" score={report.sections.skills.score} feedback={report.sections.skills.feedback} icon="🛠️" />
              <SectionCard label="Formatting" score={report.sections.formatting.score} feedback={report.sections.formatting.feedback} icon="📐" />
            </div>

            {/* STRENGTHS & AREAS TO IMPROVE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 rounded-[2rem] p-8">
                <h4 className="text-emerald-700 dark:text-emerald-400 font-black mb-6 flex items-center gap-3 text-xl">
                  <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-black">✓</span>
                  Key Strengths
                </h4>
                <ul className="space-y-4">
                  {report.strengthPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-emerald-900 dark:text-emerald-200 font-bold text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/50 rounded-[2rem] p-8">
                <h4 className="text-rose-700 dark:text-rose-400 font-black mb-6 flex items-center gap-3 text-xl">
                  <span className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white text-sm font-black">!</span>
                  Areas to Improve
                </h4>
                <ul className="space-y-4">
                  {report.improvementAreas.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-rose-900 dark:text-rose-200 font-bold text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col md:flex-row gap-6 pt-10 no-print">
              <button 
                onClick={reset}
                className="flex-1 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-transform"
              >
                Analyze Another Resume 🔄
              </button>
              <button 
                onClick={downloadReport}
                disabled={downloading}
                className={`flex-1 py-6 rounded-2xl font-black text-lg shadow-xl transition-all hover:scale-[1.02] 
                  ${downloading 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-500/25'
                  }`}
              >
                {downloading ? 'Generating PDF... ⏳' : 'Download PDF Report ⬇️'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
