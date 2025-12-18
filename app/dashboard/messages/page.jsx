// app/dashboard/messages/page.js
"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function MessagesPage() {
  const [open, setOpen] = useState(true);
  const [activeChat, setActiveChat] = useState(1);

  const conversations = [
    { id: 1, name: "John Smith", role: "Frontend Developer", lastMessage: "Thanks for the feedback!", time: "10:30 AM", unread: 2 },
    { id: 2, name: "Sarah Chen", role: "Data Scientist", lastMessage: "When is the next round?", time: "Yesterday", unread: 0 },
    { id: 3, name: "Mike Rodriguez", role: "DevOps Engineer", lastMessage: "I've completed the assessment", time: "Nov 15", unread: 1 },
    { id: 4, name: "Priya Patel", role: "Product Manager", lastMessage: "Looking forward to working with...", time: "Nov 14", unread: 0 },
    { id: 5, name: "Emma Wilson", role: "UX Designer", lastMessage: "Can we reschedule?", time: "Nov 13", unread: 0 },
  ];

  const messages = [
    { id: 1, sender: "candidate", text: "Hi, I've completed my interview. When can I expect feedback?", time: "10:15 AM" },
    { id: 2, sender: "recruiter", text: "Thanks for completing the interview John! Our AI system is analyzing your responses. We'll have feedback by tomorrow.", time: "10:20 AM" },
    { id: 3, sender: "candidate", text: "Great! I'm excited to hear the results. Thanks for the quick response!", time: "10:25 AM" },
    { id: 4, sender: "recruiter", text: "You're welcome! The AI scored you highly on technical skills. We'll share detailed feedback soon.", time: "10:30 AM" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar open={open} toggle={() => setOpen(!open)} />
      
      <main className={`flex-1 transition-all duration-300 ${open ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-2">Communicate with candidates and team members</p>
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full lg:w-64 px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                />
                <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-medium">
                New Message
              </button>
            </div>
          </div>

          {/* Chat Layout */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex flex-col lg:flex-row h-[600px]">
              {/* Conversations List */}
              <div className="lg:w-1/3 border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Conversations</h3>
                </div>
                
                <div className="divide-y divide-gray-100 overflow-y-auto h-[520px]">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setActiveChat(conversation.id)}
                      className={`w-full p-4 text-left transition-colors ${
                        activeChat === conversation.id ? 'bg-teal-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-teal-700 font-semibold">
                            {conversation.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{conversation.name}</h4>
                            <span className="text-xs text-gray-500">{conversation.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-1">{conversation.role}</p>
                          <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread > 0 && (
                          <span className="w-6 h-6 bg-teal-600 text-white text-xs rounded-full flex items-center justify-center">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="lg:w-2/3 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-700 font-semibold">JS</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">John Smith</h4>
                      <p className="text-sm text-gray-600">Frontend Developer • Interview completed</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] rounded-2xl p-4 ${
                          message.sender === 'recruiter'
                            ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p>{message.text}</p>
                          <div className={`text-xs mt-2 ${message.sender === 'recruiter' ? 'text-white/70' : 'text-gray-500'}`}>
                            {message.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    />
                    <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-medium">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <button className="p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-teal-600 text-xl">📧</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Email Templates</div>
                <div className="text-sm text-gray-600">Pre-built email responses</div>
              </div>
            </button>
            <button className="p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-teal-600 text-xl">🤖</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">AI Assistant</div>
                <div className="text-sm text-gray-600">Get AI-powered reply suggestions</div>
              </div>
            </button>
            <button className="p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-teal-600 text-xl">📋</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Schedule Messages</div>
                <div className="text-sm text-gray-600">Schedule follow-ups automatically</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}