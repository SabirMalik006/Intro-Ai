// app/page.js - Main Homepage with New Professional Colors
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import Testimonial from "@/components/Testimonial";
import PricingCard from "@/components/PricingCard";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24  text-center">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-teal-100">
            <span className="flex h-2 w-2 bg-teal-500 rounded-full animate-pulse"></span>
            AI-Powered Hiring Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            When Recruiters Are Busy, 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 mt-2">
              AI Takes the Interview
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-xl text-gray-600 mb-10">
            SmartHire conducts professional, job-specific AI interviews, evaluates candidates 
            with unbiased precision, and delivers actionable insights — saving 80% of your hiring time.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <a
              href="/register"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-teal-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Start Free Trial</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#demo"
              className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-teal-300 hover:bg-teal-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="text-3xl font-bold text-teal-600">5000+</div>
              <div className="text-gray-600 mt-2">Interviews Conducted</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="text-3xl font-bold text-teal-600">98%</div>
              <div className="text-gray-600 mt-2">Candidate Satisfaction</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="text-3xl font-bold text-teal-600">40hrs</div>
              <div className="text-gray-600 mt-2">Saved Per Hire</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="text-3xl font-bold text-teal-600">200+</div>
              <div className="text-gray-600 mt-2">Companies Trust Us</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why <span className="text-teal-600">SmartHire</span> Stands Out
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your hiring process with cutting-edge AI technology designed for modern recruitment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🤖"
              title="AI as a Backup Recruiter"
              description="When human recruiters are unavailable, AI conducts structured, professional interviews with natural conversation flow."
              gradient="from-slate-600 to-gray-700"
            />
            <FeatureCard
              icon="📄"
              title="Resume-Aware Interviews"
              description="AI analyzes resumes in real-time, asking job-specific questions tailored to each candidate's experience and skills."
              gradient="from-teal-600 to-blue-600"
            />
            <FeatureCard
              icon="📊"
              title="Smart Analytics Dashboard"
              description="Comprehensive scoring, behavioral insights, and downloadable PDF reports for data-driven hiring decisions."
              gradient="from-blue-600 to-indigo-600"
            />
            <FeatureCard
              icon="🎯"
              title="Custom Interview Templates"
              description="Pre-built templates for various roles or create your own with specific competency frameworks."
              gradient="from-emerald-600 to-teal-600"
            />
            <FeatureCard
              icon="⚖️"
              title="Bias-Free Evaluation"
              description="Objective assessment algorithms that minimize unconscious bias and ensure fair candidate evaluation."
              gradient="from-amber-600 to-orange-600"
            />
            <FeatureCard
              icon="🔄"
              title="Seamless Integration"
              description="Integrate with your existing ATS, calendar, and HR tools for a smooth workflow experience."
              gradient="from-violet-600 to-purple-600"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From setup to insights, streamline your hiring process effortlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-teal-200 via-blue-200 to-teal-200" />
            
            <Step 
              number="1" 
              title="Setup Interview"
              description="Create custom interviews with role-specific questions or choose from our template library."
              icon="⚙️"
            />
            <Step 
              number="2" 
              title="AI Conducts Interview"
              description="Candidates complete AI-led interviews at their convenience, with real-time analysis."
              icon="🎤"
              delay="100"
            />
            <Step 
              number="3" 
              title="Review & Decide"
              description="Access detailed reports, compare candidates, and make informed hiring decisions."
              icon="📈"
              delay="200"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Industry Leaders
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Testimonial
              quote="SmartHire reduced our time-to-hire by 65%. The AI interviews are incredibly natural and insightful."
              name="Sarah Johnson"
              role="HR Director, TechCorp"
              avatar="SJ"
            />
            <Testimonial
              quote="The bias-free evaluation helped us build a more diverse team. Game changer for modern hiring."
              name="Michael Chen"
              role="Talent Lead, StartupXYZ"
              avatar="MC"
            />
            <Testimonial
              quote="Candidates love the flexibility, and we love the detailed analytics. Win-win solution!"
              name="Priya Patel"
              role="Recruitment Manager, GrowthLabs"
              avatar="PP"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your hiring needs. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              plan="Starter"
              price="$99"
              period="/month"
              description="Perfect for small teams"
              features={["Up to 10 interviews/month", "Basic AI interviews", "Standard reports", "Email support"]}
              highlighted={false}
            />
            <PricingCard
              plan="Professional"
              price="$299"
              period="/month"
              description="Most popular for growing companies"
              features={["Up to 50 interviews/month", "Advanced AI interviews", "Detailed analytics", "Priority support", "Custom templates", "ATS integration"]}
              highlighted={true}
            />
            <PricingCard
              plan="Enterprise"
              price="Custom"
              period=""
              description="For large organizations"
              features={["Unlimited interviews", "Custom AI models", "Dedicated support", "White-label option", "API access", "Custom training"]}
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-slate-200 mb-10 max-w-3xl mx-auto">
            Join thousands of companies already making smarter hiring decisions with SmartHire.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/register"
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold hover:bg-teal-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Start Free 14-Day Trial
            </a>
            <a
              href="/demo"
              className="px-10 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white transition-all duration-300"
            >
              Schedule a Demo
            </a>
          </div>
          
          <p className="text-slate-300 mt-8 text-sm">
            No credit card required • Cancel anytime • 24/7 Support
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Step({ number, title, description, icon, delay = "0" }) {
  return (
    <div className="text-center relative group">
      <div className="relative inline-flex items-center justify-center w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl transform group-hover:scale-110 transition-transform duration-300"></div>
        <div className="relative z-10 text-3xl">{icon}</div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
          {number}
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 px-4">{description}</p>
    </div>
  );
}