import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Award, ShieldCheck, Zap, Target, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AchievementBadges({ userBadges = [], currentAtsScore = 84 }) {
  const allBadges = [
    {
      id: 'ats_pioneer',
      name: 'ATS Pioneer',
      icon: Rocket,
      color: 'from-blue-500 to-cyan-500',
      description: 'Joined ResumeAI 2.0 Career Platform',
      unlocked: true,
    },
    {
      id: 'keyword_master',
      name: 'Keyword Master',
      icon: Zap,
      color: 'from-emerald-500 to-teal-500',
      description: 'Matched over 85% of target role tech keywords',
      unlocked: true,
    },
    {
      id: 'elite_80',
      name: '80+ ATS Elite',
      icon: ShieldCheck,
      color: 'from-purple-500 to-indigo-500',
      description: 'Achieved top tier ATS score above 80',
      unlocked: currentAtsScore >= 80,
    },
    {
      id: 'roadmap_champion',
      name: 'Roadmap Champion',
      icon: Target,
      color: 'from-amber-500 to-orange-500',
      description: 'Completed 7-Day career growth milestones',
      unlocked: true,
    },
    {
      id: 'interview_master',
      name: 'Interview Master',
      icon: Award,
      color: 'from-rose-500 to-pink-500',
      description: 'Mastered technical & HR mock interview questions',
      unlocked: true,
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">ATS Achievement Badges</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Unlocked: {allBadges.filter(b => b.unlocked).length} / {allBadges.length}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {allBadges.map((badge, idx) => {
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
              <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr ${badge.color} p-0.5 shadow-lg flex items-center justify-center text-white`}>
                <div className="w-full h-full rounded-[10px] bg-slate-950/60 flex items-center justify-center">
                  <IconComp className="w-5 h-5 text-white" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white flex items-center justify-center gap-1">
                  {badge.name}
                  {badge.unlocked && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{badge.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
