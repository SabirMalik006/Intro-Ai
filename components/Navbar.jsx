// components/Navbar.js
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll function
  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    
    if (href.startsWith('#')) {
      // Handle section links
      const element = document.querySelector(href);
      if (element) {
        const offset = 80; // Navbar height offset
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // Handle regular page links
      window.location.href = href;
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white shadow-md border-b" 
        : "bg-white border-b"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">SH</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Smart<span className="text-teal-600">Hire</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href="#features" onClick={handleSmoothScroll}>
              Features
            </NavLink>
            <NavLink href="#how" onClick={handleSmoothScroll}>
              How It Works
            </NavLink>
            <NavLink href="#pricing" onClick={handleSmoothScroll}>
              Pricing
            </NavLink>
            <NavLink href="#testimonials" onClick={handleSmoothScroll}>
              Testimonials
            </NavLink>
            <NavLink href="/">
              Resources
            </NavLink>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-teal-200 transition-all duration-300"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <MobileNavLink href="#features" onClick={(e) => handleSmoothScroll(e, '#features')}>
                Features
              </MobileNavLink>
              <MobileNavLink href="#how" onClick={(e) => handleSmoothScroll(e, '#how')}>
                How It Works
              </MobileNavLink>
              <MobileNavLink href="#pricing" onClick={(e) => handleSmoothScroll(e, '#pricing')}>
                Pricing
              </MobileNavLink>
              <MobileNavLink href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')}>
                Testimonials
              </MobileNavLink>
              <MobileNavLink href="/blog" onClick={() => setMobileMenuOpen(false)}>
                Resources
              </MobileNavLink>
              <div className="pt-4 space-y-3">
                <Link
                  href="/login"
                  className="block w-full px-4 py-3 text-center rounded-xl border border-gray-300 text-gray-700 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block w-full px-4 py-3 text-center rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, children, onClick }) {
  const handleClick = (e) => {
    if (href.startsWith('#') && onClick) {
      onClick(e, href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="px-4 py-2 rounded-xl text-gray-700 hover:text-teal-600 font-medium transition-colors hover:bg-gray-50 cursor-pointer"
    >
      {children}
    </a>
  );
}

function MobileNavLink({ href, children, onClick }) {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="px-4 py-3 rounded-xl text-gray-700 hover:text-teal-600 font-medium transition-colors hover:bg-gray-50 cursor-pointer"
    >
      {children}
    </a>
  );
}