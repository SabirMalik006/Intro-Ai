"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from '@/services/api';

export default function InterviewRoom() {
  const router = useRouter();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [interviewReport, setInterviewReport] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [showReaction, setShowReaction] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const chatEndRef = useRef(null);

  // New state for AI integration
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [evaluations, setEvaluations] = useState([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiStatusText, setAiStatusText] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [showSetup, setShowSetup] = useState(true);
  const [interviewPhase, setInterviewPhase] = useState("setup"); // setup | answering | evaluating | report
  const [isAiMuted, setIsAiMuted] = useState(false);

  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('assignment');

  const aiCharacters = [
    { name: "Sarah", role: "Senior Recruiter", img: "/ai-1.png" },
    { name: "James", role: "Technical Lead", img: "/ai-2.png" },
  ];

  const [selectedAi, setSelectedAi] = useState(aiCharacters[0]);

  useEffect(() => {
    const randomAi = aiCharacters[Math.floor(Math.random() * aiCharacters.length)];
    setSelectedAi(randomAi);
  }, []);

  // ─── ASSIGNMENT-BASED INTERVIEW ───
  useEffect(() => {
    if (!assignmentId) return;

    const initAssignment = async () => {
      setIsLoadingAI(true);
      setAiStatusText("Loading your interview...");
      try {
        // Fetch current interview state
        const fetchRes = await api.get(`/interviews/${assignmentId}`);
        const interview = fetchRes.data.data.interview;

        if (interview.status === 'pending') {
          // Start the interview
          await api.put(`/interviews/${assignmentId}/start`);
        } else if (interview.status !== 'in-progress') {
          throw new Error('Interview cannot be started from current state');
        }

        setJobRole(interview.jobRole);
        setQuestions(interview.questions);

        // Restore previous answers if any
        if (interview.answers?.length > 0) {
          const restoredEvals = interview.answers.map(a => ({
            question: a.question,
            answer: a.answer,
            score: a.score,
            feedback: a.feedback,
            strength: a.strength,
            improvement: a.improvement,
          }));
          setEvaluations(restoredEvals);
          setCurrentQuestion(interview.answers.length);
          // Don't restore the last answer text since it's already submitted
        }

        setInterviewStarted(true);
        setIsCameraOn(true);
        setIsPaused(false);
        setIsRecording(true);
        setShowSetup(false);
        setInterviewPhase("answering");

        const qIdx = interview.answers?.length || 0;
        const firstQ = interview.questions[qIdx]?.question || '';
        setChatMessages([{
          sender: "ai",
          text: `Welcome back! I'm ${selectedAi.name}, your AI interviewer for the ${interview.jobRole} position. ${firstQ ? `Let's continue with the next question.\n\n${firstQ}` : 'All questions have been answered. Let me generate your final report.'}`,
          time: new Date().toLocaleTimeString()
        }]);
        if (firstQ) speakText(`Welcome back! ${firstQ}`);

        // If all questions already answered, skip to report
        if (qIdx >= (interview.questions?.length || 0)) {
          setIsInterviewComplete(true);
          setIsPaused(true);
          setIsRecording(false);
          if (interview.report) {
            setInterviewReport(interview.report);
            setInterviewPhase("report");
          } else {
            setInterviewPhase("evaluating");
            generateFinalReport();
          }
        }
      } catch (err) {
        console.error('Failed to start assigned interview:', err);
        setAiStatusText("Failed to load interview. Please try again.");
      } finally {
        setIsLoadingAI(false);
        setAiStatusText("");
      }
    };
    initAssignment();
  }, [assignmentId]);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const emojis = ["👏", "👍", "❤️", "🔥", "😊", "💡", "🎯", "⭐", "🤝", "💪"];

  const [chatMessages, setChatMessages] = useState([]);

  const speakText = (text) => {
    if (!('speechSynthesis' in window) || isAiMuted) return;
    window.speechSynthesis.cancel();

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v =>
        v.lang.startsWith('en') &&
        (selectedAi.name === 'Sarah' ? (v.name.includes('Female') || v.gender === 'female') : (v.name.includes('Male') || v.gender === 'male'))
      ) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.onstart = () => setAiSpeaking(true);
      utterance.onend = () => setAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      speak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        speak();
      };
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setCurrentAnswer(currentTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition not supported in this browser.");
      }
    }
  };

  // ─── AI INTERVIEW FLOW ───

  const startInterviewSession = async () => {
    if (!jobRole.trim()) return;

    // Warm up speech synthesis in user gesture
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(u);
      window.speechSynthesis.cancel();
    }

    // Request camera permission in user gesture (test stream, stop immediately)
    try {
      const testStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false
      });
      testStream.getTracks().forEach(t => t.stop());
    } catch (err) {
      console.error("Camera permission denied:", err);
    }

    setIsLoadingAI(true);
    setAiStatusText("AI is preparing your interview questions...");
    setInterviewPhase("answering");

    try {
      const response = await api.post('/ai/interview/generate-questions', {
        jobRole: jobRole.trim(),
        jobDescription: jobDescription.trim(),
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      });

      if (response.data.success) {
        setQuestions(response.data.data);
        setInterviewStarted(true);
        setIsCameraOn(true);
        setIsPaused(false);
        setIsRecording(true);
        setShowSetup(false);

        const firstQ = response.data.data[0].question;
        setChatMessages([
          { sender: "ai", text: `Hello! I'm ${selectedAi.name}, your AI interviewer for the ${jobRole} position. Let's begin with the first question.\n\n${firstQ}`, time: new Date().toLocaleTimeString() }
        ]);
        speakText(`Hello I'm ${selectedAi.name}, your AI interviewer. Let's begin. ${firstQ}`);
      }
    } catch (error) {
      console.error("Failed to generate questions:", error);
    } finally {
      setIsLoadingAI(false);
      setAiStatusText("");
    }
  };

  const handleSubmitAnswer = async () => {
    const trimmed = currentAnswer.trim();

    if (trimmed.length < 10) {
      setAnswerError("Answer is too short. Please write at least 10 characters.");
      return;
    }
    if (trimmed.length > 3000) {
      setAnswerError("Answer is too long. Please keep it under 3000 characters.");
      return;
    }
    setAnswerError("");

    const questionObj = questions[currentQuestion];
    setChatMessages(prev => [
      ...prev,
      { sender: "user", text: trimmed, time: new Date().toLocaleTimeString() }
    ]);

    setIsLoadingAI(true);
    setAiStatusText("AI is evaluating your answer...");

    const submitAnswer = async () => {
      if (assignmentId) {
        // Assignment mode — use backend /interviews/:id/answer
        const res = await api.put(`/interviews/${assignmentId}/answer`, {
          questionId: questionObj.id || (currentQuestion + 1),
          answer: trimmed,
        });
        return res.data.data.evaluation;
      } else {
        // Self-practice mode — use old /ai/interview/evaluate-answer
        const evalRes = await api.post('/ai/interview/evaluate-answer', {
          question: questionObj.question,
          answer: trimmed,
          questionNumber: currentQuestion + 1,
          totalQuestions: questions.length,
        });
        if (evalRes.data.success) return evalRes.data.data;
        throw new Error('Evaluation failed');
      }
    };

    try {
      const evaluation = await submitAnswer();
      setEvaluations(prev => [...prev, {
        question: questionObj.question,
        answer: trimmed,
        ...evaluation,
      }]);

      setChatMessages(prev => [
        ...prev,
        { sender: "ai", text: `Good answer! Score: ${evaluation.score || evaluation.evaluation?.score}/100. ${evaluation.feedback || evaluation.evaluation?.feedback}`, time: new Date().toLocaleTimeString() }
      ]);

      if (currentQuestion < questions.length - 1) {
        const nextIdx = currentQuestion + 1;
        setCurrentQuestion(nextIdx);
        setCurrentAnswer("");
        const nextQ = questions[nextIdx].question;
        setTimeout(() => {
          setChatMessages(prev => [
            ...prev,
            { sender: "ai", text: nextQ, time: new Date().toLocaleTimeString() }
          ]);
          speakText(nextQ);
        }, 1500);
      } else {
        setIsInterviewComplete(true);
        setIsPaused(true);
        setIsRecording(false);
        setInterviewPhase("evaluating");
        generateFinalReport();
      }
    } catch (error) {
      console.error("Evaluation error:", error);
      setChatMessages(prev => [
        ...prev,
        { sender: "ai", text: "I had trouble evaluating that answer. Let's move to the next question.", time: new Date().toLocaleTimeString() }
      ]);

      setEvaluations(prev => [...prev, {
        question: questionObj.question,
        answer: trimmed,
        score: 65,
        feedback: "Your response was noted.",
        strength: "Answered the question",
        improvement: "Provide more detail next time",
      }]);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setCurrentAnswer("");
      } else {
        setIsInterviewComplete(true);
        setIsPaused(true);
        setIsRecording(false);
        setInterviewPhase("evaluating");
        generateFinalReport();
      }
    } finally {
      setIsLoadingAI(false);
      setAiStatusText("");
    }
  };

  const generateFinalReport = async () => {
    setIsLoadingAI(true);
    setAiStatusText("AI is generating your interview report...");

    try {
      if (assignmentId) {
        // Assignment mode — complete via backend
        const res = await api.put(`/interviews/${assignmentId}/complete`);
        const report = res.data.data.report;
        setInterviewReport(report);
        setInterviewPhase("report");
        const reportMsg = `Thank you for completing the interview! Your overall score is ${report.overallScore}%.`;
        setChatMessages(prev => [
          ...prev,
          { sender: "ai", text: reportMsg, time: new Date().toLocaleTimeString() }
        ]);
        speakText(reportMsg);
      } else {
        // Self-practice mode
        const response = await api.post('/ai/interview/generate-report', {
          answers: evaluations,
          jobRole: jobRole.trim(),
        });
        if (response.data.success) {
          setInterviewReport(response.data.data);
          setInterviewPhase("report");
          const reportMsg = `Thank you for completing the interview! Your overall score is ${response.data.data.overallScore}%.`;
          setChatMessages(prev => [
            ...prev,
            { sender: "ai", text: reportMsg, time: new Date().toLocaleTimeString() }
          ]);
          speakText(reportMsg);
        }
      }
    } catch (error) {
      console.error("Report generation error:", error);
      const fallbackScore = Math.round(evaluations.reduce((s, e) => s + e.score, 0) / evaluations.length);
      setInterviewReport({
        overallScore: fallbackScore,
        strengths: ["Completed all questions", "Good participation"],
        areasForImprovement: ["Provide more detailed answers"],
        summary: "Interview completed. Thank you for your time.",
        recommendation: "Consider",
        suggestedRoles: [jobRole],
      });
      setInterviewPhase("report");
    } finally {
      setIsLoadingAI(false);
      setAiStatusText("");
    }
  };

  // Timer
  useEffect(() => {
    if (!interviewStarted) return;
    const interval = setInterval(() => {
      if (!isPaused) setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, interviewStarted]);

  // Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied:", err);
        setIsCameraOn(false);
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    if (isCameraOn) startCamera();
    else stopCamera();

    return () => {
      stopCamera();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isCameraOn]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndInterview = () => setShowEndModal(true);

  const confirmEndInterview = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(t => t.stop());
    router.push('/dashboard');
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        setIsScreenSharing(true);
        stream.getTracks()[0].onended = () => {
          setIsScreenSharing(false);
          screenStreamRef.current = null;
        };
      } catch (err) {
        console.error("Screen share error:", err);
      }
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      } else {
        setIsMicOn(!isMicOn);
      }
    } else {
      setIsMicOn(!isMicOn);
    }
  };

  const handleReaction = (emoji) => {
    const id = Date.now();
    const offset = Math.floor(Math.random() * 120) - 60;
    setReactions((prev) => [...prev, { id, emoji, offset }]);
    setShowReaction(emoji);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
      setShowReaction(null);
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: message, time: new Date().toLocaleTimeString() }
    ]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 flex flex-col">
      {/* End Interview Modal */}
      <AnimatePresence>
        {showEndModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowEndModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-gray-900 border border-white/10 rounded-[2.5rem] p-8 text-center shadow-2xl"
            >
              <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-3xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">End Interview?</h3>
              <p className="text-gray-400 mb-8 font-medium">
                Are you sure you want to leave the interview room? Your session progress will be saved.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={confirmEndInterview} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-red-600/20">
                  Yes, End Interview
                </button>
                <button onClick={() => setShowEndModal(false)} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all active:scale-[0.98]">
                  Stay in Room
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h2 className="text-white font-semibold">AI Interview Room</h2>
            <p className="text-gray-500 text-xs">{jobRole || 'Senior Developer Position'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
            <span className="text-white font-mono text-sm">{formatTime(timer)}</span>
          </div>
          {isRecording && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-xs font-medium">REC</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* SETUP OVERLAY - Job Role Input */}
        <AnimatePresence>
          {showSetup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-[#0a0f18] flex items-center justify-center p-6"
            >
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="max-w-lg w-full relative z-10"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-500 to-indigo-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-teal-500/20 rotate-3 border-4 border-white/10">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h1 className="text-4xl font-black text-white mb-3 tracking-tight">AI Mock Interview</h1>
                  <p className="text-gray-400">Enter the job role to get AI-generated interview questions tailored for you.</p>
                </div>

                <div className="bg-gray-800/50 border border-white/10 rounded-[2rem] p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Job Role *</label>
                    <input
                      type="text"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      placeholder="e.g. Full Stack Developer"
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Job Description (optional)</label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Brief description of the role..."
                      rows={2}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Your Skills (comma separated, optional)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. React, Node.js, Python"
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
                    />
                  </div>

                  {answerError && (
                    <p className="text-red-400 text-xs font-bold text-center">{answerError}</p>
                  )}

                  <button
                    onClick={startInterviewSession}
                    disabled={!jobRole.trim() || isLoadingAI}
                    className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
                      jobRole.trim() && !isLoadingAI
                        ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-xl shadow-teal-500/20 hover:scale-[1.01] active:scale-[0.98]'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isLoadingAI ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating Questions...</>
                    ) : (
                      <><span className="text-2xl">🚀</span> Start Interview</>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[
                    { icon: "🎤", text: "Voice Answers" },
                    { icon: "🤖", text: "AI Evaluation" },
                    { icon: "📊", text: "Detailed Report" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-[1.5rem] backdrop-blur-sm text-center">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.text}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CENTER - Main Interview Area */}
        <div className="flex-1 flex flex-col p-4 md:p-6">
          {/* Video Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* AI Interviewer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-gradient-to-br from-gray-900 to-indigo-950 rounded-[2rem] border border-white/5 overflow-hidden flex items-center justify-center group"
            >
              <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity">
                <img src={selectedAi.img} alt="AI Background" className="w-full h-full object-cover blur-sm" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

              <div className="relative z-10 text-center">
                <div className={`w-32 h-32 mx-auto rounded-[2.5rem] bg-gradient-to-br from-teal-500 to-indigo-600 p-1 flex items-center justify-center mb-6 shadow-2xl ${aiSpeaking ? 'ring-4 ring-teal-400/50' : ''}`}>
                  <div className="w-full h-full rounded-[2.3rem] overflow-hidden bg-gray-900 border-2 border-white/10">
                    <img src={selectedAi.img} alt={selectedAi.name} className={`w-full h-full object-cover transition-transform duration-500 ${aiSpeaking ? 'scale-110' : 'scale-100'}`} />
                  </div>
                </div>
                <h3 className="text-white font-black text-2xl tracking-tight">{selectedAi.name}</h3>
                <p className="text-teal-400 font-bold text-xs uppercase tracking-widest">{selectedAi.role}</p>
                {isLoadingAI && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
                    <div className="flex items-center justify-center gap-2 text-teal-400 text-xs font-medium">
                      <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                      {aiStatusText}
                    </div>
                  </motion.div>
                )}
                {aiSpeaking && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex items-center justify-center gap-1">
                    <div className="w-1 h-4 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-4 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-4 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </motion.div>
                )}
              </div>

              <div className="absolute top-4 left-4 bg-teal-500/20 border border-teal-500/30 px-3 py-1 rounded-full">
                <span className="text-teal-400 text-xs font-medium">AI Powered</span>
              </div>
              <div className="absolute top-4 right-4 bg-gray-700/50 px-3 py-1 rounded-full">
                <span className="text-gray-300 text-xs">Q {currentQuestion + 1}/{questions.length || 6}</span>
              </div>
            </motion.div>

            {/* Candidate Camera */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden"
            >
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              {!isCameraOn && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-gray-400">Camera Off</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur px-3 py-1.5 rounded-lg">
                <span className="text-white text-sm">You (Candidate)</span>
              </div>

              <AnimatePresence>
                {reactions.map((reaction) => (
                  <motion.div
                    key={reaction.id}
                    initial={{ opacity: 1, y: 0, scale: 0.5, x: reaction.offset }}
                    animate={{ opacity: 0, y: -150, scale: 1.5, x: reaction.offset + (Math.random() > 0.5 ? 20 : -20) }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    className="absolute bottom-20 left-1/2 text-5xl pointer-events-none"
                    style={{ marginLeft: '-1.5rem' }}
                  >
                    {reaction.emoji}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Controls Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-2 md:p-4 flex flex-wrap items-center justify-center gap-2 md:gap-4 shadow-2xl shadow-black/50"
          >
            <button onClick={toggleMic} className={`p-3 md:p-4 rounded-2xl transition-all active:scale-90 ${isMicOn ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`} title={isMicOn ? 'Mute' : 'Unmute'}>
              {isMicOn ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3zM3 3l18 18" />
                </svg>
              )}
            </button>

            <button onClick={() => setIsCameraOn(!isCameraOn)} className={`p-3 md:p-4 rounded-2xl transition-all active:scale-90 ${isCameraOn ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`} title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            <button onClick={toggleScreenShare} className={`p-3 md:p-4 rounded-2xl transition-all active:scale-90 ${isScreenSharing ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 hover:bg-white/10 text-white'}`} title="Share Screen">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>

            <button onClick={() => { setIsAiMuted(!isAiMuted); if (!isAiMuted && 'speechSynthesis' in window) window.speechSynthesis.cancel(); }} className={`p-3 md:p-4 rounded-2xl transition-all active:scale-90 ${isAiMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/5 hover:bg-white/10 text-white'}`} title={isAiMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}>
              {isAiMuted ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 010 14.14" />
                  <path d="M15.54 8.46a5 5 0 010 7.07" />
                </svg>
              )}
            </button>

            <div className="w-px h-8 bg-white/10" />

            <button onClick={toggleListening} className={`p-4 rounded-2xl transition-all active:scale-90 ${isListening ? 'bg-teal-500 text-white animate-pulse shadow-lg shadow-teal-500/50' : 'bg-white/5 hover:bg-white/10 text-white'}`} title={isListening ? 'Stop Listening' : 'Speak Answer'}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            <button onClick={() => setShowChat(!showChat)} className={`p-3 md:p-4 rounded-2xl transition-all active:scale-90 ${showChat ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 hover:bg-white/10 text-white'}`} title="Chat">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            <div className="relative">
              <button onClick={() => setShowEmojis(!showEmojis)} className={`p-3 md:p-4 rounded-2xl transition-all active:scale-90 ${showEmojis ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 hover:bg-white/10 text-white'}`} title="Reactions">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              <AnimatePresence>
                {showEmojis && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-600 rounded-[2rem] p-3 shadow-2xl z-50 overflow-hidden"
                  >
                    <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                    <div className="flex items-center gap-2 overflow-x-auto max-w-[320px] px-1 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      {emojis.map((emoji) => (
                        <button key={emoji} onClick={() => { handleReaction(emoji); setShowEmojis(false); }} className="w-12 h-12 shrink-0 text-3xl hover:bg-gray-700 rounded-2xl transition-all hover:scale-110 flex items-center justify-center">
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={handleEndInterview} className="px-6 md:px-8 py-3 md:py-4 bg-red-600 hover:bg-red-700 text-white rounded-[1.5rem] font-black tracking-tight transition-all flex items-center gap-2 ml-0 md:ml-2 shadow-xl shadow-red-500/20 active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
              Leave
            </button>
          </motion.div>
        </div>

        {/* RIGHT - Chat Panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: typeof window !== 'undefined' && window.innerWidth < 1024 ? '100%' : 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="absolute lg:relative right-0 top-0 h-full border-l border-gray-700 bg-gray-900/95 backdrop-blur-xl flex flex-col overflow-hidden z-40"
            >
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Interview Chat</h3>
                  <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-1">Transcript & notes</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: msg.sender === 'ai' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${msg.sender === 'ai' ? 'bg-gray-800' : 'bg-teal-600'} rounded-2xl px-4 py-3`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-400">
                          {msg.sender === 'ai' ? '🤖 AI Interviewer' : '👤 You'}
                        </span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-white text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  />
                  <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-xl transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom - Answer Input & Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/90 backdrop-blur-xl border-t-4 border-teal-500 px-4 py-4 md:px-6 md:py-6 shadow-[0_-10px_30px_rgba(20,184,166,0.1)] relative z-10"
      >
        {interviewPhase === "answering" && questions.length > 0 && !isInterviewComplete ? (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                <span className="text-teal-400 font-black text-sm">Q{currentQuestion + 1}</span>
              </div>
              <div className="flex-1">
                <p className="text-teal-400 text-[10px] font-bold uppercase tracking-widest">Current Question</p>
                <p className="text-white font-medium text-base md:text-lg leading-relaxed">
                  {questions[currentQuestion]?.question || "Loading question..."}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <textarea
                value={currentAnswer}
                onChange={(e) => { setCurrentAnswer(e.target.value); setAnswerError(""); }}
                placeholder="Type your answer here... (min 10 characters)"
                rows={2}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm resize-none"
                disabled={isLoadingAI}
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() || isLoadingAI}
                className={`px-6 py-3 rounded-2xl font-bold transition-all shrink-0 flex items-center gap-2 ${
                  currentAnswer.trim() && !isLoadingAI
                    ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoadingAI ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Evaluating</>
                ) : (
                  <><span>Submit Answer</span><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
                )}
              </button>
            </div>
            {answerError && (
              <p className="text-red-400 text-xs font-bold">{answerError}</p>
            )}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{currentAnswer.trim().length}/3000 characters</span>
            </div>
          </div>
        ) : isInterviewComplete && interviewPhase === "report" && interviewReport ? (
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-teal-400 font-bold text-lg">🎉 Interview Complete!</p>
            <p className="text-gray-300 mt-1">Your final report is ready. Close the chat to view it.</p>
          </div>
        ) : null}
      </motion.div>

      {/* Interview Report Modal */}
      <AnimatePresence>
        {isInterviewComplete && interviewReport && interviewPhase === "report" && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative w-full max-w-xl bg-gray-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-teal-500/20 to-blue-600/20 blur-2xl" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-teal-500/40">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Interview Complete!</h2>
                <p className="text-gray-400 text-sm mb-6">Here is your AI-generated performance assessment.</p>

                <div className="w-full bg-gray-800/50 border border-white/5 rounded-2xl p-6 mb-6">
                  {/* Score */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-0.5">Overall Score</h3>
                      <p className="text-gray-500 text-xs">Based on your {interviewReport.totalQuestions || evaluations.length} responses</p>
                    </div>
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                      {interviewReport.overallScore}%
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="flex justify-center mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                      interviewReport.recommendation === 'Strong Hire' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' :
                      interviewReport.recommendation === 'Hire' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      interviewReport.recommendation === 'Consider' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {interviewReport.recommendation}
                    </span>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-teal-400 font-bold mb-2 uppercase tracking-widest text-[10px]">Key Strengths</h4>
                      <ul className="space-y-1.5">
                        {interviewReport.strengths?.map((str, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            </div>
                            <span className="text-gray-300 text-xs leading-snug">{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-blue-400 font-bold mb-2 uppercase tracking-widest text-[10px]">Areas to Improve</h4>
                      <ul className="space-y-1.5">
                        {interviewReport.areasForImprovement?.map((area, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            </div>
                            <span className="text-gray-300 text-xs leading-snug">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Detailed Feedback */}
                  {interviewReport.detailedFeedback?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-gray-400 font-bold mb-2 uppercase tracking-widest text-[10px]">Question-wise Feedback</h4>
                      <div className="space-y-2">
                        {interviewReport.detailedFeedback.map((df, i) => (
                          <div key={i} className="bg-gray-900/50 rounded-xl p-3 border border-white/5">
                            <span className="text-teal-400 text-xs font-bold">Q{df.questionNumber}: </span>
                            <span className="text-gray-400 text-xs">{df.feedback}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-white/5">
                    <p className="text-gray-400 text-xs italic leading-relaxed">"{interviewReport.summary}"</p>
                  </div>

                  {/* Suggested Roles */}
                  {interviewReport.suggestedRoles?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {interviewReport.suggestedRoles.map((role, i) => (
                        <span key={i} className="text-[10px] font-bold px-3 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                          {role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 px-6 py-3 bg-white text-gray-900 rounded-xl font-bold transition-all hover:bg-gray-200 active:scale-95"
                  >
                    Return to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setShowSetup(true);
                      setInterviewStarted(false);
                      setInterviewPhase("setup");
                      setQuestions([]);
                      setCurrentQuestion(0);
                      setCurrentAnswer("");
                      setEvaluations([]);
                      setInterviewReport(null);
                      setIsInterviewComplete(false);
                      setChatMessages([]);
                      setTimer(0);
                      setIsPaused(true);
                      setIsRecording(false);
                      setJobRole("");
                      setJobDescription("");
                      setSkills("");
                    }}
                    className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold transition-all hover:bg-teal-500 active:scale-95"
                  >
                    Try Another Interview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}