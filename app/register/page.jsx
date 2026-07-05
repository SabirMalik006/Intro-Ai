"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginWithGoogle } from "../api/auth";
import { useToast } from "@/components/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [userType, setUserType] = useState("recruiter");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Minimum 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (userType === "recruiter" && !formData.company.trim()) newErrors.company = "Company name is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: userType,
        ...(userType === "recruiter" && { company: formData.company }),
      };

      const response = await registerUser(userData);
      
      toast('Account created successfully! Please log in.', 'success');
      
      router.push("/login");
    } catch (error) {
      toast(error.message || 'Registration failed', 'error');
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
      <div className="orb" style={{
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(200,241,53,0.4), transparent)",
        top: "-10%", right: "-15%",
        position: "absolute", borderRadius: "50%",
        filter: "blur(80px)", opacity: 0.35,
        animation: "float 14s ease infinite"
      }} />
      <div className="orb" style={{
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(59,91,252,0.35), transparent)",
        bottom: "-10%", left: "-12%",
        position: "absolute", borderRadius: "50%",
        filter: "blur(80px)", opacity: 0.35,
        animation: "float 18s ease infinite",
        animationDelay: "-5s"
      }} />
      <div className="orb" style={{
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
            Join SmartHire Today
          </h2>
          
          <p className="text-lg text-gray-400 mb-8">
            Start conducting intelligent, AI-powered interviews and transform your 
            hiring process with data-driven insights.
          </p>
          
          <div className="space-y-4 mb-10">
            {[
              "AI-powered interview conduction",
              "Detailed candidate analytics",
              "Bias-free evaluation system",
              "Custom interview templates"
            ].map((feature, i) => (
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
          
          <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-300 px-4 py-2 rounded-full text-sm font-medium border border-teal-500/20">
            <span className="flex h-2 w-2 bg-teal-400 rounded-full animate-pulse"></span>
            Start your 14-day free trial today
          </div>
        </motion.div>

        {/* Right Side - Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-1/2 max-w-md w-full"
        >
          <div className="bg-gray-900/80 border border-gray-700/50 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Create your account
              </h2>
              <p className="text-gray-400 mt-2">
                Fill in your details to get started
              </p>
            </div>

            {errors.general && (
              <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm mb-6">
                {errors.general}
              </div>
            )}

            {/* User Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("recruiter")}
                  className={`py-3 rounded-xl border transition-all ${
                    userType === "recruiter"
                      ? "border-teal-500 bg-teal-500/10 text-teal-300"
                      : "border-gray-600 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  👔 Recruiter
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("candidate")}
                  className={`py-3 rounded-xl border transition-all ${
                    userType === "candidate"
                      ? "border-teal-500 bg-teal-500/10 text-teal-300"
                      : "border-gray-600 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  👨‍💻 Candidate
                </button>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-800 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all ${
                    errors.fullName ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
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
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-800 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all ${
                    errors.password ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.password ? (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters with letters and numbers</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-800 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {userType === "recruiter" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border bg-gray-800 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all ${
                      errors.company ? "border-red-500" : "border-gray-600"
                    }`}
                  />
                  {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company}</p>}
                </div>
              )}

              <div className="flex items-start pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-600 rounded mt-1"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                  I agree to the{" "}
                  <a href="#" className="text-teal-400 hover:text-teal-300 font-medium">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-teal-400 hover:text-teal-300 font-medium">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl font-semibold text-gray-900 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-500">Or sign up with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={loginWithGoogle} className="w-full py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button type="button" disabled className="w-full py-3 rounded-xl border border-gray-700/50 text-gray-500 cursor-not-allowed flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>
            </form>

            <p className="text-center text-gray-400 mt-8 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}