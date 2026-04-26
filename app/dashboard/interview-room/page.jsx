"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function InterviewRoom() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [reactions, setReactions] = useState([]);
  const [showReaction, setShowReaction] = useState(null);
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);

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

  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: aiResponses.start, time: new Date().toLocaleTimeString() }
  ]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Camera stream
  useEffect(() => {
    if (isCameraOn && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => console.log("Camera access denied"));
    }
  }, [isCameraOn]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleReaction = (emoji) => {
    const id = Date.now();
    setReactions((prev) => [...prev, { id, emoji }]);
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

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setAiSpeaking(true);
      setTimeout(() => setAiSpeaking(false), 2000);
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: questions[currentQuestion + 1], time: new Date().toLocaleTimeString() }
      ]);
    } else {
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: aiResponses.complete, time: new Date().toLocaleTimeString() }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 flex flex-col">
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
      <div className="flex-1 flex">
        {/* CENTER - Main Interview Area */}
        <div className="flex-1 flex flex-col p-6">
          {/* Video Grid */}
          <div className="flex-1 grid grid-cols-2 gap-4 mb-4">
            {/* AI Interviewer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden flex items-center justify-center"
            >
              {/* AI Avatar */}
              <div className="text-center">
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center mb-4 ${aiSpeaking ? 'animate-pulse ring-4 ring-teal-400/50' : ''}`}>
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg">AI Interviewer</h3>
                <p className="text-teal-400 text-sm">Sarah - Senior Recruiter</p>
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
                    initial={{ opacity: 1, y: 0, scale: 0.5 }}
                    animate={{ opacity: 0, y: -100, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 text-4xl"
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
            className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 flex items-center justify-center gap-4"
          >
            {/* Mic Button */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-xl transition-all ${isMicOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
              title={isMicOn ? 'Mute' : 'Unmute'}
            >
              {isMicOn ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3zM3 3l18 18" />
                </svg>
              )}
            </button>

            {/* Camera Button */}
            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-3 rounded-xl transition-all ${isCameraOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
              title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Screen Share */}
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-xl transition-all ${isScreenSharing ? 'bg-teal-500/20 text-teal-400' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
              title="Share Screen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-600" />

            {/* Recording Button */}
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-3 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
              title={isRecording ? 'Stop Recording' : 'Start Recording'}
            >
              <div className="w-5 h-5 rounded-full border-2 border-current" />
            </button>

            {/* Chat Toggle */}
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-3 rounded-xl transition-all ${showChat ? 'bg-teal-500/20 text-teal-400' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
              title="Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            {/* Reactions */}
            <div className="relative">
              <button
                onClick={() => setShowEmojis(!showEmojis)}
                className="p-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-all"
                title="Reactions"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-600 rounded-2xl p-3 shadow-2xl"
                  >
                    <div className="grid grid-cols-5 gap-2">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => { handleReaction(emoji); setShowEmojis(false); }}
                          className="w-10 h-10 text-2xl hover:bg-gray-700 rounded-xl transition-all hover:scale-110 flex items-center justify-center"
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
            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 ml-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
              End Interview
            </button>
          </motion.div>
        </div>

        {/* RIGHT - Chat Panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-gray-700 bg-gray-900/50 backdrop-blur-xl flex flex-col overflow-hidden"
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

      {/* Bottom Question Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/90 backdrop-blur-xl border-t border-gray-700 px-6 py-4"
      >
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex-1">
            <p className="text-gray-400 text-xs mb-1">Current Question</p>
            <p className="text-white font-medium">{questions[currentQuestion]}</p>
          </div>
          <button
            onClick={handleNextQuestion}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
}