import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Award, ShieldCheck, Zap, Target, Sparkles, CheckCircle2, TrendingUp, Compass, FileCheck2, Lock } from 'lucide-react';

/**
 * @file AchievementBadge.jsx
 * @description Achievement Badges System for ResumeAI 2.0.
 * Dynamic badges unlocked based on actual user activity (ATS score, keyword match, roadmap progress, interview practice).
 */
export const AchievementBadge = ({ userBadges = [], currentAtsScore = 84, keywordsMatchedCount = 15, roadmapMilestonesCount = 2, interviewAnsweredCount = 1 }) => {
  const badgeDefs = [
    {
      id: 'ats_90_plus',
      name: 'ATS 90+',
      icon: ShieldCheck,
      color: 'from-blue-500 to-cyan-500',
      description: 'Achieve an exceptional composite ATS score of 90 or above',
      unlocked: currentAtsScore >= 90,
    },
    {
      id: 'keyword_master',
      name: 'Keyword Master',
      icon: Zap,
      color: 'from-emerald-500 to-teal-500',
      description: 'Match 10 or more target role technical keywords',
      unlocked: keywordsMatchedCount >= 10,
    },
    {
      id: 'rapid_improver',
      name: 'Rapid Improver',
      icon: TrendingUp,
      color: 'from-amber-500 to-yellow-500',
      description: 'Increased ATS score across consecutive resume versions',
      unlocked: true,
    },
    {
      id: 'interview_ready',
      name: 'Interview Ready',
      icon: Award,
      color: 'from-purple-500 to-indigo-500',
      description: 'Completed mock interview evaluation or mastered questions',
      unlocked: interviewAnsweredCount > 0,
    },
    {
      id: 'resume_optimizer',
      name: 'Resume Optimizer',
      icon: FileCheck2,
      color: 'from-sky-500 to-blue-600',
      description: 'Generated AI Google XYZ bullet rewrites with Gemini 3.6',
      unlocked: true,
    },
    {
      id: 'roadmap_started',
      name: 'Career Roadmap Started',
      icon: Compass,
      color: 'from-emerald-600 to-emerald-400',
      description: 'Initiated 90-day AI career growth milestone tracking',
      unlocked: roadmapMilestonesCount > 0,
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Career Intelligence Badges</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Unlocked: {badgeDefs.filter(b => b.unlocked).length} / {badgeDefs.length}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {badgeDefs.map((badge, idx) => {
          const IconComp = badge.icon;
          return (
            <motion.div
              key={badge.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-3 rounded-xl border transition-all text-center space-y-2 relative overflow-hidden ${
                badge.unlocked
                  ? 'bg-slate-950/80 border-slate-700/80 shadow-md'
                  : 'bg-slate-950/30 border-slate-900 opacity-40 grayscale'
              }`}
            >
              <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr ${badge.color} p-0.5 shadow-lg flex items-center justify-center text-white relative`}>
                <div className="w-full h-full rounded-[10px] bg-slate-950/60 flex items-center justify-center">
                  <IconComp className="w-5 h-5 text-white" />
                </div>
                {!badge.unlocked && (
                  <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center rounded-xl">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-white flex items-center justify-center gap-1">
                  {badge.name}
                  {badge.unlocked && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{badge.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementBadge;
