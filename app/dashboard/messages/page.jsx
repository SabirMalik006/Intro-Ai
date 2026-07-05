"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Send, Search, X, ArrowLeft, Loader2,
  User, ChevronRight, Plus, CheckCheck, Paperclip,
  MoreVertical, Trash2, Eraser, Download, Phone,
  Video, Info, Smile, Sticker, Image as ImageIcon,
  ChevronDown, Clock, Check, Circle
} from "lucide-react";
import api from "@/services/api";
import useAuthStore from "@/store/authStore";
import { connectSocket, getSocket, disconnectSocket } from "@/lib/socket";
import EmojiPicker from "@/components/chat/EmojiPicker";
import StickerPicker from "@/components/chat/StickerPicker";
import UserProfileModal from "@/components/chat/UserProfileModal";

const CONVERSATIONS_CACHE = {};
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getFileUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

function downloadFile(url, name) {
  const a = document.createElement('a');
  a.href = getFileUrl(url);
  a.download = name || 'download';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [startingConv, setStartingConv] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const messageIdsRef = useRef(new Set());
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  const activeConv = conversations.find(c => c._id === activeConvId);
  const otherParticipant = activeConv?.participants?.find(p => p._id !== user?._id);
  const role = (user?.role || '').toLowerCase().trim();
  const isRecruiter = role.includes('recruit') || role === 'admin';

  useEffect(() => {
    connectSocket();
    return () => { disconnectSocket(); };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (messageIdsRef.current.has(msg._id)) return;
      messageIdsRef.current.add(msg._id);
      if (msg.conversation === activeConvId) {
        setMessages(prev => [...prev, msg]);
      }
      setConversations(prev => {
        const existing = prev.find(c => c._id === msg.conversation);
        if (!existing) return prev;
        const display = msg.type === 'sticker' ? '😊 Sticker'
          : msg.type === 'image' ? '📷 Photo'
          : msg.type === 'video' ? '🎥 Video'
          : msg.text?.trim() || '';
        return prev.map(c =>
          c._id === msg.conversation
            ? { ...c, lastMessage: { text: display, sender: msg.sender, timestamp: new Date().toISOString() } }
            : c
        );
      });
    };

    const handleConvUpdated = (data) => {
      setConversations(prev => prev.map(c =>
        c._id === data.conversationId ? { ...c, lastMessage: data.lastMessage } : c
      ));
    };

    const handleMessagesRead = (data) => {
      if (data.userId !== user?._id && data.conversationId === activeConvId) {
        setMessages(prev => prev.map(m =>
          m.sender?._id !== user?._id && !m.readAt
            ? { ...m, readAt: new Date().toISOString() }
            : m
        ));
      }
      setConversations(prev => prev.map(c =>
        c._id === data.conversationId ? { ...c, unreadCount: 0 } : c
      ));
    };

    const handleChatCleared = (data) => {
      if (data.conversationId === activeConvId) {
        setMessages([]);
        CONVERSATIONS_CACHE[activeConvId] = [];
        messageIdsRef.current = new Set();
      }
      setConversations(prev => prev.map(c =>
        c._id === data.conversationId ? { ...c, lastMessage: null } : c
      ));
    };

    const handleConvDeleted = (data) => {
      setConversations(prev => prev.filter(c => c._id !== data.conversationId));
      if (activeConvId === data.conversationId) {
        setActiveConvId(null);
        setMessages([]);
        delete CONVERSATIONS_CACHE[data.conversationId];
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('conversation_updated', handleConvUpdated);
    socket.on('messages_read', handleMessagesRead);
    socket.on('chat_cleared', handleChatCleared);
    socket.on('conversation_deleted', handleConvDeleted);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('conversation_updated', handleConvUpdated);
      socket.off('messages_read', handleMessagesRead);
      socket.off('chat_cleared', handleChatCleared);
      socket.off('conversation_deleted', handleConvDeleted);
    };
  }, [activeConvId, user?._id]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !activeConvId) return;

    socket.emit('join_conversation', activeConvId);
    return () => { socket.emit('leave_conversation', activeConvId); };
  }, [activeConvId]);

  const loadConversations = useCallback(async () => {
    try {
      const res = await api.get('/messages/conversations');
      if (res.data.success) {
        const sorted = (res.data.data || []).sort((a, b) => {
          const tA = a.lastMessage?.timestamp || a.updatedAt;
          const tB = b.lastMessage?.timestamp || b.updatedAt;
          return new Date(tB) - new Date(tA);
        });
        setConversations(sorted);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    if (!activeConvId) { setMessages([]); return; }

    const cached = CONVERSATIONS_CACHE[activeConvId];
    if (cached) { setMessages(cached); return; }

    const load = async () => {
      setMsgLoading(true);
      try {
        const res = await api.get(`/messages/conversations/${activeConvId}/messages`);
        if (res.data.success) {
          const msgs = res.data.data || [];
          messageIdsRef.current = new Set(msgs.map(m => m._id));
          setMessages(msgs);
          CONVERSATIONS_CACHE[activeConvId] = msgs;
        }
      } catch {}
      setMsgLoading(false);
    };
    load();
  }, [activeConvId]);

  useEffect(() => {
    if (!activeConvId) return;
    api.patch(`/messages/conversations/${activeConvId}/read`).catch(() => {});
    const socket = getSocket();
    if (socket) socket.emit('mark_read', activeConvId);
    setConversations(prev => prev.map(c =>
      c._id === activeConvId ? { ...c, unreadCount: 0 } : c
    ));
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowChatMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const sendMessage = async () => {
    const text = inputText.trim();
    if ((!text && !filePreview) || !activeConvId || sending) return;

    setSending(true);

    let fileData = null;
    if (filePreview) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', filePreview.file);
        const uploadRes = await api.post('/messages/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (uploadRes.data.success) {
          fileData = uploadRes.data.data;
        }
      } catch {
        setSending(false);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const msgType = fileData
      ? (fileData.mime?.startsWith('video') ? 'video' : 'image')
      : 'text';

    const msgText = fileData ? '' : text;
    setInputText('');
    setFilePreview(null);

    const socket = getSocket();
    const addMessage = (msg) => {
      if (messageIdsRef.current.has(msg._id)) return;
      messageIdsRef.current.add(msg._id);
      setMessages(prev => [...prev, msg]);
      CONVERSATIONS_CACHE[activeConvId] = [...(CONVERSATIONS_CACHE[activeConvId] || []), msg];
    };

    if (socket?.connected) {
      socket.emit('send_message', {
        conversationId: activeConvId,
        text: msgText,
        type: msgType,
        file: fileData,
      }, (res) => {
        if (res?.success) addMessage(res.data);
        setSending(false);
      });
      setTimeout(() => setSending(false), 10000);
    } else {
      try {
        const res = await api.post(`/messages/conversations/${activeConvId}/messages`, {
          text: msgText,
          type: msgType,
          file: fileData,
        });
        if (res.data.success) {
          addMessage(res.data.data);
          const display = msgType === 'image' ? '📷 Photo'
            : msgType === 'video' ? '🎥 Video'
            : text;
          setConversations(prev => prev.map(c =>
            c._id === activeConvId
              ? { ...c, lastMessage: { text: display, sender: user?._id, timestamp: new Date().toISOString() } }
              : c
          ));
        }
      } catch {}
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleEmojiSelect = (emoji) => {
    setInputText(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const handleStickerSelect = async (sticker) => {
    if (!activeConvId || sending) return;
    setSending(true);

    const socket = getSocket();
    const addMessage = (msg) => {
      if (messageIdsRef.current.has(msg._id)) return;
      messageIdsRef.current.add(msg._id);
      setMessages(prev => [...prev, msg]);
      CONVERSATIONS_CACHE[activeConvId] = [...(CONVERSATIONS_CACHE[activeConvId] || []), msg];
    };

    if (socket?.connected) {
      socket.emit('send_message', {
        conversationId: activeConvId,
        text: sticker.emoji,
        type: 'sticker',
      }, (res) => {
        if (res?.success) addMessage(res.data);
        setSending(false);
      });
      setTimeout(() => setSending(false), 5000);
    } else {
      try {
        const res = await api.post(`/messages/conversations/${activeConvId}/messages`, {
          text: sticker.emoji,
          type: 'sticker',
        });
        if (res.data.success) addMessage(res.data.data);
      } catch {}
      setSending(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('File too large. Max 50MB.');
      return;
    }

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Only images and videos are allowed.');
      return;
    }

    const url = URL.createObjectURL(file);
    setFilePreview({ file, url, name: file.name, type: file.type });
    e.target.value = '';
  };

  const handleClearChat = async () => {
    if (!confirm('Clear all messages in this conversation?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/messages/conversations/${activeConvId}/clear`);
      setMessages([]);
      CONVERSATIONS_CACHE[activeConvId] = [];
      messageIdsRef.current = new Set();
      setConversations(prev => prev.map(c =>
        c._id === activeConvId ? { ...c, lastMessage: null } : c
      ));
    } catch {}
    setActionLoading(false);
    setShowChatMenu(false);
  };

  const handleDeleteConversation = async () => {
    if (!confirm('Delete this conversation? This cannot be undone.')) return;
    setActionLoading(true);
    try {
      await api.delete(`/messages/conversations/${activeConvId}`);
      setConversations(prev => prev.filter(c => c._id !== activeConvId));
      setActiveConvId(null);
      setMessages([]);
      delete CONVERSATIONS_CACHE[activeConvId];
    } catch {}
    setActionLoading(false);
    setShowChatMenu(false);
  };

  const searchUsers = async (q) => {
    setUserSearch(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await api.get(`/auth/search-users?q=${encodeURIComponent(q)}`);
      setSearchResults(res.data.data || []);
    } catch { setSearchResults([]); }
    setSearching(false);
  };

  const startConversation = async (recipientId) => {
    setStartingConv(true);
    try {
      const res = await api.post(`/messages/conversations/${recipientId}`);
      if (res.data.success) {
        const conv = res.data.data;
        setConversations(prev => {
          const exists = prev.find(c => c._id === conv._id);
          if (exists) return prev;
          return [conv, ...prev];
        });
        setActiveConvId(conv._id);
        setShowNewChat(false);
        setUserSearch('');
        setSearchResults([]);
        setMessages([]);
        delete CONVERSATIONS_CACHE[conv._id];
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to start conversation');
    }
    setStartingConv(false);
  };

  const filteredConversations = conversations.filter(c => {
    if (!searchTerm) return true;
    const other = c.participants?.find(p => p._id !== user?._id);
    const name = other?.fullName || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) {
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < 604800000) {
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDateDivider = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) return 'Today';
    if (diff < 172800000) return 'Yesterday';
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (id) => {
    const colors = [
      'from-teal-500 to-emerald-600',
      'from-indigo-500 to-violet-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-pink-600',
      'from-cyan-500 to-blue-600',
      'from-purple-500 to-fuchsia-600',
    ];
    const idx = (id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
    return colors[idx];
  };

  const getDateGroups = () => {
    const groups = [];
    let currentDate = null;
    for (const msg of messages) {
      const msgDate = new Date(msg.createdAt).toDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ type: 'divider', date: msg.createdAt });
      }
      groups.push({ type: 'message', data: msg });
    }
    return groups;
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex-1 bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-300 dark:border-white/5 overflow-hidden flex flex-col lg:flex-row shadow-2xl shadow-slate-900/5">
        {/* ─── SIDEBAR ─── */}
        <div className={`lg:w-[380px] border-r border-slate-200/60 dark:border-white/5 flex flex-col bg-gradient-to-b from-white/50 to-slate-50/30 dark:from-slate-900/50 dark:to-slate-950/30 ${activeConvId ? 'hidden lg:flex' : 'flex'}`}>
          {/* Sidebar header */}
          <div className="p-5 border-b border-slate-200/60 dark:border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 shadow-lg shadow-teal-500/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span>Messages</span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {conversations.length}
                </span>
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewChat(true)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-600 hover:to-emerald-700 transition-all shadow-lg shadow-teal-500/25"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-teal-500" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-slate-800/50 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 focus:outline-none transition-all backdrop-blur-sm"
              />
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto scrollbar-thin py-2 px-2">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 animate-pulse opacity-30" />
                    <Loader2 className="w-10 h-10 animate-spin text-teal-500 relative z-10" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Loading conversations...</p>
                </div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/20 dark:to-emerald-900/20 flex items-center justify-center mb-5 border border-slate-200/60 dark:border-white/5 shadow-inner relative">
                  <span className="text-5xl">💬</span>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-lg">
                    <Plus className="w-3 h-3 text-white" />
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-white mb-1.5">
                  {searchTerm ? 'No matches found' : 'No conversations yet'}
                </p>
                <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                  {searchTerm ? 'Try a different search term' : 'Click + to start a new conversation'}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map((conv, index) => {
                  const other = conv.participants?.find(p => p._id !== user?._id);
                  const isActive = conv._id === activeConvId;
                  return (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      key={conv._id}
                      onClick={() => setActiveConvId(conv._id)}
                      className={`w-full p-3.5 rounded-2xl text-left transition-all duration-200 relative overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-50/80 to-emerald-50/80 dark:from-teal-900/30 dark:to-emerald-900/30 border border-teal-200/60 dark:border-teal-800/40 shadow-md shadow-teal-500/5'
                          : 'hover:bg-white/60 dark:hover:bg-slate-800/30 border border-transparent hover:border-slate-200/40 dark:hover:border-white/5'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-gradient-to-b from-teal-400 to-emerald-600 shadow-sm shadow-teal-500/30" />
                      )}
                      <div className="flex items-start gap-3.5">
                        <div className="relative shrink-0">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getAvatarColor(other?._id)} flex items-center justify-center text-white text-base font-bold shadow-md shadow-slate-900/10 transition-transform duration-200 ${isActive ? 'scale-105' : ''}`}>
                            {getInitials(other?.fullName)}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-[2.5px] border-white dark:border-slate-900">
                            <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className={`text-sm truncate ${isActive ? 'font-bold text-slate-800 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                              {other?.fullName || 'Unknown'}
                            </h4>
                            <span className="text-[11px] font-medium text-slate-400 shrink-0 ml-2">
                              {formatTime(conv.lastMessage?.timestamp || conv.updatedAt)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mb-1.5 flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${other?.role?.includes('recruit') ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                            {other?.role || ''}
                            {other?.company ? ` • ${other.company}` : ''}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className={`text-xs truncate flex-1 ${
                              conv.unreadCount > 0
                                ? 'font-semibold text-slate-700 dark:text-slate-200'
                                : 'text-slate-400 dark:text-slate-500'
                            }`}>
                              {conv.lastMessage?.text || 'No messages yet'}
                            </p>
                            {conv.unreadCount > 0 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="min-w-[22px] h-5 px-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/20"
                              >
                                {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ─── CHAT AREA ─── */}
        <div className={`flex-1 flex flex-col bg-gradient-to-br from-white/50 to-slate-50/30 dark:from-slate-900/50 dark:to-slate-950/30 ${!activeConvId ? 'hidden lg:flex' : 'flex'}`}>
          {activeConvId && otherParticipant ? (
            <>
              {/* Chat header */}
              <div className="px-5 py-3.5 border-b border-slate-200/60 dark:border-white/5 flex items-center justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setActiveConvId(null); setFilePreview(null); }}
                    className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setProfileUser(otherParticipant)}
                    className="flex items-center gap-3.5 min-w-0 group"
                  >
                    <div className="relative">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${getAvatarColor(otherParticipant._id)} flex items-center justify-center text-white text-base font-bold shadow-md transition-transform group-hover:scale-105`}>
                        {getInitials(otherParticipant.fullName)}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900">
                        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
                      </div>
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {otherParticipant.fullName}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-medium text-emerald-500">Online</span>
                      </div>
                    </div>
                  </motion.button>
                </div>

                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-white/80 dark:hover:bg-slate-800/50 transition-all hidden sm:block"
                    title="Voice call"
                  >
                    <Phone className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-white/80 dark:hover:bg-slate-800/50 transition-all hidden sm:block"
                    title="Video call"
                  >
                    <Video className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileUser(otherParticipant)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-white/80 dark:hover:bg-slate-800/50 transition-all"
                    title="View Profile"
                  >
                    <Info className="w-4 h-4" />
                  </motion.button>

                  <div className="relative" ref={menuRef}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowChatMenu(!showChatMenu)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/50 transition-all"
                      title="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </motion.button>

                    <AnimatePresence>
                      {showChatMenu && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setShowChatMenu(false)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: -6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: -6 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="absolute right-0 top-12 z-40 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-white/5 overflow-hidden backdrop-blur-xl"
                          >
                            <div className="py-1">
                              <button
                                onClick={handleClearChat}
                                disabled={actionLoading || messages.length === 0}
                                className="w-full px-4 py-3 flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-40 transition-all"
                              >
                                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                  <Eraser className="w-3.5 h-3.5 text-amber-500" />
                                </div>
                                Clear Chat
                              </button>
                              <button
                                onClick={handleDeleteConversation}
                                disabled={actionLoading}
                                className="w-full px-4 py-3 flex items-center gap-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-40 transition-all"
                              >
                                <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </div>
                                Delete Conversation
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Messages area */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-1 scrollbar-thin relative"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148,163,184,0.08) 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }}
              >
                {msgLoading ? (
                  <div className="flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-10 h-10">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 animate-pulse opacity-20" />
                        <Loader2 className="w-10 h-10 animate-spin text-teal-500 relative z-10" />
                      </div>
                      <p className="text-xs text-slate-400 font-medium">Loading messages...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/20 dark:to-emerald-900/20 flex items-center justify-center text-5xl mb-5 border border-slate-200/60 dark:border-white/5 shadow-inner">
                      👋
                    </div>
                    <p className="text-base font-bold text-slate-800 dark:text-white mb-1.5">
                      {getDateGroups().length === 0 && activeConv?.lastMessage === null
                        ? 'Chat cleared'
                        : 'Start a conversation'}
                    </p>
                    <p className="text-sm text-slate-400 max-w-[240px] leading-relaxed">
                      Send a message to {otherParticipant.fullName?.split(' ')[0] || 'them'}
                    </p>
                  </div>
                ) : (
                  <>
                    {getDateGroups().map((item, idx) =>
                      item.type === 'divider' ? (
                        <div key={`div-${idx}`} className="flex items-center gap-4 py-4">
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                          <div className="px-4 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/5 shadow-sm backdrop-blur-sm">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {formatDateDivider(item.date)}
                            </span>
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                        </div>
                      ) : (
                        <MessageBubble
                          key={item.data._id || idx}
                          msg={item.data}
                          isMine={item.data.sender?._id === user?._id || item.data.sender === user?._id}
                          showAvatar={
                            idx === 0 ||
                            (getDateGroups()[idx - 1]?.type === 'message' &&
                             getDateGroups()[idx - 1]?.data?.sender?._id !== item.data.sender?._id)
                          }
                          getAvatarColor={getAvatarColor}
                          getInitials={getInitials}
                          formatTime={formatTime}
                          onProfileClick={setProfileUser}
                        />
                      )
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* File preview */}
              <AnimatePresence>
                {filePreview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="px-4 pt-3 border-t border-slate-200/60 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                  >
                    <div className="relative inline-block rounded-2xl overflow-hidden border border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-slate-800/80 shadow-lg backdrop-blur-sm">
                      {filePreview.type?.startsWith('video/') ? (
                        <video src={filePreview.url} className="h-36 w-auto object-cover" controls />
                      ) : (
                        <img src={filePreview.url} alt="Preview" className="h-36 w-auto object-cover" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      <button
                        onClick={() => {
                          URL.revokeObjectURL(filePreview.url);
                          setFilePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-all backdrop-blur-sm"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1.5">
                        <Paperclip className="w-3 h-3" />
                        {filePreview.name}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input area */}
              <div className="px-4 py-3 border-t border-slate-200/60 dark:border-white/5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
                <div className="flex items-end gap-2">
                  <div className="flex items-center gap-0.5 pb-1">
                    <div className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                      <EmojiPicker onSelect={handleEmojiSelect} />
                    </div>
                    <div className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                      <StickerPicker onSelect={handleStickerSelect} />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="p-2 rounded-xl text-slate-400 hover:text-teal-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-40"
                      title="Attach file"
                    >
                      {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                    </motion.button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  <div className="flex-1 relative">
                    <div className="relative">
                      <textarea
                        ref={inputRef}
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-slate-800/50 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 focus:outline-none resize-none text-sm transition-all backdrop-blur-sm"
                        style={{ minHeight: 48, maxHeight: 120 }}
                        onInput={e => {
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={(!inputText.trim() && !filePreview) || sending || uploading ? {} : { scale: 1.05 }}
                    whileTap={(!inputText.trim() && !filePreview) || sending || uploading ? {} : { scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={(!inputText.trim() && !filePreview) || sending || uploading}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-sm hover:from-teal-600 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/25 flex items-center gap-2 shrink-0"
                  >
                    {sending || uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span className="hidden sm:inline">Send</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-teal-100/30 to-emerald-100/30 dark:from-teal-500/5 dark:to-emerald-500/5 blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-100/30 to-purple-100/30 dark:from-indigo-500/5 dark:to-purple-500/5 blur-3xl" />

              <div className="text-center max-w-sm px-6 relative z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 flex items-center justify-center mx-auto mb-6 border border-slate-200/60 dark:border-white/5 shadow-xl shadow-teal-500/5 relative"
                >
                  <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-teal-400/10 to-emerald-600/10 pointer-events-none" />
                  <MessageSquare className="w-12 h-12 text-teal-400 dark:text-teal-500" />
                </motion.div>
                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="text-2xl font-bold text-slate-800 dark:text-white mb-2"
                >
                  Your Messages
                </motion.h3>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="text-sm text-slate-400 leading-relaxed mb-8"
                >
                  {isRecruiter
                    ? 'Chat with candidates about interviews, share feedback, and schedule meetings.'
                    : 'Connect with recruiters and get updates about your job applications.'}
                </motion.p>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowNewChat(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all shadow-lg shadow-teal-500/25"
                  >
                    <Plus className="w-4 h-4" /> New Conversation
                  </motion.button>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── NEW CHAT MODAL ─── */}
      <AnimatePresence>
        {showNewChat && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => { setShowNewChat(false); setUserSearch(''); setSearchResults([]); }}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-slate-200/60 dark:border-white/5 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200/60 dark:border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 shadow-lg shadow-teal-500/20 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">New Conversation</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setShowNewChat(false); setUserSearch(''); setSearchResults([]); }}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-teal-500" />
                  <input
                    value={userSearch}
                    onChange={e => searchUsers(e.target.value)}
                    placeholder="Search users by name or email..."
                    className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-slate-800/50 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 focus:outline-none text-sm transition-all backdrop-blur-sm"
                    autoFocus
                  />
                  {searching && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-teal-500" />
                  )}
                </div>
              </div>
              <div className="max-h-[360px] overflow-y-auto p-2 scrollbar-thin">
                {userSearch.length < 2 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-2xl mb-3 border border-slate-200/60 dark:border-white/5">
                      🔍
                    </div>
                    <p className="text-sm font-medium text-slate-400">Type at least 2 characters to search</p>
                  </div>
                ) : searchResults.length === 0 && !searching ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-2xl mb-3 border border-slate-200/60 dark:border-white/5">
                      😕
                    </div>
                    <p className="text-sm font-medium text-slate-400">No users found</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {searchResults
                      .filter(u => u._id !== user?._id)
                      .map((u, i) => {
                        const existingConv = conversations.find(c =>
                          c.participants?.some(p => p._id === u._id)
                        );
                        return (
                          <motion.button
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            key={u._id}
                            onClick={() => startConversation(u._id)}
                            disabled={startingConv}
                            className="w-full p-3.5 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/30 transition-all flex items-center gap-3.5 disabled:opacity-50 group border border-transparent hover:border-slate-200/40 dark:hover:border-white/5"
                          >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getAvatarColor(u._id)} flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-md shadow-slate-900/10`}>
                              {getInitials(u.fullName)}
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-800 dark:text-white">{u.fullName}</p>
                              <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${u.role?.includes('recruit') ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                                {u.role || 'User'}
                                {existingConv && (
                                  <span className="text-teal-500 font-medium"> • In conversations</span>
                                )}
                              </p>
                            </div>
                            {startingConv ? (
                              <Loader2 className="w-4 h-4 animate-spin text-teal-500 shrink-0" />
                            ) : (
                              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-all">
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── USER PROFILE MODAL ─── */}
      {profileUser && (
        <UserProfileModal
          user={user}
          otherUser={profileUser}
          onClose={() => setProfileUser(null)}
        />
      )}
    </div>
  );
}

// ─── Message Bubble Component ───
function MessageBubble({ msg, isMine, showAvatar, getAvatarColor, getInitials, formatTime, onProfileClick }) {
  const renderContent = () => {
    if (msg.type === 'sticker') {
      return (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-5xl py-1 px-1 select-none leading-none"
        >
          {msg.text}
        </motion.div>
      );
    }

    if (msg.type === 'image' && msg.file?.url) {
      return (
        <div className="space-y-1.5">
          <div className="relative group rounded-2xl overflow-hidden">
            <img
              src={getFileUrl(msg.file.url)}
              alt={msg.file.name || 'Image'}
              className="max-w-[280px] max-h-72 object-cover cursor-pointer transition-all duration-300 group-hover:scale-105"
              loading="lazy"
              onClick={() => window.open(getFileUrl(msg.file.url), '_blank')}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            <motion.button
              initial={{ opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              onClick={(e) => { e.stopPropagation(); downloadFile(msg.file.url, msg.file.name); }}
              className="absolute top-2 right-2 p-2 rounded-xl bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all backdrop-blur-sm"
              title="Download"
            >
              <Download className="w-3.5 h-3.5" />
            </motion.button>
          </div>
          {msg.text && (
            <p className="text-sm leading-relaxed px-0.5 whitespace-pre-wrap break-words text-inherit">{msg.text}</p>
          )}
        </div>
      );
    }

    if (msg.type === 'video' && msg.file?.url) {
      return (
        <div className="space-y-1.5 max-w-[320px]">
          <div className="relative group rounded-2xl overflow-hidden">
            <video controls className="w-full rounded-2xl" preload="metadata">
              <source src={getFileUrl(msg.file.url)} />
            </video>
            <motion.button
              initial={{ opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => downloadFile(msg.file.url, msg.file.name)}
              className="absolute top-2 right-2 p-2 rounded-xl bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all backdrop-blur-sm"
              title="Download"
            >
              <Download className="w-3.5 h-3.5" />
            </motion.button>
          </div>
          {msg.text && (
            <p className="text-sm leading-relaxed px-0.5 whitespace-pre-wrap break-words">{msg.text}</p>
          )}
        </div>
      );
    }

    return (
      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex ${isMine ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-5' : 'mt-0.5'}`}
    >
      <div className={`flex items-end gap-2.5 max-w-[82%] sm:max-w-[75%] ${isMine ? 'flex-row-reverse' : ''}`}>
        {showAvatar && !isMine ? (
          <button
            onClick={() => onProfileClick(msg.sender)}
            className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getAvatarColor(msg.sender?._id)} flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-md shadow-slate-900/10 hover:scale-110 transition-transform cursor-pointer`}
            title="View profile"
          >
            {getInitials(msg.sender?.fullName)}
          </button>
        ) : (
          <div className="w-8" />
        )}

        <div className={`relative ${
          isMine
            ? msg.type === 'sticker'
              ? 'bg-transparent'
              : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20'
            : msg.type === 'sticker'
              ? 'bg-transparent'
              : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-800 dark:text-white border border-slate-200/60 dark:border-white/10 shadow-md'
        } ${msg.type === 'sticker' ? '' : 'px-4 py-2.5'} ${
          isMine
            ? msg.type === 'sticker' ? '' : 'rounded-3xl rounded-br-md'
            : msg.type === 'sticker' ? '' : 'rounded-3xl rounded-bl-md'
        }`}>
          {renderContent()}

          {msg.type !== 'sticker' && (
            <div className={`flex items-center justify-end gap-1.5 mt-1.5 ${isMine ? 'text-white/70' : 'text-slate-400'}`}>
              <span className="text-[10px] font-medium">{formatTime(msg.createdAt)}</span>
              {isMine && (
                <span className="relative">
                  {msg.readAt ? (
                    <CheckCheck className="w-3.5 h-3.5 text-teal-300" />
                  ) : (
                    <div className="relative">
                      <Check className="w-3 h-3 absolute -left-3.5 top-0.5 opacity-40" />
                      <Check className="w-3 h-3 opacity-40" />
                    </div>
                  )}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
