import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Code, Globe, FileText, Heart } from 'lucide-react';

export const LandingFooter = () => {
  return (
    <footer className="border-t border-[#1F2937] bg-[#0B1020] pt-16 pb-12 text-[#9CA3AF] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#4F8CFF]/20">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#F9FAFB]">
                Resum<span className="text-[#4F8CFF]">AI</span>
              </span>
            </Link>
            <p className="text-sm text-[#9CA3AF] max-w-sm leading-relaxed">
              Enterprise AI Resume Analyzer & ATS Optimization Platform. Land more interviews with intelligent keyword matching and Google XYZ bullet rewrites.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-[#F9FAFB] uppercase tracking-wider">
              Platform Features
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-[#4F8CFF] transition-colors">
                  ATS Match Scoring
                </a>
              </li>
              <li>
                <a href="#interactive-demo" className="hover:text-[#4F8CFF] transition-colors">
                  Gemini AI Bullet Rewriter
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#4F8CFF] transition-colors">
                  Skill Gap Detection
                </a>
              </li>
              <li>
                <a href="#tech-stack" className="hover:text-[#4F8CFF] transition-colors">
                  Enterprise Security & JWT
                </a>
              </li>
            </ul>
          </div>

          {/* External Links & Docs */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-[#F9FAFB] uppercase tracking-wider">
              Developer Resources
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#4F8CFF] transition-colors"
                >
                  <Code className="w-3.5 h-3.5 text-[#4F8CFF]" /> GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#4F8CFF] transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-[#7C3AED]" /> LinkedIn Network
                </a>
              </li>
              <li>
                <a
                  href="/api/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#4F8CFF] transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#22C55E]" /> API Health Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1F2937]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} ResumAI Platform. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[#9CA3AF]">
            Built with React 19 + Node.js + Express + MongoDB + Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
