import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, TrendingUp, Sparkles, Clock, CheckCircle2, ArrowRight, Eye, Tag, AlertTriangle, Scale } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function VersionTimeline({ versions = [], onSelectVersion }) {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Fallback demo versions if none uploaded yet
  const displayVersions = versions.length > 0 ? versions : [
    {
      _id: 'demo-v3',
      versionNumber: 3,
      commitName: 'v3.0 - Integrated Docker, CI/CD & System Architecture',
      atsScore: 89,
      keywordScore: 92,
      experienceScore: 85,
      structureScore: 90,
      newlyAddedKeywords: ['Docker', 'CI/CD', 'GitHub Actions', 'Redis', 'AWS EC2'],
      removedWeaknesses: ['Missing DevOps credentials', 'Unquantified project bullets'],
      uploadDate: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      _id: 'demo-v2',
      versionNumber: 2,
      commitName: 'v2.0 - Added Quantified Metrics & Action Verbs',
      atsScore: 74,
      keywordScore: 78,
      experienceScore: 72,
      structureScore: 85,
      newlyAddedKeywords: ['TypeScript', 'Jest', 'GraphQL', 'TailwindCSS'],
      removedWeaknesses: ['Passive verb phrasing'],
      uploadDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      _id: 'demo-v1',
      versionNumber: 1,
      commitName: 'v1.0 - Initial Baseline Resume Upload',
      atsScore: 58,
      keywordScore: 60,
      experienceScore: 55,
      structureScore: 70,
      newlyAddedKeywords: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
      removedWeaknesses: [],
      uploadDate: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
  ];

  // Chart data sorted chronologically (v1 -> v2 -> v3)
  const chartData = [...displayVersions]
    .sort((a, b) => a.versionNumber - b.versionNumber)
    .map((v) => ({
      version: `v${v.versionNumber}`,
      ATS: v.atsScore,
      Keywords: v.keywordScore || v.atsScore - 5,
    }));

  const latestVersion = displayVersions[0];
  const oldestVersion = displayVersions[displayVersions.length - 1];
  const scoreDelta = latestVersion.atsScore - oldestVersion.atsScore;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-sky-900/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <GitCommit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Resume Version Intelligence</h3>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Git-Style Timeline
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Every resume upload becomes an immutable version. Track score growth, keyword commits, and eliminated weaknesses over time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-400">Overall Growth</p>
            <p className="text-xl font-black text-emerald-400 flex items-center justify-end gap-1">
              <TrendingUp className="w-4 h-4" />
              +{scoreDelta > 0 ? scoreDelta : 0} ATS Pts
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedVersion(displayVersions[0]);
              setCompareModalOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-medium text-blue-300 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl transition flex items-center gap-2"
          >
            <Scale className="w-4 h-4 text-blue-400" />
            Compare Diff
          </button>
        </div>
      </div>

      {/* Recharts Score Growth Graph */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            ATS Score Trajectory Across Versions
          </h4>
          <span className="text-xs text-slate-400">Total Versions: {displayVersions.length}</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="atsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="version" stroke="#64748b" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="ATS" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#atsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Git Version Cards Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-sky-500 before:to-slate-700">
        {displayVersions.map((ver, idx) => {
          const isLatest = idx === 0;
          const prevVer = displayVersions[idx + 1];
          const delta = prevVer ? ver.atsScore - prevVer.atsScore : 0;

          return (
            <motion.div
              key={ver._id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-5 rounded-2xl border transition-all ${
                isLatest
                  ? 'bg-slate-900/80 border-blue-500/40 shadow-lg shadow-blue-950/40'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Timeline Marker Dot */}
              <div
                className={`absolute -left-[1.875rem] top-6 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isLatest
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-500/50'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <GitCommit className="w-3 h-3" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg ${
                      isLatest ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    v{ver.versionNumber}.0
                  </span>
                  <h4 className="text-sm font-semibold text-slate-100">{ver.commitName}</h4>
                  {isLatest && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ACTIVE RESUME
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(ver.uploadDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400">ATS Score:</span>
                    <span className="text-sm font-black text-blue-400">{ver.atsScore}</span>
                    {delta !== 0 && (
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          delta > 0
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {delta > 0 ? `+${delta}` : delta}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Keyword Commit Badges */}
              <div className="space-y-2 mt-3 pt-3 border-t border-slate-800/80">
                {ver.newlyAddedKeywords && ver.newlyAddedKeywords.length > 0 && (
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-emerald-400 font-medium whitespace-nowrap mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> +Newly Added Keywords:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {ver.newlyAddedKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">
                          +{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {ver.removedWeaknesses && ver.removedWeaknesses.length > 0 && (
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-sky-400 font-medium whitespace-nowrap mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> -Eliminated Gaps:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {ver.removedWeaknesses.map((w, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[11px]">
                          ✓ {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-3">
                <button
                  onClick={() => {
                    setSelectedVersion(ver);
                    setCompareModalOpen(true);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5" /> View Version Details & Diff
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Compare / Version Diff Modal */}
      <AnimatePresence>
        {compareModalOpen && selectedVersion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <GitCommit className="w-5 h-5 text-blue-400" />
                    Version Details: v{selectedVersion.versionNumber}.0
                  </h3>
                  <p className="text-xs text-slate-400">{selectedVersion.commitName}</p>
                </div>
                <button
                  onClick={() => setCompareModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Close
                </button>
              </div>

              {/* Grid Metrics Comparison */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <p className="text-[11px] text-slate-400">ATS Score</p>
                  <p className="text-xl font-bold text-blue-400">{selectedVersion.atsScore}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <p className="text-[11px] text-slate-400">Keyword Score</p>
                  <p className="text-xl font-bold text-emerald-400">{selectedVersion.keywordScore || 85}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <p className="text-[11px] text-slate-400">Experience Score</p>
                  <p className="text-xl font-bold text-sky-400">{selectedVersion.experienceScore || 80}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <p className="text-[11px] text-slate-400">Structure Score</p>
                  <p className="text-xl font-bold text-purple-400">{selectedVersion.structureScore || 90}</p>
                </div>
              </div>

              {/* Before vs After Keyword Diff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Newly Committed Keywords (+Diff)
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(selectedVersion.newlyAddedKeywords || ['Docker', 'CI/CD', 'Redis']).map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        +{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Weaknesses Resolved (-Diff)
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(selectedVersion.removedWeaknesses || ['Added action verbs', 'Fixed passive summary']).map((w, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        ✓ {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    if (onSelectVersion) onSelectVersion(selectedVersion);
                    setCompareModalOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-2"
                >
                  Set as Target Baseline <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
