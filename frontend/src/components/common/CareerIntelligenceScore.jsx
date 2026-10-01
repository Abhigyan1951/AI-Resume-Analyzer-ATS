import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Info, ShieldCheck, Target, MessageSquare, Compass, FileCheck2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

/**
 * @file CareerIntelligenceScore.jsx
 * @description Proprietary product metric component for ResumeAI 2.0.
 * Formula: ATS Score * 40% + Skill Readiness * 20% + Interview Readiness * 20% + Career Progress * 20%.
 */
export const CareerIntelligenceScore = ({
  atsScore = 84,
  skillReadiness = 80,
  interviewReadiness = 75,
  careerProgress = 60,
  size = 180,
  strokeWidth = 14,
}) => {
  // Deterministic formula calculation
  const compositeScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        atsScore * 0.40 +
        skillReadiness * 0.20 +
        interviewReadiness * 0.20 +
        careerProgress * 0.20
      )
    )
  );

  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (compositeScore / 100) * circumference;

  const getScoreColor = (val) => {
    if (val >= 80) return '#16A34A'; // Emerald
    if (val >= 65) return '#2563EB'; // Enterprise Blue
    if (val >= 50) return '#D97706'; // Amber
    return '#DC2626'; // Rose
  };

  const scoreColor = getScoreColor(compositeScore);

  const componentsList = [
    { label: 'ATS Score', weight: '40%', score: atsScore, color: '#2563EB', icon: FileCheck2 },
    { label: 'Skill Readiness', weight: '20%', score: skillReadiness, color: '#0EA5E9', icon: Target },
    { label: 'Interview Readiness', weight: '20%', score: interviewReadiness, color: '#9333EA', icon: MessageSquare },
    { label: 'Career Progress', weight: '20%', score: careerProgress, color: '#F59E0B', icon: Compass },
  ];

  return (
    <Card className="p-6 border border-blue-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Animated Circular Gauge */}
        <div className="flex flex-col items-center justify-center text-center space-y-2 shrink-0">
          <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90 drop-shadow-md">
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="var(--border-subtle, #1e293b)"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <motion.circle
                cx={center}
                cy={center}
                r={radius}
                stroke={scoreColor}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl font-black tracking-tight text-white"
              >
                {compositeScore}
              </motion.span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 mt-0.5">
                OUT OF 100
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white flex items-center gap-1 justify-center">
              <Zap className="w-3.5 h-3.5 text-blue-400" /> ResumeAI Career Intelligence Score
            </span>
            <p className="text-[11px] text-slate-400">Proprietary SaaS Candidate Index</p>
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="flex-1 space-y-4 w-full">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-blue-300">
              <Info className="w-4 h-4 text-blue-400" /> How This Metric Is Calculated:
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Calculated deterministically using weighted platform inputs: <span className="text-white font-medium">ATS (40%)</span> + <span className="text-white font-medium">Skills (20%)</span> + <span className="text-white font-medium">Interview (20%)</span> + <span className="text-white font-medium">Roadmap (20%)</span>.
            </p>
          </div>

          {/* Component Progress Bars */}
          <div className="space-y-2.5">
            {componentsList.map((comp) => {
              const Icon = comp.icon;
              return (
                <div key={comp.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      {comp.label} <span className="text-[10px] text-slate-500">({comp.weight})</span>
                    </span>
                    <span className="font-bold text-white">{comp.score}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: comp.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${comp.score}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CareerIntelligenceScore;
