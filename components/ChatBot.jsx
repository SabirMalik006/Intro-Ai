'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles, Mic, Paperclip, MessageSquare, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import api from '@/services/api';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [dismissBubbles, setDismissBubbles] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    "What is SmartHire?",
    "How to apply for jobs?",
    "Can you help me with my resume?",
    "How does the hiring process work?"
  ];

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm your SmartHire AI partner. How can I help you today? ✨",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  // Show quick questions after a short delay when closed
  useEffect(() => {
    let timer;
    if (!isOpen && isMounted) {
      timer = setTimeout(() => setShowQuickQuestions(true), 2000);
    } else {
      setShowQuickQuestions(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen, isMounted]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickQuestion = async (question) => {
    setIsOpen(true);
    setShowQuickQuestions(false);
    
    const userMessage = {
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        messages: [{ role: 'assistant', content: "Hello! I'm your SmartHire AI partner. How can I help you today? ✨" }, userMessage]
      });

      if (response.data.success) {
        const aiResponse = {
          ...response.data.data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I am having trouble connecting to the server. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isMounted) {
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isOpen, isMounted, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
      });

      if (response.data.success) {
        const aiResponse = {
          ...response.data.data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I am having trouble connecting to the server. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat reset. How else can I help you? ✨",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="pointer-events-auto mb-4 flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.4)] dark:shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] border border-gray-100 dark:border-slate-800 overflow-hidden"
            style={{ 
              width: 'min(360px, 92vw)', 
              height: 'min(520px, 75vh)',
              maxHeight: '650px'
            }}
          >
            {/* Header - Scaled Down Slightly */}
            <div 
              style={{ padding: '16px 20px' }}
              className="bg-gradient-to-r from-[#2563eb] to-[#4338ca] text-white flex items-center justify-between shrink-0 relative overflow-hidden shadow-lg"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30 shadow-inner">
                    <Bot size={24} className="text-white drop-shadow-sm" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-[2.5px] border-[#2563eb] rounded-full shadow-lg"></span>
                </div>
                <div className="flex flex-col gap-0">
                  <h3 className="font-bold text-lg tracking-tight leading-none m-0 p-0">SmartHire AI</h3>
                  <div className="flex items-center gap-1">
                    <div className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                    </div>
                    <span className="text-[9px] font-black text-blue-100 uppercase tracking-widest opacity-90">Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 relative z-10">
                <button 
                  type="button"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  title={showSuggestions ? "Hide Questions" : "Show Questions"}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
                    showSuggestions ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {showSuggestions ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
                <button 
                  type="button"
                  onClick={resetChat}
                  title="Reset Chat"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all active:scale-90"
                >
                  <RefreshCw size={14} />
                </button>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all active:scale-90"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area - Scaled Down Padding */}
            <div 
              style={{ padding: '20px 18px' }}
              className="flex-1 overflow-y-auto space-y-6 scrollbar-none bg-[#f8faff] dark:bg-slate-950/40"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-md border ${
                      msg.role === 'user' 
                      ? 'bg-[#2563eb] border-[#2563eb] text-white' 
                      : 'bg-white dark:bg-slate-800 border-white dark:border-slate-700 text-[#2563eb]'
                    }`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>

                    {/* Bubble Container */}
                    <div className={`flex flex-col ${msg.role === 'user' ? 'items-end text-right' : 'items-start text-left'} gap-1.5`}>
                      <div 
                        style={{ 
                          padding: '12px 16px', 
                          borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          fontSize: '15.5px',
                          lineHeight: '1.4',
                          wordBreak: 'break-word',
                          boxShadow: msg.role === 'user' ? '0 4px 12px -2px rgba(37, 99, 235, 0.15)' : '0 4px 12px -2px rgba(0, 0, 0, 0.04)'
                        }}
                        className={`${
                          msg.role === 'user' 
                            ? 'bg-[#2563eb] text-white' 
                            : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 border border-gray-100 dark:border-slate-700'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[8px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-widest px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-white dark:border-slate-700 flex items-center justify-center text-[#2563eb] shadow-md">
                      <Bot size={16} />
                    </div>
                    <div 
                      style={{ padding: '14px 18px', borderRadius: '18px 18px 18px 4px' }}
                      className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm"
                    >
                      <div className="flex gap-1.5">
                        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />

              {showSuggestions && messages.length <= 2 && !isLoading && (
                <div className="pt-4 pb-2 space-y-2">
                  <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Quick Questions</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickQuestion(q)}
                        className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white border border-blue-100 dark:border-blue-800/50 transition-all active:scale-95"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Area - Scaled Down Padding */}
            <div 
              style={{ padding: '16px' }}
              className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]"
            >
              <form onSubmit={handleSubmit} className="relative flex items-center bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus-within:ring-4 focus-within:ring-blue-600/10 focus-within:border-[#2563eb] transition-all duration-300">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full !px-4 !py-3 bg-transparent !text-[14px] outline-none text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`!px-3 !py-3 transition-all duration-300 flex items-center justify-center ${
                    input.trim() && !isLoading 
                      ? 'text-[#2563eb] hover:scale-110 active:scale-90' 
                      : 'text-gray-300'
                  }`}
                >
                  <Send size={18} fill={input.trim() && !isLoading ? "currentColor" : "none"} />
                </button>
              </form>
              <div className="flex items-center justify-between !mt-3 !px-1">
                <div className="flex gap-4">
                  <button type="button" className="text-gray-400 hover:text-blue-600 transition-all hover:scale-125"><Paperclip size={16} /></button>
                  <button type="button" className="text-gray-400 hover:text-blue-600 transition-all hover:scale-125"><Mic size={16} /></button>
                </div>
                <div className="text-[9px] text-gray-400 font-black flex items-center gap-1.5 tracking-[0.05em] uppercase opacity-70">
                  <Sparkles size={10} className="text-amber-500" />
                  SmartHire AI
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Question Bubbles */}
      <AnimatePresence>
        {!isOpen && showQuickQuestions && !dismissBubbles && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: 100 }}
            className="flex flex-col items-end gap-2.5 mb-20 mr-2 pointer-events-auto relative"
          >
            <button
              onClick={() => setDismissBubbles(true)}
              className="absolute -top-2 -right-2 z-20 w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 hover:bg-red-500 dark:hover:bg-red-500 hover:text-white flex items-center justify-center shadow-lg transition-all active:scale-90"
              title="Hide questions"
            >
              <X size={12} />
            </button>
            {quickQuestions.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: 1,
                  y: [0, -5, 0] 
                }}
                transition={{ 
                  delay: i * 0.15,
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2
                  }
                }}
                className="relative group"
              >
                <button
                  onClick={() => handleQuickQuestion(q)}
                  className="relative z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-white !px-4 !py-2 rounded-t-2xl rounded-bl-2xl rounded-br-none shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.4)] border border-white/20 dark:border-slate-700/50 text-[12px] font-bold transition-all duration-300 hover:-translate-y-1 active:scale-95 whitespace-nowrap flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-white shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  {q}
                </button>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500/20 rounded-full blur-sm group-hover:bg-white/40 transition-colors"></div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button - Reverted Icon & Reduced Size */}
      <motion.button
        whileHover={{ 
          scale: 1.1, 
          y: -5,
          boxShadow: "0 20px 40px -5px rgba(37,99,235,0.6)"
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setShowQuickQuestions(false);
        }}
        className={`pointer-events-auto relative z-[10000] w-14 h-14 rounded-[20px] flex items-center justify-center shadow-[0_15px_35px_-5px_rgba(37,99,235,0.4)] transition-all duration-500 overflow-hidden ring-4 ring-white/10 ${
          isOpen ? 'bg-slate-900 rotate-90' : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} className="flex items-center justify-center">
              <Bot size={28} className="text-white drop-shadow-lg" />
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white rounded-full blur-2xl -z-10"
              />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute inset-0 rounded-[20px] bg-white/20 animate-ping pointer-events-none"></span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot;
