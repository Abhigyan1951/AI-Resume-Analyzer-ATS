import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileCheck2, Target, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Lightbulb, FileText } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { analyzeATS, getResumesHistory } from '../services/resumeService';

export const ATSAnalysis = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const history = getResumesHistory();
    setResumes(history);
    if (history.length > 0) {
      setSelectedResumeId(history[0]._id || history[0].id);
    }
  }, []);

  const handleRunAnalysis = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a target job description text.', 'Missing Input');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisReport(null);

    try {
      if (selectedResumeId) {
        const response = await analyzeATS(selectedResumeId, jobDescription);
        if (response.success && response.data) {
          setAnalysisReport(response.data);
          toast.success('ATS Analysis completed successfully!', 'Analysis Ready');
        } else {
          throw new Error(response.message || 'Failed to complete analysis');
        }
      } else {
        // Fallback mockup calculation if no resume uploaded yet
        setTimeout(() => {
          setAnalysisReport({
            overallScore: 84,
            keywordScore: 87,
            experienceScore: 82,
            structureScore: 100,
            matchedKeywords: ['React', 'TypeScript', 'Node.js', 'REST API', 'Git', 'CSS', 'Tailwind'],
            missingKeywords: ['GraphQL', 'AWS S3', 'Docker', 'Kubernetes', 'CI/CD'],
            actionableSuggestions: [
              'Incorporate key job description keywords into your professional summary: GraphQL, Docker.',
              'Begin bullet points with strong impact action verbs such as "Architected" or "Spearheaded".',
              'Quantify achievements with measurable metrics (e.g., "Increased page load performance by 40%").',
            ],
          });
          toast.success('Demo ATS Analysis generated.', 'Analysis Ready');
        }, 800);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'ATS Analysis failed.';
      toast.error(msg, 'Analysis Error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="ATS Scoring & Keyword Workspace"
        subtitle="Compare your parsed resume text against target job descriptions to identify matched skills, missing keywords, and structural readiness."
        badge="Step 2 of 3"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Pane (5 cols) */}
        <Card className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#2563EB]" />
                  Job Description & Resume
                </CardTitle>
                <CardDescription>Select document & paste target role details</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Resume Selector */}
              {resumes.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
                    Select Uploaded Resume
                  </label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full bg-[var(--surface-main)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm rounded-xl p-2.5 focus:outline-none focus:border-[#2563EB]"
                  >
                    {resumes.map((r) => (
                      <option key={r.id || r._id} value={r.id || r._id}>
                        {r.originalName || r.name || 'Resume'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
                  Target Job Description
                </label>
                <textarea
                  rows={10}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste target job title, responsibilities, required technical skills, and qualifications here..."
                  className="w-full bg-[var(--surface-main)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm rounded-xl p-4 transition-all focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </CardContent>
          </div>

          <CardContent className="pt-0">
            <Button
              onClick={handleRunAnalysis}
              isLoading={isAnalyzing}
              isDisabled={!jobDescription.trim()}
              variant="primary"
              className="w-full"
              leftIcon={<FileCheck2 className="w-4 h-4" />}
            >
              Analyze Resume against Job Description
            </Button>
          </CardContent>
        </Card>

        {/* Right Output Analysis Report (7 cols) */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0EA5E9]" />
                Live Analysis Report
              </CardTitle>
              <CardDescription>Real-time ATS keyword & subscore metrics</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {analysisReport ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Composite Score Card */}
                <div className="p-6 rounded-2xl glass-soft border border-[#2563EB]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                      Overall Composite ATS Match
                    </span>
                    <h2 className="text-5xl font-black text-[#2563EB] mt-1">{analysisReport.overallScore}%</h2>
                    <p className="text-xs text-[#16A34A] mt-1 font-medium flex items-center gap-1 justify-center sm:justify-start">
                      <CheckCircle2 className="w-3.5 h-3.5" /> High Qualification Match
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate('/ai-rewrite')}
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Proceed to AI Rewrite
                  </Button>
                </div>

                {/* Subscores Progress */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-[var(--text-secondary)]">Keyword Match Score</span>
                      <span className="text-[var(--text-primary)]">{analysisReport.keywordScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--surface-main)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                      <div
                        className="h-full bg-[#2563EB]"
                        style={{ width: `${analysisReport.keywordScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-[var(--text-secondary)]">Experience Relevance Score</span>
                      <span className="text-[var(--text-primary)]">{analysisReport.experienceScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--surface-main)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                      <div
                        className="h-full bg-[#0EA5E9]"
                        style={{ width: `${analysisReport.experienceScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-[var(--text-secondary)]">Structure & Format Score</span>
                      <span className="text-[var(--text-primary)]">{analysisReport.structureScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--surface-main)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                      <div
                        className="h-full bg-[#16A34A]"
                        style={{ width: `${analysisReport.structureScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Keywords Comparison Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl glass-soft border border-[#16A34A]/20 space-y-2">
                    <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Matched Keywords ({analysisReport.matchedKeywords?.length || 0})
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {analysisReport.matchedKeywords?.map((kw, idx) => (
                        <Badge key={idx} variant="success">
                          {kw}
                        </Badge>
                      )) || <span className="text-xs text-[var(--text-muted)]">None detected</span>}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl glass-soft border border-[#DC2626]/20 space-y-2">
                    <span className="text-xs font-semibold text-[#DC2626] flex items-center gap-1.5 uppercase tracking-wider">
                      <AlertTriangle className="w-3.5 h-3.5" /> Missing Keywords ({analysisReport.missingKeywords?.length || 0})
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {analysisReport.missingKeywords?.map((kw, idx) => (
                        <Badge key={idx} variant="danger">
                          + {kw}
                        </Badge>
                      )) || <span className="text-xs text-[var(--text-muted)]">None missing</span>}
                    </div>
                  </div>
                </div>

                {/* Actionable Suggestions */}
                {analysisReport.actionableSuggestions?.length > 0 && (
                  <div className="p-4 rounded-xl glass-soft border border-[var(--border-subtle)] space-y-3">
                    <span className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4 text-[#D97706]" /> Tailored Action Items
                    </span>
                    <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                      {analysisReport.actionableSuggestions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-16 text-[var(--text-secondary)] space-y-3">
                <FileCheck2 className="w-12 h-12 text-[var(--border-subtle)] mx-auto" />
                <p className="text-xs">Paste target job description on the left to run live ATS analysis.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ATSAnalysis;
