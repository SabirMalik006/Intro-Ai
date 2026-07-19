"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "../api/auth";
import { useToast } from "@/components/Toast";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password) { setError("Password is required"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    setError("");
    setLoading(true);

    try {
      const res = await resetPassword(email, token, form.password);
      toast(res.message || "Password reset successfully", "success");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      toast(err.message || "Password reset failed", "error");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #13131a 100%)" }}>
        <div className="bg-gray-900/80 border border-gray-700/50 p-8 rounded-2xl text-center">
          <p className="text-gray-400 mb-4">Invalid reset link. Please start again.</p>
          <Link href="/forgot-password" className="text-teal-400 hover:text-teal-300 font-medium">
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{
      background: "linear-gradient(180deg, #0a0a0f 0%, #13131a 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-teal-500/10 to-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-900/80 border border-gray-700/50 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Reset Password</h2>
            <p className="text-gray-400 mt-2 text-sm">
              Enter your new password for <span className="text-teal-400 font-medium">{email}</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={form.confirmPassword}
                onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-gray-900 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400 transition-colors">
              <Lock className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
