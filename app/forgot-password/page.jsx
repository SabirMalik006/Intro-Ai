"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "../api/auth";
import { useToast } from "@/components/Toast";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required"); return; }
    setError("");
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      toast(res.message || "OTP sent to your email", "success");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast(err.message || "Failed to send OTP", "error");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
            <p className="text-gray-400 mt-2 text-sm">
              Enter your email and we'll send you an OTP to reset your password.
            </p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-gray-900 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
