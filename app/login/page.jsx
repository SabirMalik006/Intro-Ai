"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, loginWithGoogle } from "../api/auth";
import { useToast } from "@/components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      
      toast(response.message || 'Welcome back!', 'success');
      
      router.push("/");
    } catch (error) {
      toast(error.message || 'Login failed', 'error');
      setErrors({ general: error.message });
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
      {/* Animated Background Orbs */}
      <div style={{
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(200,241,53,0.4), transparent)",
        top: "-10%", right: "-15%",
        position: "absolute", borderRadius: "50%",
        filter: "blur(80px)", opacity: 0.35,
        animation: "float 14s ease infinite"
      }} />
      <div style={{
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(59,91,252,0.35), transparent)",
        bottom: "-10%", left: "-12%",
        position: "absolute", borderRadius: "50%",
        filter: "blur(80px)", opacity: 0.35,
        animation: "float 18s ease infinite",
        animationDelay: "-5s"
      }} />
      <div style={{
        width: 300, height: 300,
        background: "radial-gradient(circle, rgba(255,107,53,0.25), transparent)",
        top: "40%", left: "30%",
        position: "absolute", borderRadius: "50%",
        filter: "blur(80px)", opacity: 0.35,
        animation: "float 22s ease infinite",
        animationDelay: "-10s"
      }} />

      {/* Grid Background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none"
      }} />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(1deg); }
          66% { transform: translateY(-6px) rotate(-1deg); }
        }
      `}</style>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-12" style={{ position: "relative", zIndex: 1 }}>
        {/* Left Side - Brand/Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 max-w-lg text-center lg:text-left"
        >
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
            <img src="/Gemini_Generated_Image_dqsy35dqsy35dqsy.png" alt="SmartHire" className="w-14 h-14 rounded-xl object-cover" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Smart<span className="text-teal-400">Hire</span>
              </h1>
              <p className="text-gray-400">AI-Powered Hiring Platform</p>
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Welcome Back
          </h2>
          
          <p className="text-lg text-gray-400 mb-8">
            Sign in to access your dashboard and continue conducting intelligent, 
            AI-powered interviews.
          </p>
          
          <div className="space-y-4 mb-10">
            {["Access interview analytics", "Manage candidate profiles", "Generate smart reports"].map((feature, i) => (
              <div key={i} className="flex items-center">
                <div className="w-8 h-8 bg-teal-900/30 rounded-lg flex items-center justify-center mr-3 border border-teal-500/20">
                  <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-gray-500">
            Trusted by 200+ companies worldwide
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-1/2 max-w-md w-full"
        >
          <div className="bg-gray-900/80 border border-gray-700/50 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Sign in to your account
              </h2>
              <p className="text-gray-400 mt-2">
                Enter your credentials to continue
              </p>
            </div>

            {errors.general && (
              <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm mb-6">
                {errors.general}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-800 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all ${
                    errors.email ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <a href="#" className="text-sm text-teal-400 hover:text-teal-300 font-medium">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-800 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all ${
                    errors.password ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="remember" className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-600 rounded" />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-400">Remember me</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-gray-900 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
              
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="flex">
                <button type="button" onClick={loginWithGoogle} className="w-full py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
              </div>
            </form>

            <p className="text-center text-gray-400 mt-8 text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}