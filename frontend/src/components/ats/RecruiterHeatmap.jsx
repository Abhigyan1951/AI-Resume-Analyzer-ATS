import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle, AlertTriangle, XCircle, Info, ChevronRight, User, UserCheck, Sparkles } from 'lucide-react';

export default function RecruiterHeatmap({ sectionsData, candidateViewMode: externalMode, onToggleMode }) {
  const [internalMode, setInternalMode] = useState('candidate'); // 'candidate' | 'recruiter'
  const isCandidateView = externalMode !== undefined ? externalMode === 'candidate' : internalMode === 'candidate';

  const toggleViewMode = () => {
    if (onToggleMode) {
      onToggleMode();
    } else {
      setInternalMode(prev => prev === 'candidate' ? 'recruiter' : 'candidate');
    }
  };

  const defaultSections = [
    {
      id: 'contact',
      name: 'Contact Information',
      status: 'green',
      score: 95,
      candidateMessage: 'All required contact details present including LinkedIn & GitHub links.',
      recruiterMessage: 'Candidate is reachable with verified GitHub and professional LinkedIn handle.',
      whyItMatters: 'Recruiters reject 40% of resumes missing quick contact links within 6 seconds.',
      atsImpact: '+5 ATS Pts',
      fixes: ['Verify phone number formatting is international standard.'],
    },
    {
      id: 'summary',
      name: 'Professional Summary',
      status: 'yellow',
      score: 72,
      candidateMessage: 'Summary is clear but lacks quantified impact metrics aligned with job requirements.',
      recruiterMessage: 'Generic summary. Could articulate candidate value proposition more forcefully.',
      whyItMatters: 'Executive summary sets the first impression for initial human screeners.',
      atsImpact: '+12 ATS Pts',
      fixes: ['Quantify metrics: replace "Experienced dev" with "Full stack engineer with 4+ yrs experience".', 'Add target role title directly in summary sentence.'],
    },
    {
      id: 'experience',
      name: 'Work Experience',
      status: 'green',
      score: 88,
      candidateMessage: 'Strong action verbs detected with Google XYZ metric structure.',
      recruiterMessage: 'Solid evidence of technical velocity and scalable software delivery.',
      whyItMatters: 'Experience section carries 30% weight in ATS parsing algorithms.',
      atsImpact: '+15 ATS Pts',
      fixes: ['Add Docker & AWS deployment details to recent engineering role.'],
    },
    {
      id: 'projects',
      name: 'Key Projects',
      status: 'green',
      score: 85,
      candidateMessage: 'Full-stack MERN & AI projects showcase practical technical execution.',
      recruiterMessage: 'Demonstrates end-to-end product delivery and modern API integration experience.',
      whyItMatters: 'Projects prove hands-on mastery beyond employment history.',
      atsImpact: '+10 ATS Pts',
      fixes: ['Include live demo deployment link (Vercel/Render).'],
    },
    {
      id: 'skills',
      name: 'Technical Skills',
      status: 'yellow',
      score: 70,
      candidateMessage: 'Good core frontend/backend skills, but missing high-demand DevOps keywords.',
      recruiterMessage: 'Skill coverage is solid for Node/React but missing CI/CD and Cloud keywords.',
      whyItMatters: 'Keyword match accounts for 45% of total ATS filtering score.',
      atsImpact: '+14 ATS Pts',
      fixes: ['Add Docker, GitHub Actions, Redis, and AWS EC2 keywords to skills matrix.'],
    },
    {
      id: 'education',
      name: 'Education',
      status: 'green',
      score: 90,
      candidateMessage: 'Degree and computer science coursework clearly structured.',
      recruiterMessage: 'Meets formal educational qualifications for engineering role.',
      whyItMatters: 'Fulfills automated ATS hard qualification filters.',
      atsImpact: '+5 ATS Pts',
      fixes: [],
    },
    {
      id: 'certifications',
      name: 'Certifications',
      status: 'red',
      score: 40,
      candidateMessage: 'No official cloud or security certifications listed.',
      recruiterMessage: 'Lacks external validation badges (AWS, GCP, or Certified Developer).',
      whyItMatters: 'Certifications boost applicant ranking when competing against senior candidates.',
      atsImpact: '+8 ATS Pts',
      fixes: ['Add AWS Cloud Practitioner or Meta Front-End Developer certification.'],
    },
  ];

  const sections = sectionsData || defaultSections;
  const [selectedSection, setSelectedSection] = useState(sections[1]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'green':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Strong</span>;
      case 'yellow':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Needs Fix</span>;
      case 'red':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Missing</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Recruiter Heatmap & Section Diagnostics
            </h3>
            <p className="text-xs text-slate-400">
              Grammarly-style deep section feedback assessing ATS parseability and recruiter signals.
            </p>
          </div>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={toggleViewMode}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              isCandidateView ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Candidate View
          </button>
          <button
            onClick={toggleViewMode}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              !isCandidateView ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Recruiter View
          </button>
        </div>
      </div>

      {/* Grid Layout: Left Sections List, Right Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Section Quality Heat List */}
        <div className="lg:col-span-6 space-y-3">
          {sections.map((sec) => {
            const isSelected = selectedSection.id === sec.id;
            return (
              <motion.div
                key={sec.id}
                whileHover={{ x: 2 }}
                onClick={() => setSelectedSection(sec)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-blue-500/50 shadow-md shadow-blue-950/30'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{sec.name}</span>
                    <span className="text-xs font-mono font-bold text-slate-400">({sec.score}%)</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {isCandidateView ? sec.candidateMessage : sec.recruiterMessage}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(sec.status)}
                  <ChevronRight className={`w-4 h-4 transition ${isSelected ? 'text-blue-400 translate-x-1' : 'text-slate-600'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Actionable Feedback Drawer */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSection.id + (isCandidateView ? '-cand' : '-rec')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {isCandidateView ? 'Candidate Guidance' : 'Recruiter Perception'}
                  </span>
                  <h4 className="text-base font-bold text-white">{selectedSection.name}</h4>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {selectedSection.atsImpact}
                </span>
              </div>

              {/* Feedback Box */}
              <div className={`p-4 rounded-xl border ${
                isCandidateView ? 'bg-blue-950/30 border-blue-500/30 text-blue-100' : 'bg-indigo-950/30 border-indigo-500/30 text-indigo-100'
              }`}>
                <p className="text-sm leading-relaxed">
                  {isCandidateView ? selectedSection.candidateMessage : selectedSection.recruiterMessage}
                </p>
              </div>

              {/* AI Explainability */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <Info className="w-4 h-4" />
                  Why This Recommendation Matters
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedSection.whyItMatters}
                </p>
              </div>

              {/* Actionable Fixes */}
              {selectedSection.fixes && selectedSection.fixes.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Suggested Action Items
                  </h5>
                  <div className="space-y-2">
                    {selectedSection.fixes.map((fix, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{fix}</span>
                      </div>
                    ))}
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
