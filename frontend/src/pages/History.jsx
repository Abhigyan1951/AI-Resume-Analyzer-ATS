import React, { useState, useEffect } from 'react';
import { Clock, FileText, ExternalLink, Search, Trash2, GitCommit, Compass, MessageSquare, TrendingUp } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import EmptyState from '../components/common/EmptyState';
import { useNavigate } from 'react-router-dom';
import { getResumesHistory } from '../services/resumeService';
import { useToast } from '../hooks/useToast';

export const History = () => {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const history = getResumesHistory();
    if (history.length > 0) {
      setRecords(history);
    } else {
      setRecords([
        {
          id: '3',
          date: 'Today',
          originalName: 'Senior_FullStack_v3.pdf',
          versionNumber: 3,
          commitName: 'v3.0 - Integrated Docker, CI/CD & AWS',
          score: 89,
          improvement: '+11%',
          role: 'Full Stack Engineer @ Vercel',
          status: 'Optimized',
          hasRoadmap: true,
          hasInterview: true,
        },
        {
          id: '2',
          date: '3 days ago',
          originalName: 'FullStack_Developer_v2.pdf',
          versionNumber: 2,
          commitName: 'v2.0 - Added Quantified Impact Bullets',
          score: 78,
          improvement: '+20%',
          role: 'Frontend Tech Lead @ Stripe',
          status: 'Needs Review',
          hasRoadmap: true,
          hasInterview: true,
        },
        {
          id: '1',
          date: '1 week ago',
          originalName: 'Resume_Baseline_v1.pdf',
          versionNumber: 1,
          commitName: 'v1.0 - Initial Baseline Resume Upload',
          score: 58,
          improvement: 'Baseline',
          role: 'Software Architect @ SaaS',
          status: 'Low Match',
          hasRoadmap: false,
          hasInterview: false,
        },
      ]);
    }
  }, []);

  const filteredRecords = records.filter((rec) => {
    const name = rec.originalName || rec.name || '';
    const role = rec.role || rec.match || '';
    const commit = rec.commitName || '';
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || role.toLowerCase().includes(query) || commit.toLowerCase().includes(query);
  });

  const handleClearHistory = () => {
    localStorage.removeItem('resumes_history');
    setRecords([]);
    toast.info('Cleared history records.', 'History Cleared');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resume Version Intelligence History"
        subtitle="Review version commits, score improvements, career roadmaps, and interview preparation packs."
        badge="Git Version Logs"
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Historical Version Commits</CardTitle>
            <CardDescription>Search and filter past uploaded resume versions</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-64">
              <Input
                isSearch
                placeholder="Search by version or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-1.5 text-xs bg-[var(--surface-main)]"
              />
            </div>
            {records.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearHistory} leftIcon={<Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />}>
                Clear
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {filteredRecords.length === 0 ? (
            <EmptyState
              title="No Evaluation Records Found"
              description="Upload a new PDF resume or run an ATS analysis to build your evaluation history."
              actionLabel="Upload Resume"
              onAction={() => navigate('/upload')}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[var(--text-primary)]">
                <thead className="text-xs text-[var(--text-secondary)] uppercase bg-[var(--surface-elevated)] border-b border-[var(--border-subtle)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Version</th>
                    <th className="px-4 py-3 font-semibold">Commit Message & Document</th>
                    <th className="px-4 py-3 font-semibold">Target Job Role</th>
                    <th className="px-4 py-3 font-semibold">ATS Score</th>
                    <th className="px-4 py-3 font-semibold">Improvement %</th>
                    <th className="px-4 py-3 font-semibold">Intel Packs</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredRecords.map((item) => {
                    const score = item.score || 84;
                    const verNum = item.versionNumber || 1;

                    return (
                      <tr key={item.id || item._id} className="hover:bg-[var(--surface-elevated)] transition-colors">
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center gap-1 w-fit">
                            <GitCommit className="w-3.5 h-3.5" /> v{verNum}.0
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-white text-xs">{item.commitName || `v${verNum}.0 Commit`}</p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <FileText className="w-3 h-3 text-blue-400" /> {item.originalName || item.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-[var(--text-secondary)] text-xs">
                          {item.role || item.match || 'Full Stack Engineer'}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-bold text-blue-400">{score}%</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {item.improvement || '+12%'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => navigate('/roadmap')}
                              className="px-2 py-1 text-[10px] font-bold rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition flex items-center gap-1"
                            >
                              <Compass className="w-3 h-3" /> Roadmap
                            </button>
                            <button
                              onClick={() => navigate('/interview-prep')}
                              className="px-2 py-1 text-[10px] font-bold rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" /> Interview
                            </button>
                          </div>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
