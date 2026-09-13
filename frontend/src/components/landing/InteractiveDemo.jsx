import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Sparkles, CheckCircle2, XCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const InteractiveDemo = () => {
  const [activeTab, setActiveTab] = useState('optimized');

  const score = activeTab === 'optimized' ? 92 : 58;

  return (
    <div className="w-full rounded-3xl glass-elevated border border-[#1F2937] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#4F8CFF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2937]/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" dot>
              Interactive Live Simulation
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-[#F9FAFB]">ATS Keyword & Score Simulator</h3>
        </div>

        {/* Demo Mode Toggle Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-[#111827] border border-[#1F2937]">
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'raw'
                ? 'bg-[#1A2235] text-[#F9FAFB] shadow-md'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            Raw Resume (58%)
          </button>
          <button
            onClick={() => setActiveTab('optimized')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'optimized'
                ? 'bg-[#4F8CFF] text-white shadow-md shadow-[#4F8CFF]/30'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            AI Optimized (92%)
          </button>
        </div>
      </div>

      {/* Demo Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Score Ring Widget (Left) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl glass-soft border border-[#1F2937] text-center space-y-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Circular Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#1F2937"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                stroke={activeTab === 'optimized' ? '#22C55E' : '#F59E0B'}
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray="264"
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (264 * score) / 100 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={score}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-black tracking-tight text-[#F9FAFB]"
              >
                {score}%
              </motion.span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                ATS Match Rate
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-[#F9FAFB]">
              {activeTab === 'optimized'
                ? 'High Candidate Priority'
                : 'Potential ATS Filter Rejection'}
            </h4>
            <p className="text-xs text-[#9CA3AF] max-w-xs">
              {activeTab === 'optimized'
                ? 'Resume matches 92% of critical keywords and uses Google XYZ metric formatting.'
                : 'Missing 6 core technical skills and action verbs required by job post.'}
            </p>
          </div>
        </div>

        {/* Live Breakdown Cards (Right) */}
        <div className="lg:col-span-7 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Keywords Matched Chips */}
              <div className="p-4 rounded-xl glass-card border border-[#1F2937] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Matched Keywords
                  </span>
                  <span className="text-[#22C55E] font-bold">
                    {activeTab === 'optimized' ? '18 Keywords' : '8 Keywords'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['React 19', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Microservices', 'CI/CD'].map(
                    (kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                      >
                        ✓ {kw}
                      </span>
                    )
                  )}
                  {activeTab === 'optimized' &&
                    ['PostgreSQL', 'GraphQL', 'System Design', 'Jest'].map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                </div>
              </div>

              {/* Missing Skills Chips */}
              <div className="p-4 rounded-xl glass-card border border-[#1F2937] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-[#EF4444]" /> Missing Skill Gaps
                  </span>
                  <span className="text-[#EF4444] font-bold">
                    {activeTab === 'optimized' ? '0 Missing' : '4 Missing'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeTab === 'raw' ? (
                    ['GraphQL', 'System Design', 'PostgreSQL', 'Jest'].map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
                      >
                        ✕ {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#22C55E] font-medium">
                      All required keywords incorporated cleanly!
                    </span>
                  )}
                </div>
              </div>

              {/* Sample AI Bullet Transformation */}
              <div className="p-4 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/30 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#a78bfa]">
                  <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#7C3AED]" /> Sample AI Bullet Rewrite
                  </span>
                  <span className="text-[10px] font-mono bg-[#7C3AED]/20 px-2 py-0.5 rounded">
                    Google XYZ Formula
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#F9FAFB] leading-relaxed font-medium">
                  {activeTab === 'optimized'
                    ? '"Architected resilient backend microservices on AWS handling 5M+ daily requests, improving throughput by 40% and decreasing latency by 150ms."'
                    : '"Worked on backend microservices and fixed performance issues."'}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
