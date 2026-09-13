import React from 'react';
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

const chartData = [
  { name: 'Mon', score: 65, keywords: 55 },
  { name: 'Tue', score: 72, keywords: 68 },
  { name: 'Wed', score: 70, keywords: 65 },
  { name: 'Thu', score: 81, keywords: 84 },
  { name: 'Fri', score: 84, keywords: 92 },
  { name: 'Sat', score: 88, keywords: 90 },
  { name: 'Sun', score: 94, keywords: 95 },
];

const recentResumes = [
  {
    id: 'res-1',
    name: 'Senior_FullStack_Engineer_2026.pdf',
    date: '2 hours ago',
    score: 94,
    status: 'Optimized',
    match: 'Full Stack Engineer @ Vercel',
  },
  {
    id: 'res-2',
    name: 'Frontend_Lead_Resume_v2.pdf',
    date: '1 day ago',
    score: 82,
    status: 'Needs Review',
    match: 'Frontend Tech Lead @ Stripe',
  },
  {
    id: 'res-3',
    name: 'Software_Architect_Draft.pdf',
    date: '3 days ago',
    score: 68,
    status: 'Low Match',
    match: 'Principal Architect @ AWS',
  },
];

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="ATS Optimization Dashboard"
        subtitle="Track your resume performance, keyword match density, and AI recommendations in real-time."
        badge="Live Analytics"
        action={
          <Button onClick={() => navigate('/upload')} leftIcon={<UploadCloud className="w-4 h-4" />}>
            Upload Resume
          </Button>
        }
      />

      {/* 4 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="ATS Match Score"
          value="84%"
          subtitle="+12% higher than industry average"
          icon={FileCheck2}
          trend="up"
          trendValue="14%"
          color="primary"
        />
        <StatCard
          title="Resumes Uploaded"
          value="3 Files"
          subtitle="Latest: Senior_FullStack_Engineer.pdf"
          icon={FileText}
          trend="up"
          trendValue="1 new"
          color="success"
        />
        <StatCard
          title="Keywords Matched"
          value="92%"
          subtitle="18 of 20 required skills identified"
          icon={Target}
          trend="up"
          trendValue="8%"
          color="secondary"
        />
        <StatCard
          title="AI Suggestions"
          value="14 Actions"
          subtitle="4 high-priority bullet rewrites"
          icon={Sparkles}
          color="warning"
        />
      </div>

      {/* Analytics Chart & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Performance Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>ATS Score Progression</CardTitle>
              <CardDescription>
                Weekly trend showing keyword coverage and match efficiency across job applications.
              </CardDescription>
            </div>
            <Badge variant="primary">7 Day Trend</Badge>
          </CardHeader>
          <CardContent className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F8CFF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F8CFF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="keywordColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" opacity={0.6} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#1F2937',
                    borderRadius: '12px',
                    color: '#F9FAFB',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#4F8CFF"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#scoreColor)"
                  name="ATS Score %"
                />
                <Area
                  type="monotone"
                  dataKey="keywords"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#keywordColor)"
                  name="Keyword Coverage %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Action Hub */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#4F8CFF]" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Instant workflows to boost your application</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div
                onClick={() => navigate('/upload')}
                className="p-3.5 rounded-xl glass-soft hover:bg-[#1A2235] border border-[#1F2937] transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#4F8CFF]/15 text-[#4F8CFF]">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-[#F9FAFB]">Upload PDF Resume</h5>
                    <p className="text-xs text-[#9CA3AF]">Extract text & validate structure</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
              </div>

              <div
                onClick={() => navigate('/ats-analysis')}
                className="p-3.5 rounded-xl glass-soft hover:bg-[#1A2235] border border-[#1F2937] transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#7C3AED]/15 text-[#a78bfa]">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-[#F9FAFB]">Run ATS Keyword Match</h5>
                    <p className="text-xs text-[#9CA3AF]">Compare against job description</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
              </div>

              <div
                onClick={() => navigate('/ai-rewrite')}
                className="p-3.5 rounded-xl glass-soft hover:bg-[#1A2235] border border-[#1F2937] transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#22C55E]/15 text-[#22C55E]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-[#F9FAFB]">Generate AI Bullet Points</h5>
                    <p className="text-xs text-[#9CA3AF]">Google XYZ formula rewrites</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Recent Resumes Table Section */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent Analyzed Resumes</CardTitle>
            <CardDescription>Manage and review your recently parsed PDF documents</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
            View All History
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#F9FAFB]">
              <thead className="text-xs text-[#9CA3AF] uppercase bg-[#1A2235]/40 border-b border-[#1F2937]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Document Name</th>
                  <th className="px-4 py-3 font-semibold">Target Job Match</th>
                  <th className="px-4 py-3 font-semibold">ATS Score</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Uploaded</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]/60">
                {recentResumes.map((res) => (
                  <tr key={res.id} className="hover:bg-[#1A2235]/40 transition-colors">
                    <td className="px-4 py-3.5 font-medium flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#4F8CFF]" />
                      <span className="truncate max-w-xs">{res.name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-[#9CA3AF]">{res.match}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          res.score >= 85
                            ? 'bg-[#22C55E]/15 text-[#22C55E]'
                            : res.score >= 70
                            ? 'bg-[#F59E0B]/15 text-[#F59E0B]'
                            : 'bg-[#EF4444]/15 text-[#EF4444]'
                        }`}
                      >
                        {res.score}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant={
                          res.status === 'Optimized'
                            ? 'success'
                            : res.status === 'Needs Review'
                            ? 'warning'
                            : 'danger'
                        }
                        dot
                      >
                        {res.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-[#9CA3AF] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
                      {res.date}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/ats-analysis')}
                        rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                      >
                        Analyze
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
