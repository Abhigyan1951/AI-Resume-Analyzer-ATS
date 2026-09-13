import React, { useState } from 'react';
import { Sparkles, Copy, Check, Zap } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';

const sampleBulletPoints = [
  {
    original: 'Worked on backend microservices and improved performance.',
    improved: 'Architected resilient backend microservices on AWS handling 5M+ daily requests, improving throughput by 40% and decreasing latency by 150ms.',
    reason: 'Incorporated Google XYZ metric formula, action verb "Architected", and scale statistics.',
  },
  {
    original: 'Built React UI components and fixed bugs.',
    improved: 'Engineered reusable React 19 component design system with Tailwind CSS and Framer Motion, boosting frontend development velocity by 35%.',
    reason: 'Highlighting modern tech stack and measurable efficiency gain.',
  },
];

export const AIRewrite = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const toast = useToast();

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success('Copied improved bullet point to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageHeader
        title="AI Resume Rewrite & Enhancement"
        subtitle="Transform plain bullet points into high-impact, quantified achievement statements using Google's XYZ formula."
        badge="Step 3 of 3"
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#7C3AED]" />
              Rewritten Professional Summary
            </CardTitle>
            <CardDescription>Tailored specifically for target Software Engineering roles</CardDescription>
          </div>
          <Badge variant="secondary">Gemini 3.6 Generated</Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl glass-soft border border-[#7C3AED]/30 leading-relaxed text-sm text-[#F9FAFB]">
            "Results-driven Senior Full Stack Engineer with 7+ years of experience engineering scalable web platforms using React, Node.js, and TypeScript. Proven track record architecting microservices on AWS and optimizing PostgreSQL databases to support 5M+ daily requests. Adept at establishing automated CI/CD pipelines and leading cross-functional engineering teams."
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>AI Bullet Point Transformations</CardTitle>
            <CardDescription>Click copy to use directly in your resume</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {sampleBulletPoints.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl glass-card border border-[#1F2937] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                <span className="font-semibold uppercase tracking-wider">Before</span>
                <span className="text-xs text-[#6B7280]">Original Text</span>
              </div>
              <p className="text-sm text-[#9CA3AF] line-through">{item.original}</p>

              <div className="pt-2 border-t border-[#1F2937]/60 flex items-center justify-between text-xs text-[#22C55E]">
                <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-[#22C55E]" /> AI Optimized Bullet
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(item.improved, idx)}
                  leftIcon={copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copiedIndex === idx ? 'Copied' : 'Copy'}
                </Button>
              </div>

              <p className="text-sm font-medium text-[#F9FAFB] leading-relaxed bg-[#1A2235]/50 p-3 rounded-xl border border-[#4F8CFF]/20">
                {item.improved}
              </p>

              <p className="text-xs text-[#9CA3AF] italic">
                <span className="font-semibold text-[#4F8CFF]">Why:</span> {item.reason}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRewrite;
