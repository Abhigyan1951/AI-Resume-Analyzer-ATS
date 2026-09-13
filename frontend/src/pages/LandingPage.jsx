import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Target,
  Sparkles,
  UploadCloud,
  FileCheck2,
  History,
  ShieldCheck,
  ArrowRight,
  Play,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  Key,
  Box,
} from 'lucide-react';
import LandingNav from '../components/landing/LandingNav';
import InteractiveDemo from '../components/landing/InteractiveDemo';
import LandingFooter from '../components/landing/LandingFooter';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const features = [
  {
    icon: Target,
    title: 'ATS Match Scoring',
    description: 'Instant structural and keyword overlap analysis tuned to Applicant Tracking System algorithms.',
    color: 'primary',
  },
  {
    icon: Sparkles,
    title: 'Gemini AI Rewriter',
    description: 'Transforms plain bullet points into high-impact metric statements using Google XYZ formula.',
    color: 'secondary',
  },
  {
    icon: UploadCloud,
    title: 'PDF Parsing Engine',
    description: 'Fast, secure text extraction from single and multi-page PDF resume files up to 5MB.',
    color: 'success',
  },
  {
    icon: FileCheck2,
    title: 'Skill Gap Detection',
    description: 'Pinpoints missing technical skills and certifications present in target job postings.',
    color: 'warning',
  },
  {
    icon: History,
    title: 'Resume History & Audit',
    description: 'Track score progression across multiple job applications with versioned history logs.',
    color: 'primary',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise JWT Security',
    description: 'Role-based authentication, bcrypt password hashing, and encrypted session security.',
    color: 'secondary',
  },
];

const timelineSteps = [
  {
    step: '01',
    title: 'Upload PDF Resume',
    description: 'Upload your existing PDF resume. Our backend extracts structured text without layout corruption.',
  },
  {
    step: '02',
    title: 'Run ATS Match Analysis',
    description: 'Paste your target job description. The engine evaluates keyword match density and section hierarchy.',
  },
  {
    step: '03',
    title: 'Gemini AI Optimization',
    description: 'Generate tailored bullet points, rewritten professional summaries, and high-impact action verbs.',
  },
  {
    step: '04',
    title: 'Land More Interviews',
    description: 'Copy optimized text directly into your resume to pass ATS filters and stand out to recruiters.',
  },
];

const techStack = [
  { name: 'React 19', category: 'Frontend UI', icon: Layers },
  { name: 'Node.js', category: 'Runtime', icon: Cpu },
  { name: 'MongoDB', category: 'Database', icon: Database },
  { name: 'Express', category: 'Backend Framework', icon: Box },
  { name: 'Gemini AI', category: 'LLM Engine', icon: Sparkles },
  { name: 'JWT Auth', category: 'Security', icon: Key },
  { name: 'Tailwind CSS', category: 'Design System', icon: Layers },
  { name: 'Docker', category: 'Containerization', icon: Box },
];

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F9FAFB] font-sans selection:bg-[#4F8CFF]/30 selection:text-[#4F8CFF] overflow-x-hidden">
      {/* Background Floating Subtle Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#4F8CFF]/8 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[500px] h-[500px] bg-[#7C3AED]/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <LandingNav />

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-[#4F8CFF]/30 text-xs font-semibold text-[#4F8CFF]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Powered by Google Gemini AI & ATS Scoring</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-[#F9FAFB]"
          >
            Land More Interviews with{' '}
            <span className="bg-gradient-to-r from-[#4F8CFF] via-[#7C3AED] to-[#22C55E] bg-clip-text text-transparent">
              AI-Powered
            </span>{' '}
            Resume Analysis
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-xl text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed"
          >
            Analyze keyword density, eliminate ATS parse errors, and generate high-impact bullet points using Google's metric formula. Built for modern tech professionals.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto shadow-xl shadow-[#4F8CFF]/25"
            >
              Upload Resume Free
            </Button>

            <a href="#interactive-demo" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Play className="w-4 h-4 fill-current text-[#4F8CFF]" />}
                className="w-full sm:w-auto"
              >
                Watch Interactive Demo
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Hero Product Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 rounded-3xl glass-elevated border border-[#1F2937] p-4 sm:p-6 shadow-2xl relative max-w-5xl mx-auto overflow-hidden group"
        >
          {/* Mockup Top Window Bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1F2937]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-[#9CA3AF] bg-[#111827] px-3 py-1 rounded-full border border-[#1F2937]">
              https://resumai.io/ats-analysis
            </span>
            <Badge variant="success" dot>
              84% Match
            </Badge>
          </div>

          {/* Mockup Preview Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl glass-card border border-[#1F2937] space-y-2">
              <span className="text-xs font-semibold text-[#9CA3AF]">Target Position</span>
              <h4 className="text-sm font-bold text-[#F9FAFB]">Full Stack Engineer @ Vercel</h4>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#4F8CFF]/15 text-[#4F8CFF]">
                  React 19
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#4F8CFF]/15 text-[#4F8CFF]">
                  Node.js
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#4F8CFF]/15 text-[#4F8CFF]">
                  AWS
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl glass-card border border-[#1F2937] space-y-2">
              <span className="text-xs font-semibold text-[#9CA3AF]">AI Rewritten Bullet</span>
              <p className="text-xs text-[#F9FAFB] leading-relaxed font-medium">
                "Architected microservices handling 5M+ daily requests, improving throughput by 40%."
              </p>
            </div>

            <div className="p-4 rounded-xl glass-card border border-[#1F2937] space-y-2">
              <span className="text-xs font-semibold text-[#9CA3AF]">ATS Optimization</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span className="text-xs text-[#F9FAFB] font-semibold">18 Keywords Verified</span>
              </div>
              <p className="text-[11px] text-[#9CA3AF]">0 structural layout warnings</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="primary">Platform Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F9FAFB] tracking-tight">
            Engineered for Modern Tech Careers
          </h2>
          <p className="text-sm text-[#9CA3AF]">
            Everything you need to bypass ATS resume screeners and impress hiring managers at tier-1 product companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} hover className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1A2235] border border-[#1F2937] flex items-center justify-center text-[#4F8CFF]">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#F9FAFB]">{feat.title}</h3>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed">{feat.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Interactive ATS Demo */}
      <section id="interactive-demo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="secondary">Live Simulation</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F9FAFB] tracking-tight">
            Test the ATS Analysis Engine
          </h2>
          <p className="text-sm text-[#9CA3AF]">
            Toggle between raw and AI-optimized resume states to see real-time ATS match scoring in action.
          </p>
        </div>

        <InteractiveDemo />
      </section>

      {/* How It Works Timeline */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="primary">Simple Workflow</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F9FAFB] tracking-tight">
            How ResumAI Works
          </h2>
          <p className="text-sm text-[#9CA3AF]">
            Four effortless steps from raw PDF document to an interview-ready resume.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {timelineSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-2xl glass-card border border-[#1F2937] relative space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-[#4F8CFF]/40">{step.step}</span>
                <div className="w-8 h-8 rounded-full bg-[#1A2235] flex items-center justify-center text-xs font-bold text-[#4F8CFF]">
                  ✓
                </div>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-[#F9FAFB]">{step.title}</h4>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack Showcase */}
      <section id="tech-stack" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="secondary">Enterprise Stack</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F9FAFB] tracking-tight">
            Built with Modern Web Technologies
          </h2>
          <p className="text-sm text-[#9CA3AF]">
            Production-grade MERN architecture integrated with Google Gemini AI.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl glass-card border border-[#1F2937] hover:border-[#4F8CFF]/50 hover:shadow-lg hover:shadow-[#4F8CFF]/10 transition-all flex items-center gap-3 cursor-pointer group"
              >
                <div className="p-2.5 rounded-lg bg-[#1A2235] text-[#4F8CFF] group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#F9FAFB]">{tech.name}</h5>
                  <span className="text-[10px] text-[#9CA3AF]">{tech.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#4F8CFF]/20 via-[#7C3AED]/20 to-[#22C55E]/20 border border-[#4F8CFF]/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F9FAFB]">
              Ready to Upgrade Your Resume?
            </h2>
            <p className="text-sm text-[#9CA3AF]">
              Join thousands of engineers and product leaders landing top interviews.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/dashboard')}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="mx-auto"
          >
            Open Dashboard Workspace
          </Button>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
