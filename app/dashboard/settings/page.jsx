"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import useAuthStore from "@/store/authStore";
import { useToast } from "@/components/Toast";
import {
  User, Shield, Bell, Users, HelpCircle, Save,
  Eye, EyeOff, Trash2, Loader2, X, Mail, Plus,
  Copy, ExternalLink, KeyRound, Building2,
  Phone, BookOpen, Sparkles, ChevronRight, AlertTriangle,
  Clock, UserCheck, CalendarDays
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team", icon: Users },
  { id: "help", label: "Help", icon: HelpCircle },
];

const notifOptions = [
  { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
  { key: "interviews", label: "Interview Updates", desc: "Get notified about interview schedule changes" },
  { key: "candidates", label: "Candidate Activity", desc: "Candidate application and status changes" },
  { key: "reports", label: "Weekly Reports", desc: "Weekly and monthly performance summaries" },
  { key: "marketing", label: "Marketing", desc: "Product updates, tips, and promotional content" },
];

const faqItems = [
  { q: "How do I change my password?", a: "Go to Account settings, enter your current password and new password, then click Update Password." },
  { q: "How do I invite team members?", a: "Go to Team settings, enter the email address and click Send Invite. They'll receive an invitation to join your team." },
  { q: "Can I recover a deleted account?", a: "Account deletion is irreversible. If you need help, contact our support team." },
  { q: "How do notifications work?", a: "You can manage all notification preferences in the Notifications tab. Changes take effect immediately." },
  { q: "Who can see my profile?", a: "Your profile is visible to your team members and recruiters when you apply for jobs." },
];

export default function SettingsPage() {
  const { user, updateProfile, updatePassword, deleteAccount } = useAuthStore();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [loadingTeam, setLoadingTeam] = useState(false);

  // ─── Profile State ───
  const [profile, setProfile] = useState({
    fullName: "", phone: "", bio: "", skills: "",
  });

  // ─── Password State ───
  const [passwordData, setPasswordData] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [changingPassword, setChangingPassword] = useState(false);

  // ─── Delete Account ───
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ─── Notification State ───
  const [notifications, setNotifications] = useState({
    email: true, interviews: true, candidates: true, reports: false, marketing: false,
  });

  // ─── Team State ───
  const [team, setTeam] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteRole, setInviteRole] = useState("member");

  // ─── Sync user data ───
  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        phone: user.phone || "",
        bio: user.bio || "",
        skills: Array.isArray(user.skills) ? user.skills.join(", ") : "",
      });
      if (user.notificationPreferences) {
        setNotifications(prev => ({ ...prev, ...user.notificationPreferences }));
      }
      if (user.fullName) {
        const initials = user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        setAvatarInitials(initials);
      }
    }
  }, [user]);

  const [avatarInitials, setAvatarInitials] = useState("U");

  // ─── Profile Save ───
  const handleSaveProfile = async () => {
    setSaving(true);
    const data = {
      fullName: profile.fullName,
      phone: profile.phone,
      bio: profile.bio,
      skills: profile.skills ? profile.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
    };
    const res = await updateProfile(data);
    if (res.success) {
      toast(res.message, 'success');
    } else {
      toast(res.message, 'error');
    }
    setSaving(false);
  };

  // ─── Password Change ───
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast("New passwords do not match", 'error');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast("Password must be at least 8 characters", 'error');
      return;
    }
    setChangingPassword(true);
    const res = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
    if (res.success) {
      toast(res.message, 'success');
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      toast(res.message, 'error');
    }
    setChangingPassword(false);
  };

  // ─── Delete Account ───
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast("Please enter your password", 'error');
      return;
    }
    setDeleting(true);
    const res = await deleteAccount(deletePassword);
    if (res.success) {
      toast(res.message, 'info');
      window.location.href = '/login';
    } else {
      toast(res.message, 'error');
      setDeleting(false);
    }
  };

  // ─── Notifications Save ───
  const handleSaveNotifications = async () => {
    setSaving(true);
    const res = await updateProfile({ notificationPreferences: notifications });
    if (res.success) {
      toast("Notification preferences saved", 'success');
    } else {
      toast(res.message, 'error');
    }
    setSaving(false);
  };

  // ─── Team ───
  const fetchTeam = useCallback(async () => {
    setLoadingTeam(true);
    try {
      const res = await api.get('/team');
      setTeam(res.data.data.team);
    } catch (err) {
      // Silently fail
    }
    setLoadingTeam(false);
  }, []);

  useEffect(() => {
    if (activeTab === "team") fetchTeam();
  }, [activeTab, fetchTeam]);

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast("Please enter an email address", 'error');
      return;
    }
    setInviting(true);
    try {
      const res = await api.post('/team/invite', { email: inviteEmail, role: inviteRole });
      if (res.data.success) {
        toast(res.data.message, 'success');
        setInviteEmail("");
        fetchTeam();
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to send invite', 'error');
    }
    setInviting(false);
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const res = await api.delete(`/team/members/${memberId}`);
      if (res.data.success) {
        toast("Member removed", 'success');
        fetchTeam();
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to remove member', 'error');
    }
  };

  const handleRevokeInvite = async (inviteId) => {
    try {
      const res = await api.delete(`/team/invites/${inviteId}`);
      if (res.data.success) {
        toast("Invitation revoked", 'success');
        fetchTeam();
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to revoke invite', 'error');
    }
  };

  const copyInviteLink = (token) => {
    const link = `${window.location.origin}/invite?token=${token}`;
    navigator.clipboard.writeText(link);
    toast("Invite link copied", 'success');
  };

  // ─── Render ───
  const renderIcon = (Icon, active) => (
    <div className={`p-2 rounded-xl transition-all duration-300 ${
      active
        ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm"
        : "text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800"
    }`}>
      <Icon className="w-4 h-4" />
    </div>
  );

  return (
    <div className="min-h-screen pb-16">
      {/* ─── HEADER ─── */}
      <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 lg:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold text-indigo-200 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Settings
            </div>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-1">Settings</h1>
          <p className="text-indigo-200 text-sm font-medium">Manage your account, team, and preferences</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ─── SIDEBAR ─── */}
        <div className="lg:w-56 shrink-0">
          <div className="lg:sticky lg:top-6 flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap lg:whitespace-normal ${
                    active
                      ? "bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  {renderIcon(tab.icon, active)}
                  <span>{tab.label}</span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 lg:block hidden" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── CONTENT ─── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {/* ═══════════════════ PROFILE ═══════════════════ */}
              {activeTab === "profile" && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shadow-indigo-500/20 shrink-0">
                        {avatarInitials}
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Profile</h2>
                        <p className="text-sm text-slate-400 font-medium">Update your personal information</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-sm font-medium placeholder-slate-400"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                          <Phone className="w-3 h-3" /> Phone
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-sm font-medium placeholder-slate-400"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3" /> Bio
                        </label>
                        <textarea
                          rows={3}
                          value={profile.bio}
                          onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-sm font-medium placeholder-slate-400 resize-none"
                          placeholder="Tell us about yourself..."
                          maxLength={500}
                        />
                        <p className="text-xs text-slate-400 mt-1 text-right">{profile.bio.length}/500</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-3 h-3" /> Skills
                        </label>
                        <input
                          type="text"
                          value={profile.skills}
                          onChange={e => setProfile(p => ({ ...p, skills: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-sm font-medium placeholder-slate-400"
                          placeholder="React, Node.js, MongoDB, TypeScript"
                        />
                        <p className="text-xs text-slate-400 mt-1">Separate skills with commas</p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════ ACCOUNT ═══════════════════ */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="p-6 lg:p-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
                          <KeyRound className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Change Password</h2>
                          <p className="text-sm text-slate-400 font-medium">Update your account password</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { key: "current", label: "Current Password", value: passwordData.currentPassword, onChange: v => setPasswordData(p => ({ ...p, currentPassword: v })) },
                          { key: "new", label: "New Password", value: passwordData.newPassword, onChange: v => setPasswordData(p => ({ ...p, newPassword: v })) },
                          { key: "confirm", label: "Confirm Password", value: passwordData.confirmPassword, onChange: v => setPasswordData(p => ({ ...p, confirmPassword: v })) },
                        ].map((field) => (
                          <div key={field.key}>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{field.label}</label>
                            <div className="relative">
                              <input
                                type={showPasswords[field.key] ? "text" : "password"}
                                value={field.value}
                                onChange={e => field.onChange(e.target.value)}
                                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-sm font-medium"
                                placeholder="••••••••"
                              />
                              <button
                                onClick={() => setShowPasswords(p => ({ ...p, [field.key]: !p[field.key] }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                              >
                                {showPasswords[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={handleChangePassword}
                          disabled={changingPassword}
                          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                          {changingPassword ? "Updating..." : "Update Password"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="p-6 lg:p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20 shrink-0">
                          <Trash2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Danger Zone</h2>
                          <p className="text-sm text-slate-400 font-medium">Irreversible account deletion</p>
                        </div>
                      </div>

                      <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl mb-6">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-red-700 dark:text-red-400">This action cannot be undone</p>
                            <p className="text-xs text-red-500 dark:text-red-400/80 mt-1">All your data will be permanently removed. Your jobs, analyses, and team memberships will be lost.</p>
                          </div>
                        </div>
                      </div>

                      {!showDeleteConfirm ? (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl transition-all active:scale-[0.97] text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete My Account
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Enter your password to confirm</label>
                            <div className="relative max-w-xs">
                              <input
                                type="password"
                                value={deletePassword}
                                onChange={e => setDeletePassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-red-300 dark:border-red-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all text-sm font-medium"
                                placeholder="Your password"
                                autoFocus
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleDeleteAccount}
                              disabled={deleting || !deletePassword}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              {deleting ? "Deleting..." : "Confirm Delete"}
                            </button>
                            <button
                              onClick={() => { setShowDeleteConfirm(false); setDeletePassword(""); }}
                              className="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════ NOTIFICATIONS ═══════════════════ */}
              {activeTab === "notifications" && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 shrink-0">
                        <Bell className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Notification Preferences</h2>
                        <p className="text-sm text-slate-400 font-medium">Choose what updates you receive</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {notifOptions.map((opt) => (
                        <div
                          key={opt.key}
                          className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
                              notifications[opt.key] ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"
                            }`} />
                            <div>
                              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{opt.label}</h4>
                              <p className="text-xs text-slate-400">{opt.desc}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setNotifications(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))}
                            className={`relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 ${
                              notifications[opt.key]
                                ? "bg-indigo-500 shadow-sm shadow-indigo-500/30"
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          >
                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                              notifications[opt.key] ? "translate-x-6" : "translate-x-0.5"
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={handleSaveNotifications}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : "Save Preferences"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════ TEAM ═══════════════════ */}
              {activeTab === "team" && (
                <div className="space-y-6">
                  {/* Invite */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="p-6 lg:p-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
                          <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Invite Members</h2>
                          <p className="text-sm text-slate-400 font-medium">Add people to your team</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            placeholder="colleague@company.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-sm font-medium"
                          />
                        </div>
                        <select
                          value={inviteRole}
                          onChange={e => setInviteRole(e.target.value)}
                          className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm font-medium"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={handleInvite}
                          disabled={inviting || !inviteEmail}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed text-sm shrink-0"
                        >
                          {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                          {inviting ? "Sending..." : "Send Invite"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Members & Invites List */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="p-6 lg:p-8">
                      <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" />
                        Team Members
                      </h3>

                      {loadingTeam ? (
                        <div className="space-y-3">
                          {[1,2,3].map(i => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 animate-pulse">
                              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : team && team.members && team.members.length > 0 ? (
                        <div className="space-y-2">
                          {team.members.map((member, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all group"
                            >
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-extrabold shadow-sm">
                                  {member.user?.fullName?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??"}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                                    {member.user?.fullName || "Unknown"}
                                    {member.user?._id === user?._id && (
                                      <span className="ml-2 text-[10px] text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">You</span>
                                    )}
                                  </p>
                                  <p className="text-xs text-slate-400 truncate">{member.user?.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                  member.role === "admin"
                                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                                    : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                }`}>
                                  {member.role}
                                </span>
                                {member.user?._id !== user?._id && (
                                  <button
                                    onClick={() => handleRemoveMember(member.user?._id)}
                                    className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                                    title="Remove member"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-400">
                          <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                          <p className="font-bold">No team members yet</p>
                          <p className="text-sm">Invite members to build your team</p>
                        </div>
                      )}

                      {/* Pending Invites */}
                      {team && team.invites && team.invites.length > 0 && (
                        <>
                          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Pending Invitations ({team.invites.length})
                            </h4>
                            <div className="space-y-2">
                              {team.invites.map((invite) => (
                                <div
                                  key={invite._id}
                                  className="flex items-center justify-between p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30"
                                >
                                  <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <div>
                                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{invite.email}</p>
                                      <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">{invite.role}</span>
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                          <CalendarDays className="w-3 h-3" />
                                          {new Date(invite.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => copyInviteLink(invite.token)}
                                      className="p-2 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                                      title="Copy invite link"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleRevokeInvite(invite._id)}
                                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                      title="Revoke invite"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════ HELP ═══════════════════ */}
              {activeTab === "help" && (
                <div className="space-y-6">
                  {/* FAQ */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="p-6 lg:p-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
                          <HelpCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Frequently Asked Questions</h2>
                          <p className="text-sm text-slate-400 font-medium">Quick answers to common questions</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {faqItems.map((faq, idx) => (
                          <details key={idx} className="group">
                            <summary className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all list-none">
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{faq.q}</span>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                            </summary>
                            <div className="px-4 pb-4 pt-2">
                              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact Support */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="p-6 lg:p-8">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
                            <Mail className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Need more help?</h3>
                            <p className="text-sm text-slate-400 font-medium mt-1">Our support team is here to assist you</p>
                          </div>
                        </div>
                        <a
                          href="mailto:support@smarthire.com"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.97] text-sm shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Contact Support
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
