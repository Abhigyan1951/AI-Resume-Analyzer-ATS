import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCheck2, Target, Sparkles } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';

export const ATSAnalysis = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const navigate = useNavigate();

  const handleRunAnalysis = () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisDone(true);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageHeader
        title="ATS Scoring & Keyword Analysis"
        subtitle="Compare your parsed resume text against target job descriptions to identify matched skills, missing keywords, and structural readiness."
        badge="Step 2 of 3"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#4F8CFF]" />
                Target Job Posting
              </CardTitle>
              <CardDescription>Paste the complete job description text below</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2 block">
                Job Description Text
              </label>
              <textarea
                rows={10}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job title, responsibilities, required technical skills, and qualifications here..."
                className="w-full bg-[#111827] border border-[#1F2937] text-[#F9FAFB] placeholder-[#6B7280] text-sm rounded-xl p-4 transition-all focus:outline-none focus:border-[#4F8CFF] focus:ring-2 focus:ring-[#4F8CFF]/20"
              />
            </div>

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

        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <div>
                <CardTitle>Score Breakdown</CardTitle>
                <CardDescription>Estimated ATS match metrics</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-2">
              {analysisDone ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="text-center p-6 rounded-2xl glass-soft border border-[#4F8CFF]/30">
                    <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                      Overall ATS Score
                    </span>
                    <h2 className="text-5xl font-black text-[#4F8CFF] mt-2">84%</h2>
                    <p className="text-xs text-[#22C55E] mt-1 font-medium">Strong Candidate Alignment</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-[#9CA3AF]">Keyword Match</span>
                        <span className="text-[#F9FAFB]">87%</span>
                      </div>
                      <div className="w-full h-2 bg-[#1F2937] rounded-full overflow-hidden">
                        <div className="h-full bg-[#4F8CFF] w-[87%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-[#9CA3AF]">Experience Relevance</span>
                        <span className="text-[#F9FAFB]">82%</span>
                      </div>
                      <div className="w-full h-2 bg-[#1F2937] rounded-full overflow-hidden">
                        <div className="h-full bg-[#7C3AED] w-[82%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-[#9CA3AF]">Structure & Formatting</span>
                        <span className="text-[#F9FAFB]">100%</span>
                      </div>
                      <div className="w-full h-2 bg-[#1F2937] rounded-full overflow-hidden">
                        <div className="h-full bg-[#22C55E] w-[100%]" />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate('/ai-rewrite')}
                    variant="secondary"
                    className="w-full"
                    rightIcon={<Sparkles className="w-4 h-4 text-[#7C3AED]" />}
                  >
                    Generate AI Bullet Rewrites
                  </Button>
                </motion.div>
              ) : (
                <div className="text-center py-12 text-[#9CA3AF] space-y-3">
                  <FileCheck2 className="w-12 h-12 text-[#1F2937] mx-auto" />
                  <p className="text-xs">Paste job description on the left to generate instant score analytics.</p>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ATSAnalysis;
