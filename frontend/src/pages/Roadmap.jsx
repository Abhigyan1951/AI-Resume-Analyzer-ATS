import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, CheckSquare, Square, Clock, ArrowRight, ExternalLink, Sparkles, AlertCircle, RefreshCw, Layers, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Roadmap() {
  const { token, user } = useAuth();
  const { showToast } = useToast();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | '7_days' | '30_days' | '60_days' | '90_days'
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/roadmap', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setRoadmap(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRoadmap();
    }
  }, [token]);

  const handleToggleMilestone = async (milestoneId) => {
    if (!roadmap) return;
    try {
      // Optimistic update
      const updatedMilestones = roadmap.milestones.map((m) =>
        m._id === milestoneId || m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      const overallProgress = Math.round((completedCount / updatedMilestones.length) * 100);

      setRoadmap({ ...roadmap, milestones: updatedMilestones, overallProgress });

      const res = await axios.patch(
        `http://localhost:5000/api/roadmap/${roadmap._id}/milestone/${milestoneId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setRoadmap(res.data.data);
        showToast('Milestone status updated!', 'success');
      }
    } catch (err) {
      console.error('Error toggling milestone:', err);
      showToast('Failed to update milestone', 'error');
      fetchRoadmap();
    }
  };

  const handleRegenerate = async () => {
    try {
      setGenerating(true);
      const res = await axios.post(
        'http://localhost:5000/api/roadmap/generate',
        { targetRole: user?.careerPreferences?.targetRole || 'Full Stack Engineer' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setRoadmap(res.data.data);
        showToast('Generated fresh AI Career Roadmap!', 'success');
      }
    } catch (err) {
      console.error('Regenerate error:', err);
      showToast('Failed to regenerate roadmap', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const milestones = roadmap?.milestones || [];
  const filteredMilestones =
    activeTab === 'all'
      ? milestones
      : milestones.filter((m) => m.timeframe === activeTab);

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  const timeframeLabels = {
    '7_days': '7 Days (Immediate Wins)',
    '30_days': '30 Days (Skill Depth)',
    '60_days': '60 Days (Cloud & Deployment)',
    '90_days': '90 Days (Certifications)',
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'High':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">High Priority</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Medium Priority</span>;
      default:
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">Low Priority</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">AI Career Growth Roadmap</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Notion-Style Execution Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Target Role: <span className="text-white font-medium">{user?.careerPreferences?.targetRole || 'Full Stack Engineer'}</span> — Actionable 90-day growth plan tailored to your resume gaps.
            </p>
          </div>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={generating}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-lg shadow-blue-950 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Rebuilding Plan...' : 'Regenerate Roadmap'}
        </button>
      </div>

      {/* Progress & Notion Overview Panel */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-blue-950/40 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Overall Growth Progress</h2>
          </div>
          <span className="text-sm font-black text-blue-400">{progressPercent}% Completed</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-sky-400 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>{completedCount} of {milestones.length} milestones completed</span>
          <span>Target Horizon: 90 Days</span>
        </div>
      </div>

      {/* Timeframe Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { key: 'all', label: 'All Milestones' },
          { key: '7_days', label: '7 Days (Immediate)' },
          { key: '30_days', label: '30 Days (Skills)' },
          { key: '60_days', label: '60 Days (Cloud)' },
          { key: '90_days', label: '90 Days (Certs)' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notion-Style Milestones List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading your personalized roadmap...</div>
      ) : filteredMilestones.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-sm bg-slate-900/40 rounded-2xl border border-slate-800">
          No milestones found for this timeframe.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMilestones.map((m, idx) => {
            const mId = m._id || m.id || idx;
            const isExpanded = expandedId === mId;

            return (
              <motion.div
                key={mId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-5 rounded-2xl border transition-all ${
                  m.completed
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Interactive Completion Checkbox */}
                  <button
                    onClick={() => handleToggleMilestone(mId)}
                    className="mt-0.5 text-blue-400 hover:text-blue-300 transition shrink-0"
                  >
                    {m.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600 hover:text-blue-400" />
                    )}
                  </button>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span
                          onClick={() => handleToggleMilestone(mId)}
                          className={`text-sm font-bold cursor-pointer transition ${
                            m.completed ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {m.title}
                        </span>
                        {getPriorityBadge(m.priority)}
                        <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {timeframeLabels[m.timeframe] || m.timeframe}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {m.atsImpact || '+8 ATS Points'}
                        </span>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : mId)}
                          className="text-slate-400 hover:text-white text-xs font-medium flex items-center gap-1"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{m.description}</p>

                    {/* AI Explainability & Resources Box */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pt-3 space-y-3 overflow-hidden border-t border-slate-800/80 mt-3"
                        >
                          {/* Why It Matters */}
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" /> Why This Recommendation Matters
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {m.whyItMatters || 'Closing key technical gap increases candidate screening velocity and interview invitations.'}
                            </p>
                          </div>

                          {/* Effort & Learning Resources */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-1">
                            <span className="flex items-center gap-1 text-slate-400">
                              <Clock className="w-3.5 h-3.5 text-blue-400" /> Estimated Effort: {m.estimatedEffort || '2-4 hours'}
                            </span>

                            {m.resources && m.resources.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-slate-300">Resources:</span>
                                {m.resources.map((resUrl, rIdx) => (
                                  <a
                                    key={rIdx}
                                    href={resUrl.startsWith('http') ? resUrl : `https://${resUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 flex items-center gap-1 transition"
                                  >
                                    Doc Link <ExternalLink className="w-3 h-3" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
