import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const LandingNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B1020]/90 backdrop-blur-xl border-b border-[#1F2937]/80 py-3 shadow-2xl shadow-black/50'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#4F8CFF]/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#F9FAFB]">
            Resum<span className="text-[#4F8CFF]">AI</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9CA3AF]">
          <a href="#features" className="hover:text-[#F9FAFB] transition-colors">
            Features
          </a>
          <a href="#interactive-demo" className="hover:text-[#F9FAFB] transition-colors">
            ATS Demo
          </a>
          <a href="#how-it-works" className="hover:text-[#F9FAFB] transition-colors">
            How It Works
          </a>
          <a href="#tech-stack" className="hover:text-[#F9FAFB] transition-colors">
            Tech Stack
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Get Started Free
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-xl text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1A2235]"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1020]/95 backdrop-blur-2xl border-b border-[#1F2937] px-4 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col gap-3 text-sm font-medium text-[#9CA3AF]">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#1A2235] hover:text-[#F9FAFB]"
            >
              Features
            </a>
            <a
              href="#interactive-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#1A2235] hover:text-[#F9FAFB]"
            >
              ATS Demo
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#1A2235] hover:text-[#F9FAFB]"
            >
              How It Works
            </a>
            <a
              href="#tech-stack"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#1A2235] hover:text-[#F9FAFB]"
            >
              Tech Stack
            </a>
          </nav>

          <div className="pt-3 border-t border-[#1F2937] flex flex-col gap-2">
            <Button
              variant="secondary"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
            >
              Log In
            </Button>
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/dashboard');
              }}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNav;
