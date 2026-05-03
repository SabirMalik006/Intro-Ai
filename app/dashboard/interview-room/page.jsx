"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  const aiCharacters = [
    { name: "Sarah", role: "Senior Recruiter", img: "/ai-1.png" },
    { name: "James", role: "Technical Lead", img: "/ai-2.png" },
  ];

  const [selectedAi, setSelectedAi] = useState(aiCharacters[0]);

  useEffect(() => {
    // Pick a random AI character on mount
    const randomAi = aiCharacters[Math.floor(Math.random() * aiCharacters.length)];
    setSelectedAi(randomAi);
  }, []);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const questions = [
    "Tell me about yourself and your professional background.",
    "What are your greatest strengths and how do they apply to this role?",
    "Describe a challenging project you worked on and how you handled it.",
    "Where do you see yourself in the next 5 years professionally?",
    "Why are you interested in this position with our company?",
    "How do you handle tight deadlines and pressure situations?",
    "What's your approach to working in a team environment?",
    "Do you have any questions for us about the role or company?"
  ];

  const aiResponses = {
    start: "Hello! I'm your AI interviewer for today. I'll be asking you a series of questions to better understand your skills and experience. Feel free to take your time with each answer. Are you ready to begin?",
    thinking: "That's interesting. Let me make a note of that...",
    good: "That's a great point! Thank you for sharing that.",
    proceed: "Excellent. Let's move on to the next question.",
    complete: "Thank you for your time today! Your responses have been recorded and will be reviewed. You'll receive feedback within 24 hours. Have a great day!"
  };

  const emojis = ["👏", "👍", "❤️", "🔥", "😊", "💡", "🎯", "⭐", "🤝", "💪"];

  const [chatMessages, setChatMessages] = useState([]);
  const maxQuestions = 5;

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
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
    }
  };

  // Speech Recognition Setup
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
        setMessage(currentTranscript);
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
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition not supported in this browser.");
      }
    }
  };

  // Handle initial AI message
  const startInterviewSession = () => {
    setInterviewStarted(true);
    setIsCameraOn(true);
    setIsPaused(false);
    setIsRecording(true);
    const startText = `${aiResponses.start} ${questions[0]}`;
    setChatMessages([
      { sender: "ai", text: startText, time: new Date().toLocaleTimeString() }
    ]);
    speakText(startText);
  };

  // Timer
  useEffect(() => {
    if (!interviewStarted) return;
    const interval = setInterval(() => {
      if (!isPaused) setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, interviewStarted]);

  // Camera stream management
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          },
          audio: false
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
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
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isCameraOn]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndInterview = () => {
    setShowEndModal(true);
  };

  const confirmEndInterview = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
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
    const offset = Math.floor(Math.random() * 120) - 60; // Random horizontal spread
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

    // Simulate AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: "I understand. Let's continue with the interview. Could you elaborate more on that point?", time: new Date().toLocaleTimeString() }
      ]);
    }, 1500);
  };

  const generateReport = () => {
    setInterviewReport({
      score: Math.floor(Math.random() * (95 - 75 + 1)) + 75,
      strengths: ["Clear communication", "Relevant experience", "Confidence"],
      areasForImprovement: ["Provide more specific examples", "Elaborate on technical skills"],
      summary: "The candidate demonstrated a strong understanding of the role requirements and communicated their experience effectively. However, deeper technical details could enhance their responses."
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < maxQuestions - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      const nextQ = questions[nextIndex];
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: nextQ, time: new Date().toLocaleTimeString() }
      ]);
      speakText(nextQ);
    } else {
      setIsInterviewComplete(true);
      setIsPaused(true);
      setIsRecording(false);
      const completeText = aiResponses.complete;
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: completeText, time: new Date().toLocaleTimeString() }
      ]);
      speakText(completeText);
      generateReport();
    }
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
                <button
                  onClick={confirmEndInterview}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-red-600/20"
                >
                  Yes, End Interview
                </button>
                <button
                  onClick={() => setShowEndModal(false)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all active:scale-[0.98]"
                >
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
            <p className="text-gray-500 text-xs">Senior Developer Position</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
            <span className="text-white font-mono text-sm">{formatTime(timer)}</span>
          </div>

          {/* Recording Indicator */}
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
        {/* LOBBY / START OVERLAY - Fixed to avoid collisions */}
        <AnimatePresence>
          {!interviewStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-[#0a0f18] flex items-center justify-center p-6"
            >
              {/* Background Glows */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

              <div className="max-w-xl w-full text-center relative z-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <div className="w-28 h-28 mx-auto bg-gradient-to-br from-teal-500 to-indigo-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-teal-500/20 rotate-3 border-4 border-white/10 overflow-hidden">
                    <img
                      src={selectedAi.img}
                      alt={selectedAi.name}
                      className="w-full h-full object-cover scale-110"
                    />
                  </div>
                  <h1 className="text-5xl font-black text-white mb-6 tracking-tight">Ready to <span className="text-teal-400">Excel?</span></h1>
                  <p className="text-gray-400 text-lg leading-relaxed font-medium">
                    Your AI interviewer, <span className="text-white font-bold">{selectedAi.name}</span>, is ready to start. Please ensure your surroundings are quiet.
                  </p>
                </motion.div>

                <div className="space-y-4">
                  <button
                    onClick={startInterviewSession}
                    className="w-full py-5 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-gray-900 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-teal-500/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    Enter Interview Room
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                    SECURE ENCRYPTED INTERVIEW SESSION
                  </p>
                </div>

                {/* Pre-check list */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 md:mt-16">
                  {[
                    { icon: "💡", text: "Lighting" },
                    { icon: "🔇", text: "Audio" },
                    { icon: "📶", text: "Network" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-[1.5rem] backdrop-blur-sm">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>
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
              {/* Background Character Image */}
              <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity">
                <img
                  src={selectedAi.img}
                  alt="AI Background"
                  className="w-full h-full object-cover blur-sm"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

              {/* AI Avatar */}
              <div className="relative z-10 text-center">
                <div className={`w-32 h-32 mx-auto rounded-[2.5rem] bg-gradient-to-br from-teal-500 to-indigo-600 p-1 flex items-center justify-center mb-6 shadow-2xl ${aiSpeaking ? 'ring-4 ring-teal-400/50' : ''}`}>
                  <div className="w-full h-full rounded-[2.3rem] overflow-hidden bg-gray-900 border-2 border-white/10">
                    <img
                      src={selectedAi.img}
                      alt={selectedAi.name}
                      className={`w-full h-full object-cover transition-transform duration-500 ${aiSpeaking ? 'scale-110' : 'scale-100'}`}
                    />
                  </div>
                </div>
                <h3 className="text-white font-black text-2xl tracking-tight">{selectedAi.name}</h3>
                <p className="text-teal-400 font-bold text-xs uppercase tracking-widest">{selectedAi.role}</p>
                {aiSpeaking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 flex items-center justify-center gap-1"
                  >
                    <div className="w-1 h-4 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-4 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-4 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </motion.div>
                )}
              </div>

              {/* AI Badge */}
              <div className="absolute top-4 left-4 bg-teal-500/20 border border-teal-500/30 px-3 py-1 rounded-full">
                <span className="text-teal-400 text-xs font-medium">AI Powered</span>
              </div>

              {/* Question Number */}
              <div className="absolute top-4 right-4 bg-gray-700/50 px-3 py-1 rounded-full">
                <span className="text-gray-300 text-xs">Q {currentQuestion + 1}/{questions.length}</span>
              </div>
            </motion.div>

            {/* Candidate Camera */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden"
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />

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

              {/* Name Tag */}
              <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur px-3 py-1.5 rounded-lg">
                <span className="text-white text-sm">You (Candidate)</span>
              </div>

              {/* Floating Reactions */}
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
            {/* Mic Button */}
            <button
              onClick={toggleMic}
              className={`p-3 md:p-4 rounded-2xl transition-all active:scale-90 ${isMicOn ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
              title={isMicOn ? 'Mute' : 'Unmute'}
            >
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

            {/* Camera Button */}
            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-3 md:p-4 rounded-2xl transition-all active:scale-90 ${isCameraOn ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
              title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Screen Share */}
            <button
              onClick={toggleScreenShare}
              className={`p-3 md:p-4 rounded-2xl transition-all active:scale-90 ${isScreenSharing ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 hover:bg-white/10 text-white'}`}
              title="Share Screen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10" />

            {/* Voice Input / Listening */}
            <button
              onClick={toggleListening}
              className={`p-4 rounded-2xl transition-all active:scale-90 ${isListening ? 'bg-teal-500 text-white animate-pulse shadow-lg shadow-teal-500/50' : 'bg-white/5 hover:bg-white/10 text-white'}`}
              title={isListening ? 'Stop Listening' : 'Speak Feedback'}
            >
              {isListening ? (
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                 </svg>
              ) : (
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                 </svg>
              )}
            </button>

            {/* Chat Toggle */}
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-3 md:p-4 rounded-2xl transition-all active:scale-90 ${showChat ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 hover:bg-white/10 text-white'}`}
              title="Chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            {/* Reactions */}
            <div className="relative">
              <button
                onClick={() => setShowEmojis(!showEmojis)}
                className={`p-3 md:p-4 rounded-2xl transition-all active:scale-90 ${showEmojis ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                title="Reactions"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* Emoji Picker */}
              <AnimatePresence>
                {showEmojis && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-600 rounded-[2rem] p-3 shadow-2xl z-50 overflow-hidden"
                  >
                    <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                    <div 
                      className="flex items-center gap-2 overflow-x-auto max-w-[320px] px-1 no-scrollbar"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => { handleReaction(emoji); setShowEmojis(false); }}
                          className="w-12 h-12 shrink-0 text-3xl hover:bg-gray-700 rounded-2xl transition-all hover:scale-110 flex items-center justify-center"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* End Call */}
            <button
              onClick={handleEndInterview}
              className="px-6 md:px-8 py-3 md:py-4 bg-red-600 hover:bg-red-700 text-white rounded-[1.5rem] font-black tracking-tight transition-all flex items-center gap-2 ml-0 md:ml-2 shadow-xl shadow-red-500/20 active:scale-95"
            >
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
              {/* Chat Header */}
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

              {/* Chat Messages */}
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
                      <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message or question..."
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-xl transition-all"
                  >
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

      {/* Bottom Question Prompt - Highlighted */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/90 backdrop-blur-xl border-t-4 border-teal-500 px-4 py-4 md:px-6 md:py-6 shadow-[0_-10px_30px_rgba(20,184,166,0.1)] relative z-10"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0 hidden md:flex">
             <span className="text-teal-400 font-black text-xl">Q{currentQuestion + 1}</span>
          </div>
          <div className="flex-1 w-full">
            <p className="text-teal-400 text-[10px] md:text-xs font-bold mb-1 uppercase tracking-widest">Current Question <span className="md:hidden ml-1">(Q{currentQuestion + 1})</span></p>
            <p className="text-white font-medium text-base md:text-lg leading-relaxed">{questions[currentQuestion]}</p>
          </div>
          <button
            onClick={handleNextQuestion}
            disabled={isInterviewComplete}
            className={`w-full md:w-auto px-6 md:px-8 py-3 md:py-4 ${isInterviewComplete ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white shadow-xl shadow-teal-500/20 active:scale-95'} rounded-2xl font-black transition-all flex items-center justify-center gap-3 shrink-0`}
          >
            {currentQuestion < maxQuestions - 1 ? 'Next Question' : 'Complete Interview'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </motion.div>
      
      {/* Interview Report Modal */}
      <AnimatePresence>
        {isInterviewComplete && interviewReport && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative w-full max-w-xl bg-gray-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
            >
               {/* decorative bg */}
               <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-teal-500/20 to-blue-600/20 blur-2xl" />
               
               <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-teal-500/40">
                     <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Interview Complete!</h2>
                  <p className="text-gray-400 text-sm mb-6">Here is your automated performance assessment.</p>
                  
                  <div className="w-full bg-gray-800/50 border border-white/5 rounded-2xl p-6 mb-6">
                     <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                        <div>
                           <h3 className="text-white font-bold text-lg mb-0.5">Overall Score</h3>
                           <p className="text-gray-500 text-xs">Based on your responses</p>
                        </div>
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                           {interviewReport.score}%
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                           <h4 className="text-teal-400 font-bold mb-2 uppercase tracking-widest text-[10px]">Key Strengths</h4>
                           <ul className="space-y-1.5">
                              {interviewReport.strengths.map((str, i) => (
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
                           <h4 className="text-blue-400 font-bold mb-2 uppercase tracking-widest text-[10px]">Areas for Improvement</h4>
                           <ul className="space-y-1.5">
                              {interviewReport.areasForImprovement.map((area, i) => (
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
                     
                     <div className="bg-gray-900/50 rounded-xl p-4 border border-white/5">
                        <p className="text-gray-400 text-xs italic leading-relaxed">
                           "{interviewReport.summary}"
                        </p>
                     </div>
                  </div>
                  
                  <button
                     onClick={() => router.push('/dashboard')}
                     className="px-8 py-3 bg-white text-gray-900 rounded-xl font-bold transition-all hover:bg-gray-200 active:scale-95"
                  >
                     Return to Dashboard
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}