import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Check, Zap, Target, ArrowRight, Lightbulb, FileText, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';
import { rewriteWithAI, getResumesHistory } from '../services/resumeService';

const defaultBullets = [
  {
    original: 'Worked on backend microservices and improved performance.',
    improved: 'Architected resilient backend microservices on AWS handling 5M+ daily requests, improving throughput by 40% and decreasing latency by 150ms.',
    improvementReason: 'Incorporated Google XYZ metric formula ("Accomplished X as measured by Y by doing Z"), action verb "Architected", and scale statistics.',
  },
  {
    original: 'Built React UI components and fixed bugs.',
    improved: 'Engineered reusable React 19 component design system with Tailwind CSS and Framer Motion, boosting frontend development velocity by 35%.',
    improvementReason: 'Highlighted modern tech stack proficiency and measurable velocity gain.',
  },
];

export const AIRewrite = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [rewriteData, setRewriteData] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const history = getResumesHistory();
    setResumes(history);
    if (history.length > 0) {
      setSelectedResumeId(history[0]._id || history[0].id);
    }
  }, []);

  const handleGenerateRewrite = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a target job description text.', 'Missing Input');
      return;
    }

    setIsGenerating(true);

    try {
      if (selectedResumeId) {
        const response = await rewriteWithAI(selectedResumeId, jobDescription);
        if (response.success && response.data) {
          setRewriteData(response.data);
          toast.success('AI Resume rewrite generated with Google Gemini 3.6!', 'Rewrite Complete');
        } else {
          throw new Error(response.message || 'Failed to generate AI rewrite');
        }
      } else {
        // Mock fallback if no resume uploaded yet
        setTimeout(() => {
          setRewriteData({
            rewrittenSummary:
              'Results-driven Senior Full Stack Engineer with 7+ years of experience engineering scalable web platforms using React 19, Node.js, and TypeScript. Proven track record architecting microservices on AWS and optimizing MongoDB databases to support 5M+ daily requests. Adept at establishing automated CI/CD pipelines and leading cross-functional engineering teams.',
            improvedBulletPoints: defaultBullets,
            skillsToHighlight: ['React 19', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'GraphQL', 'Docker'],
            missingKeywords: ['CI/CD', 'Kubernetes', 'Jest', 'Tailwind CSS'],
            actionableSuggestions: [
              'Use the Google XYZ formula for all bullet points in your experience section.',
              'Ensure key technical keywords are mentioned in both summary and skills sections.',
            ],
          });
          toast.success('Demo AI Resume rewrite generated.', 'Rewrite Complete');
        }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'AI Rewrite generation failed.';
      toast.error(msg, 'Generation Error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text, type, index = null) => {
    navigator.clipboard.writeText(text);
    if (type === 'summary') {
      setCopiedSummary(true);
      toast.success('Rewritten professional summary copied to clipboard!');
      setTimeout(() => setCopiedSummary(false), 2000);
    } else if (type === 'bullet') {
      setCopiedIndex(index);
      toast.success('Improved bullet point copied to clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } else if (type === 'all') {
      toast.success('All AI optimizations copied to clipboard!');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="AI Resume Rewrite & Enhancement Workspace"
        subtitle="Transform plain bullet points into high-impact, quantified achievement statements using Google's XYZ formula powered by Gemini 3.6."
        badge="Step 3 of 3"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <Card className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-4">
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#2563EB]" />
                  Rewrite Prompt Parameters
                </CardTitle>
                <CardDescription>Select document & target role requirements</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
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
                  rows={9}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste target job posting text here to tailor AI summary & bullet formula rewrites..."
                  className="w-full bg-[var(--surface-main)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm rounded-xl p-4 transition-all focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </CardContent>
          </div>

          <CardContent className="pt-0">
            <Button
              onClick={handleGenerateRewrite}
              isLoading={isGenerating}
              isDisabled={!jobDescription.trim()}
              variant="primary"
              className="w-full shadow-lg shadow-[#2563EB]/20"
              leftIcon={<Sparkles className="w-4 h-4 text-white" />}
            >
              Generate AI Bullet Point & Summary Rewrites
            </Button>
          </CardContent>
        </Card>

        {/* Right Output Rewrites (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {rewriteData ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#2563EB]" />
                      Rewritten Professional Summary
                    </CardTitle>
                    <CardDescription>Tailored for target job description requirements</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Gemini 3.6 Active</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyText(rewriteData.rewrittenSummary, 'summary')}
                      leftIcon={copiedSummary ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                    >
                      {copiedSummary ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="p-4 rounded-xl glass-soft border border-[#2563EB]/30 text-sm text-[var(--text-primary)] leading-relaxed font-sans">
                    "{rewriteData.rewrittenSummary}"
                  </p>
                </CardContent>
              </Card>

              {/* Bullet Transformations List */}
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#16A34A]" />
                      Google XYZ Bullet Transformations
                    </CardTitle>
                    <CardDescription>Click copy to use directly in your resume</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  {(rewriteData.improvedBulletPoints?.length > 0 ? rewriteData.improvedBulletPoints : defaultBullets).map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl glass-card border border-[var(--border-subtle)] space-y-3">
                      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                        <span className="font-semibold uppercase tracking-wider">Before</span>
                        <span className="text-xs text-[var(--text-muted)]">Original Draft</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] line-through">{item.original}</p>

                      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[#16A34A]">
                        <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 fill-[#16A34A]" /> AI Optimized Bullet Formula
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyText(item.improved, 'bullet', idx)}
                          leftIcon={copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                        >
                          {copiedIndex === idx ? 'Copied' : 'Copy'}
                        </Button>
                      </div>

                      <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed bg-[var(--surface-elevated)] p-3.5 rounded-xl border border-[#2563EB]/20">
                        {item.improved}
                      </p>

                      <p className="text-xs text-[var(--text-secondary)] italic">
                        <span className="font-semibold text-[#2563EB]">Why:</span> {item.improvementReason || item.reason}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skills to Highlight & Missing Keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rewriteData.skillsToHighlight?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xs uppercase tracking-wider text-[#16A34A]">
                        Skills To Highlight
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-1.5 pt-0">
                      {rewriteData.skillsToHighlight.map((sk, i) => (
                        <Badge key={i} variant="success">
                          {sk}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {rewriteData.missingKeywords?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xs uppercase tracking-wider text-[#DC2626]">
                        Keywords To Incorporate
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-1.5 pt-0">
                      {rewriteData.missingKeywords.map((kw, i) => (
                        <Badge key={i} variant="danger">
                          + {kw}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          ) : (
            <Card className="flex flex-col items-center justify-center py-20 text-center">
              <Sparkles className="w-12 h-12 text-[var(--border-subtle)] mb-3" />
              <h4 className="text-base font-semibold text-[var(--text-primary)]">Ready to Rewrite</h4>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm mt-1">
                Paste the job posting description on the left and click Generate to produce tailored AI bullet points.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRewrite;
