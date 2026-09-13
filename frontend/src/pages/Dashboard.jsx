import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileCheck2,
  FileText,
  Target,
  Sparkles,
  UploadCloud,
  ArrowRight,
  Clock,
  ExternalLink,
  Zap,
  TrendingUp,
  Award,
  Compass,
  MessageSquare,
  User,
  UserCheck,
  Flame,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '../components/common/StatCard';
import PageHeader from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { getResumesHistory } from '../services/resumeService';
import { useTheme } from '../hooks/useTheme';

import VersionTimeline from '../components/version/VersionTimeline';
import RecruiterHeatmap from '../components/ats/RecruiterHeatmap';
import BenchmarkRadar from '../components/benchmark/BenchmarkRadar';
import AchievementBadges from '../components/badges/AchievementBadges';

const chartData = [
  { name: 'v1.0', score: 58, keywords: 60, structure: 70 },
  { name: 'v1.1', score: 68, keywords: 70, structure: 75 },
  { name: 'v2.0', score: 78, keywords: 82, structure: 85 },
  { name: 'v2.1', score: 84, keywords: 88, structure: 90 },
  { name: 'v3.0', score: 89, keywords: 92, structure: 94 },
];

const CircularScoreGauge = ({ score = 86, label = "Career Intel Score", size = 160, strokeWidth = 14 }) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (val) => {
    if (val >= 80) return '#16A34A';
    if (val >= 60) return '#D97706';
    return '#DC2626';
  };

  const strokeColor = getScoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]"
        >
          {score}
        </motion.span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">
          {label}
        </span>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [resumes, setResumes] = useState([]);
  const [viewMode, setViewMode] = useState('candidate'); // 'candidate' | 'recruiter'

  // Composite Career Intelligence Score Formula:
  // (ATS Match * 0.35 + Skill Readiness * 0.25 + Interview Readiness * 0.25 + Roadmap Progress * 0.15)
  const atsScore = 89;
  const skillReadiness = 85;
  const interviewReadiness = 78;
  const roadmapProgress = 67;

  const careerIntelScore = Math.round(
    atsScore * 0.35 + skillReadiness * 0.25 + interviewReadiness * 0.25 + roadmapProgress * 0.15
  );

  useEffect(() => {
    const history = getResumesHistory();
    if (history.length > 0) {
      setResumes(history);
    } else {
      setResumes([
        {
          id: 'res-3',
          originalName: 'Senior_FullStack_v3.pdf',
          versionNumber: 3,
          commitName: 'v3.0 - Integrated Docker, CI/CD & AWS',
          uploadedAt: 'Today',
          score: 89,
          match: 'Full Stack Engineer @ Vercel',
        },
        {
          id: 'res-2',
          originalName: 'FullStack_Developer_v2.pdf',
          versionNumber: 2,
          commitName: 'v2.0 - Added Quantified Impact Bullets',
          uploadedAt: '3 days ago',
          score: 78,
          match: 'Frontend Tech Lead @ Stripe',
        },
        {
          id: 'res-1',
          originalName: 'Resume_Baseline_v1.pdf',
          versionNumber: 1,
          commitName: 'v1.0 - Initial Resume Upload',
          uploadedAt: '1 week ago',
          score: 58,
          match: 'Software Architect @ SaaS',
        },
      ]);
    }
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header with Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Career Intelligence Platform 2.0"
          subtitle="Comprehensive candidate scoring, version growth, interview readiness, and recruiter signal heatmap."
          badge="Enterprise Suite"
          action={
            <Button onClick={() => navigate('/upload')} leftIcon={<UploadCloud className="w-4 h-4" />}>
              Upload Resume v4.0
            </Button>
          }
        />

        {/* Global Candidate / Recruiter View Toggle */}
        <div className="flex items-center bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setViewMode('candidate')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              viewMode === 'candidate' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Candidate View
          </button>
          <button
            onClick={() => setViewMode('recruiter')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              viewMode === 'recruiter' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Recruiter View
          </button>
        </div>
      </div>

      {/* Hero Composite Score & Key Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Master Career Intelligence Score Card */}
        <Card className="flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-blue-950/20 to-transparent">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">Career Intelligence Score</h3>
          </div>
          <CircularScoreGauge score={careerIntelScore} label="Master Score" />
          <div className="text-xs text-[var(--text-secondary)] max-w-xs space-y-1">
            <p>
              Composite rating of <span className="text-emerald-400 font-bold">ATS (35%)</span>, <span className="text-blue-400 font-bold">Skills (25%)</span>, <span className="text-purple-400 font-bold">Interview (25%)</span>, & <span className="text-amber-400 font-bold">Roadmap (15%)</span>.
            </p>
          </div>
        </Card>

        {/* 4 Core Stat Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Current ATS Score (v3.0)"
            value={`${atsScore}%`}
            subtitle="+31 Pts overall growth since v1.0"
            icon={FileCheck2}
            trend="up"
            trendValue="31%"
            color="primary"
          />
          <StatCard
            title="Skill Match Readiness"
            value={`${skillReadiness}%`}
            subtitle="Matched 18 of 20 target role skills"
            icon={Target}
            trend="up"
            trendValue="85%"
            color="success"
          />
          <StatCard
            title="Interview Prep Readiness"
            value={`${interviewReadiness}%`}
            subtitle="5 Personalized HR & Tech sets ready"
            icon={MessageSquare}
            trend="up"
            trendValue="Ready"
            color="secondary"
          />
          <StatCard
            title="90-Day Roadmap Progress"
            value={`${roadmapProgress}%`}
            subtitle="4 of 6 milestones completed"
            icon={Compass}
            color="warning"
          />
        </div>
      </div>

      {/* Flagship Feature 1 — Resume Version Intelligence */}
      <VersionTimeline versions={resumes} onSelectVersion={(v) => navigate('/ats-analysis')} />

      {/* Flagship Feature 4 — Recruiter Heatmap */}
      <RecruiterHeatmap candidateViewMode={viewMode} onToggleMode={() => setViewMode(v => v === 'candidate' ? 'recruiter' : 'candidate')} />

      {/* Bonus Feature — Smart Benchmark Radar */}
      <BenchmarkRadar />

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          onClick={() => navigate('/roadmap')}
          className="p-6 cursor-pointer hover:border-blue-500/50 transition-all space-y-3 group"
        >
          <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 w-fit border border-blue-500/30">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition">AI Career Roadmap</h4>
            <p className="text-xs text-slate-400 mt-1">Notion-style 7d, 30d, 60d, and 90d actionable growth milestones with interactive checkboxes.</p>
          </div>
          <div className="flex items-center text-xs font-semibold text-blue-400 gap-1 pt-1">
            Open Roadmap <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Card>

        <Card
          onClick={() => navigate('/interview-prep')}
          className="p-6 cursor-pointer hover:border-purple-500/50 transition-all space-y-3 group"
        >
          <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400 w-fit border border-purple-500/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white group-hover:text-purple-400 transition">Interview Preparation Hub</h4>
            <p className="text-xs text-slate-400 mt-1">Personalized HR, Technical, and Resume questions with interactive AI Mock Simulator.</p>
          </div>
          <div className="flex items-center text-xs font-semibold text-purple-400 gap-1 pt-1">
            Launch Mock Interview <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Card>

        <Card
          onClick={() => navigate('/ai-rewrite')}
          className="p-6 cursor-pointer hover:border-emerald-500/50 transition-all space-y-3 group"
        >
          <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 w-fit border border-emerald-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition">AI Google XYZ Rewriter</h4>
            <p className="text-xs text-slate-400 mt-1">Transform weak resume bullet points into high-impact quantified metric achievements.</p>
          </div>
          <div className="flex items-center text-xs font-semibold text-emerald-400 gap-1 pt-1">
            Rewrite Bullets <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Card>
      </div>

      {/* Refinement 4 — Achievement Badges Grid */}
      <AchievementBadges currentAtsScore={atsScore} />
    </div>
  );
};

export default Dashboard;
