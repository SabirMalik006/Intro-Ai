"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Send, Search, X, ArrowLeft, Loader2,
  User, ChevronRight, Plus, CheckCheck, Paperclip,
  MoreVertical, Trash2, Eraser, Download
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

  // ─── Socket setup ───
  useEffect(() => {
    connectSocket();
    return () => { disconnectSocket(); };
  }, []);

  // ─── Socket events ───
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

  // ─── Join conversation room ───
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !activeConvId) return;

    socket.emit('join_conversation', activeConvId);
    return () => { socket.emit('leave_conversation', activeConvId); };
  }, [activeConvId]);

  // ─── Load conversations ───
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

  // ─── Load messages when conversation changes ───
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

  // ─── Mark as read ───
  useEffect(() => {
    if (!activeConvId) return;
    api.patch(`/messages/conversations/${activeConvId}/read`).catch(() => {});
    const socket = getSocket();
    if (socket) socket.emit('mark_read', activeConvId);
    setConversations(prev => prev.map(c =>
      c._id === activeConvId ? { ...c, unreadCount: 0 } : c
    ));
  }, [activeConvId]);

  // ─── Auto scroll ───
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Close menu on outside click ───
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowChatMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ─── Send message ───
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

  // ─── Emoji / Sticker handlers ───
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

  // ─── File upload ───
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

  // ─── Clear chat ───
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

  // ─── Delete conversation ───
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

  // ─── Search users for new chat ───
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

  // ─── Filter conversations by search ───
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

  // ─── Group messages by date ───
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
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col lg:flex-row shadow-lg">
        {/* ─── SIDEBAR ─── */}
        <div className={`lg:w-[380px] border-r border-slate-200 dark:border-slate-700 flex flex-col bg-slate-50/50 dark:bg-slate-950/30 ${activeConvId ? 'hidden lg:flex' : 'flex'}`}>
          {/* Sidebar header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                Messages
              </h2>
              <button onClick={() => setShowNewChat(true)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-600 hover:to-emerald-700 transition-all shadow-lg shadow-teal-500/20">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/20 dark:to-emerald-900/20 flex items-center justify-center text-3xl mb-4 border border-slate-200 dark:border-slate-700">
                  💬
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">No conversations yet</p>
                <p className="text-xs text-slate-400 max-w-[200px]">
                  {searchTerm ? 'No matches found' : 'Click + to start a new conversation'}
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredConversations.map((conv) => {
                  const other = conv.participants?.find(p => p._id !== user?._id);
                  const isActive = conv._id === activeConvId;
                  return (
                    <button
                      key={conv._id}
                      onClick={() => setActiveConvId(conv._id)}
                      className={`w-full p-3.5 rounded-2xl text-left transition-all relative ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-200 dark:border-teal-800 shadow-sm'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarColor(other?._id)} flex items-center justify-center text-white text-base font-extrabold shrink-0 shadow-sm`}>
                            {getInitials(other?.fullName)}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white truncate">{other?.fullName || 'Unknown'}</h4>
                            <span className="text-[10px] font-semibold text-slate-400 shrink-0 ml-2">
                              {formatTime(conv.lastMessage?.timestamp || conv.updatedAt)}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate mb-1">
                            {other?.role || ''}
                            {other?.company ? ` • ${other.company}` : ''}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className={`text-xs truncate flex-1 ${
                              conv.unreadCount > 0
                                ? 'font-bold text-slate-700 dark:text-slate-300'
                                : 'text-slate-400 dark:text-slate-500'
                            }`}>
                              {conv.lastMessage?.text || 'No messages yet'}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-[9px] font-extrabold flex items-center justify-center shrink-0 shadow-sm">
                                {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ─── CHAT AREA ─── */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${!activeConvId ? 'hidden lg:flex' : 'flex'}`}>
          {activeConvId && otherParticipant ? (
            <>
              {/* Chat header with three-dot menu */}
              <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <button onClick={() => { setActiveConvId(null); setFilePreview(null); }} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => setProfileUser(otherParticipant)} className="flex items-center gap-3 min-w-0 group">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getAvatarColor(otherParticipant._id)} flex items-center justify-center text-white text-base font-extrabold shadow-sm transition-transform group-hover:scale-105`}>
                      {getInitials(otherParticipant.fullName)}
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {otherParticipant.fullName}
                      </h4>
                      <p className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Online
                      </p>
                    </div>
                  </button>
                </div>

                {/* Three icons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setProfileUser(otherParticipant)}
                    className="p-2 rounded-xl text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    title="View Profile"
                  >
                    <User className="w-4.5 h-4.5" />
                  </button>

                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowChatMenu(!showChatMenu)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                      title="More options"
                    >
                      <MoreVertical className="w-4.5 h-4.5" />
                    </button>

                    <AnimatePresence>
                      {showChatMenu && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setShowChatMenu(false)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -4 }}
                            transition={{ duration: 0.12 }}
                            className="absolute right-0 top-12 z-40 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                          >
                            <button
                              onClick={handleClearChat}
                              disabled={actionLoading || messages.length === 0}
                              className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-all"
                            >
                              <Eraser className="w-4 h-4 text-amber-500" />
                              Clear Chat
                            </button>
                            <div className="h-px bg-slate-100 dark:bg-slate-700 mx-3" />
                            <button
                              onClick={handleDeleteConversation}
                              disabled={actionLoading}
                              className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-40 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Conversation
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-1 bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-950/50 dark:to-slate-900 scrollbar-thin">
                {msgLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                      <p className="text-xs text-slate-400">Loading messages...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/20 dark:to-emerald-900/20 flex items-center justify-center text-4xl mb-4 border border-slate-200 dark:border-slate-700 shadow-inner">
                      👋
                    </div>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-white mb-1">
                      {getDateGroups().length === 0 && activeConv?.lastMessage === null
                        ? 'Chat cleared'
                        : 'Start a conversation'}
                    </p>
                    <p className="text-xs text-slate-400 max-w-[220px]">
                      Send a message to {otherParticipant.fullName?.split(' ')[0] || 'them'}
                    </p>
                  </div>
                ) : (
                  <>
                    {getDateGroups().map((item, idx) =>
                      item.type === 'divider' ? (
                        <div key={`div-${idx}`} className="flex items-center gap-3 py-3">
                          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                            {formatDateDivider(item.date)}
                          </span>
                          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
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
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pt-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/30"
                  >
                    <div className="relative inline-block rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                      {filePreview.type?.startsWith('video/') ? (
                        <video src={filePreview.url} className="h-32 w-auto object-cover" controls />
                      ) : (
                        <img src={filePreview.url} alt="Preview" className="h-32 w-auto object-cover" />
                      )}
                      <button
                        onClick={() => {
                          URL.revokeObjectURL(filePreview.url);
                          setFilePreview(null);
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-slate-900/60 text-white hover:bg-slate-900/80 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-lg bg-slate-900/60 text-white text-[10px] font-medium">
                        {filePreview.name}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <div className="flex items-end gap-2">
                  <div className="flex items-center gap-0.5 pb-1">
                    <EmojiPicker onSelect={handleEmojiSelect} />
                    <StickerPicker onSelect={handleStickerSelect} />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="p-2 rounded-lg text-slate-400 hover:text-teal-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-40"
                      title="Attach file"
                    >
                      {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none resize-none text-sm transition-all"
                      style={{ minHeight: 44, maxHeight: 120 }}
                      onInput={e => {
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                      }}
                    />
                  </div>

                  <button
                    onClick={sendMessage}
                    disabled={(!inputText.trim() && !filePreview) || sending || uploading}
                    className="px-4 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-extrabold text-sm hover:from-teal-600 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 shrink-0"
                  >
                    {sending || uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-950/30 dark:to-slate-900">
              <div className="text-center max-w-sm px-6">
                <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 flex items-center justify-center text-6xl mx-auto mb-6 border border-slate-200 dark:border-slate-700 shadow-inner">
                  <MessageSquare className="w-12 h-12 text-teal-400 dark:text-teal-500" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">Your Messages</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-8">
                  {isRecruiter
                    ? 'Chat with candidates about interviews, share feedback, and schedule meetings.'
                    : 'Connect with recruiters and get updates about your job applications.'}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button onClick={() => setShowNewChat(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-extrabold rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all shadow-lg shadow-teal-500/20">
                    <Plus className="w-4 h-4" /> New Conversation
                  </button>
                  <p className="text-xs text-slate-400">
                    or select one from the sidebar
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── NEW CHAT MODAL ─── */}
      <AnimatePresence>
        {showNewChat && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowNewChat(false); setUserSearch(''); setSearchResults([]); }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">New Conversation</h3>
                  </div>
                  <button onClick={() => { setShowNewChat(false); setUserSearch(''); setSearchResults([]); }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={userSearch}
                    onChange={e => searchUsers(e.target.value)}
                    placeholder="Search users by name or email..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-sm"
                    autoFocus
                  />
                  {searching && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-teal-500" />}
                </div>
              </div>
              <div className="max-h-[360px] overflow-y-auto p-2">
                {userSearch.length < 2 ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl mb-3">
                      🔍
                    </div>
                    <p className="text-sm font-medium text-slate-400">Type at least 2 characters to search</p>
                  </div>
                ) : searchResults.length === 0 && !searching ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl mb-3">
                      😕
                    </div>
                    <p className="text-sm font-medium text-slate-400">No users found</p>
                  </div>
                ) : (
                  searchResults
                    .filter(u => u._id !== user?._id)
                    .map(u => {
                      const existingConv = conversations.find(c =>
                        c.participants?.some(p => p._id === u._id)
                      );
                      return (
                        <button
                          key={u._id}
                          onClick={() => startConversation(u._id)}
                          disabled={startingConv}
                          className="w-full p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-center gap-3 disabled:opacity-50 group"
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarColor(u._id)} flex items-center justify-center text-white text-lg font-extrabold shrink-0 shadow-sm`}>
                            {getInitials(u.fullName)}
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-extrabold text-slate-800 dark:text-white">{u.fullName}</p>
                            <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              {u.role || 'User'}
                              {existingConv ? ' • Already in conversations' : ''}
                            </p>
                          </div>
                          {startingConv ? (
                            <Loader2 className="w-4 h-4 animate-spin text-teal-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
                          )}
                        </button>
                      );
                    })
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
        <div className="text-5xl py-1 px-1 select-none">
          {msg.text}
        </div>
      );
    }

    if (msg.type === 'image' && msg.file?.url) {
      return (
        <div className="space-y-1.5">
          <div className="relative group">
            <img
              src={getFileUrl(msg.file.url)}
              alt={msg.file.name || 'Image'}
              className="max-w-[260px] max-h-72 rounded-xl object-cover cursor-pointer transition-opacity"
              loading="lazy"
              onClick={() => window.open(getFileUrl(msg.file.url), '_blank')}
            />
            <button
              onClick={() => downloadFile(msg.file.url, msg.file.name)}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 hover:bg-slate-900/80 transition-all"
              title="Download"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
          {msg.text && (
            <p className="text-sm leading-relaxed px-0.5 whitespace-pre-wrap break-words">{msg.text}</p>
          )}
        </div>
      );
    }

    if (msg.type === 'video' && msg.file?.url) {
      return (
        <div className="space-y-1.5 max-w-[300px]">
          <div className="relative group">
            <video controls className="w-full rounded-xl" preload="metadata">
              <source src={getFileUrl(msg.file.url)} />
            </video>
            <button
              onClick={() => downloadFile(msg.file.url, msg.file.name)}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 hover:bg-slate-900/80 transition-all"
              title="Download"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isMine ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-4' : 'mt-0.5'}`}
    >
      <div className={`flex items-end gap-2.5 max-w-[80%] ${isMine ? 'flex-row-reverse' : ''}`}>
        {showAvatar ? (
          <button
            onClick={() => onProfileClick(msg.sender)}
            className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getAvatarColor(msg.sender?._id)} flex items-center justify-center text-white text-[10px] font-extrabold shrink-0 shadow-sm hover:scale-110 transition-transform ${isMine ? 'hidden' : ''}`}
            title="View profile"
          >
            {getInitials(msg.sender?.fullName)}
          </button>
        ) : (
          <div className="w-8 shrink-0" />
        )}

        <div className={`relative ${
          isMine
            ? msg.type === 'sticker'
              ? 'bg-transparent'
              : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-3xl rounded-br-lg shadow-md'
            : msg.type === 'sticker'
              ? 'bg-transparent'
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl rounded-bl-lg'
        } ${msg.type === 'sticker' ? '' : 'px-4 py-2.5'}`}>
          {renderContent()}

          {msg.type !== 'sticker' && (
            <div className={`flex items-center justify-end gap-1 mt-1 ${isMine ? 'text-white/60' : 'text-slate-400'}`}>
              <span className="text-[10px] font-medium">{formatTime(msg.createdAt)}</span>
              {isMine && (
                msg.readAt
                  ? <CheckCheck className="w-3.5 h-3.5 text-teal-300" />
                  : <CheckCheck className="w-3.5 h-3.5 opacity-40" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
