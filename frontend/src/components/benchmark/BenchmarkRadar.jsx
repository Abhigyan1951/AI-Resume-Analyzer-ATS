import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Target, Award, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function BenchmarkRadar({ candidateSkills }) {
  // Skill benchmark metrics
  const radarData = [
    { subject: 'React & Frontend', Candidate: 88, IndustryAvg: 70, TopCandidate: 92 },
    { subject: 'Node.js & API', Candidate: 85, IndustryAvg: 68, TopCandidate: 90 },
    { subject: 'AWS & Cloud', Candidate: 62, IndustryAvg: 65, TopCandidate: 88 },
    { subject: 'CI/CD & DevOps', Candidate: 70, IndustryAvg: 60, TopCandidate: 85 },
    { subject: 'System Design', Candidate: 78, IndustryAvg: 62, TopCandidate: 91 },
    { subject: 'Database & SQL', Candidate: 82, IndustryAvg: 72, TopCandidate: 89 },
  ];

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Smart Skill & ATS Benchmark Engine</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Heuristic benchmarking against industry averages and top candidate percentiles.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-300 font-medium">You (Candidate)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-500" />
            <span className="text-slate-400">Industry Avg</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 font-medium">Top 10% Candidate</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Chart */}
        <div className="lg:col-span-7 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
              <Radar name="You" dataKey="Candidate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
              <Radar name="Industry Average" dataKey="IndustryAvg" stroke="#64748b" fill="#64748b" fillOpacity={0.2} />
              <Radar name="Top Candidate" dataKey="TopCandidate" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeDasharray="3 3" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Strengths & Competitive Opportunities */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Core Key Strengths
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your React & Node.js scores exceed industry averages by <span className="font-bold text-emerald-400">+18%</span>. Strong baseline for full-stack senior positions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4" /> Growth Gap Opportunities
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              AWS & Cloud architecture is currently <span className="font-bold text-amber-400">3% below</span> industry average. Adding AWS Cloud Practitioner certification will boost your rating into top 10%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
