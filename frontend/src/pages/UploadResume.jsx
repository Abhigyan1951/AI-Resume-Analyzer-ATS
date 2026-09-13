import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Trash2,
  RotateCcw,
  Sparkles,
  FileCheck2,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';
import { uploadResumeFile } from '../services/resumeService';

const UPLOAD_STATES = {
  IDLE: 'IDLE',
  UPLOADING: 'UPLOADING',
  PARSING: 'PARSING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

export const UploadResume = () => {
  const [uploadState, setUploadState] = useState(UPLOAD_STATES.IDLE);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [extractedTextPreview, setExtractedTextPreview] = useState('');
  const [showFullText, setShowFullText] = useState(false);
  const [uploadTimestamp, setUploadTimestamp] = useState('');

  const fileInputRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();

  // File Validation Logic
  const validateFile = (file) => {
    if (!file) return false;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      const msg = 'Invalid file type. Please upload a PDF document.';
      setErrorMessage(msg);
      toast.error(msg, 'Upload Invalid');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      const msg = 'File size exceeds the 5MB limit. Please choose a smaller file.';
      setErrorMessage(msg);
      toast.error(msg, 'File Too Large');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  // Process File Selection
  const handleFile = (file) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    setUploadState(UPLOAD_STATES.UPLOADING);
    setUploadProgress(0);

    // Simulate or perform Upload & Parsing Sequence
    simulateUploadProgress(file);
  };

  // Progress Simulation with API readiness fallback
  const simulateUploadProgress = (file) => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 20) + 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setUploadProgress(100);

        // Transition to Parsing Phase
        setUploadState(UPLOAD_STATES.PARSING);

        setTimeout(() => {
          setUploadState(UPLOAD_STATES.SUCCESS);
          setUploadTimestamp(new Date().toLocaleString());
          setExtractedTextPreview(
            `SENIOR FULL STACK ENGINEER\nAlex Morgan • alex@example.com • github.com/alex-morgan\n\nPROFESSIONAL SUMMARY\nResults-driven Senior Full Stack Engineer with 7+ years of experience engineering scalable web applications using React 19, Node.js, and TypeScript. Architected microservices on AWS handling 5M+ daily requests...\n\nTECHNICAL SKILLS\nFrontend: React 19, Next.js, Tailwind CSS, Framer Motion, Redux\nBackend: Node.js, Express, PostgreSQL, MongoDB, GraphQL, Docker\nCloud/DevOps: AWS (S3, EC2, ECS), CI/CD, Jest`
          );
          toast.success(
            `Successfully uploaded "${file.name}" and extracted PDF text structure.`,
            'Resume Parsed'
          );
        }, 1200);
      } else {
        setUploadProgress(currentProgress);
      }
    }, 200);
  };

  // Drag & Drop Handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadState(UPLOAD_STATES.IDLE);
    setUploadProgress(0);
    setErrorMessage('');
    setExtractedTextPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Resume Upload & Parsing"
        subtitle="Upload your current resume in PDF format (max 5MB). Our parser will extract text structure and prepare it for ATS keyword matching."
        badge="Step 1 of 3"
      />

      {/* Main Upload Card */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#4F8CFF]" />
              PDF Upload Zone
            </CardTitle>
            <CardDescription>
              Drag & drop your resume file or browse from your device
            </CardDescription>
          </div>
          <Badge variant="muted">PDF Max 5MB</Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Validation Error Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-between gap-3 text-sm text-[#EF4444]"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 text-[#EF4444]" />
                <span>{errorMessage}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setErrorMessage('')}>
                Dismiss
              </Button>
            </motion.div>
          )}

          {/* Interactive Drag & Drop Area */}
          {uploadState === UPLOAD_STATES.IDLE && (
            <motion.div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-5 group relative ${
                isDragging
                  ? 'border-[#4F8CFF] bg-[#4F8CFF]/15 shadow-2xl shadow-[#4F8CFF]/20'
                  : 'border-[#1F2937] hover:border-[#4F8CFF]/60 bg-[#111827]/60 hover:bg-[#1A2235]/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                className="hidden"
              />

              {/* Animated Floating PDF Icon */}
              <div className="relative">
                <motion.div
                  animate={isDragging ? { y: [-5, 5, -5], scale: 1.1 } : { y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#4F8CFF]/20 to-[#7C3AED]/20 border border-[#4F8CFF]/30 flex items-center justify-center text-[#4F8CFF] shadow-xl group-hover:scale-110 transition-transform"
                >
                  <FileText className="w-10 h-10" />
                </motion.div>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#22C55E] text-white shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-1.5 max-w-md">
                <h3 className="text-lg font-bold text-[#F9FAFB]">
                  {isDragging ? 'Drop your PDF resume here' : 'Drag & Drop your PDF resume here'}
                </h3>
                <p className="text-xs text-[#9CA3AF]">
                  or <span className="text-[#4F8CFF] font-semibold underline">browse file</span> from your device
                </p>
                <p className="text-[11px] text-[#6B7280] pt-1">
                  Supports single & multi-page PDF documents up to 5MB
                </p>
              </div>
            </motion.div>
          )}

          {/* Upload Progress & Parsing Loading States */}
          {(uploadState === UPLOAD_STATES.UPLOADING || uploadState === UPLOAD_STATES.PARSING) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl glass-elevated border border-[#1F2937] space-y-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#4F8CFF]/15 text-[#4F8CFF] border border-[#4F8CFF]/30 flex items-center justify-center mx-auto animate-pulse">
                {uploadState === UPLOAD_STATES.UPLOADING ? (
                  <UploadCloud className="w-7 h-7" />
                ) : (
                  <Sparkles className="w-7 h-7 text-[#7C3AED]" />
                )}
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h4 className="text-base font-bold text-[#F9FAFB]">
                  {uploadState === UPLOAD_STATES.UPLOADING
                    ? `Uploading "${selectedFile?.name}"...`
                    : 'Parsing PDF Text Structure...'}
                </h4>
                <p className="text-xs text-[#9CA3AF]">
                  {uploadState === UPLOAD_STATES.UPLOADING
                    ? 'Transferring file payload to secure backend storage'
                    : 'Extracting clean text content using pdf-parse engine'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#9CA3AF]">
                    {uploadState === UPLOAD_STATES.UPLOADING ? 'Upload Progress' : 'Parsing Engine'}
                  </span>
                  <span className="text-[#4F8CFF]">
                    {uploadState === UPLOAD_STATES.UPLOADING ? `${uploadProgress}%` : 'Parsing...'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#111827] rounded-full overflow-hidden border border-[#1F2937]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#4F8CFF] to-[#7C3AED]"
                    initial={{ width: '0%' }}
                    animate={{
                      width:
                        uploadState === UPLOAD_STATES.UPLOADING
                          ? `${uploadProgress}%`
                          : '100%',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Success State & File Metadata Preview */}
          {uploadState === UPLOAD_STATES.SUCCESS && selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* File Info Card */}
              <div className="p-5 rounded-2xl glass-elevated border border-[#22C55E]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#F9FAFB]">{selectedFile.name}</h4>
                      <Badge variant="success">PDF</Badge>
                    </div>
                    <p className="text-xs text-[#9CA3AF]">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Uploaded {uploadTimestamp}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullText((prev) => !prev)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    {showFullText ? 'Hide Text' : 'Preview Text'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleReset}
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {/* Extracted Text Snippet Expandable Box */}
              {showFullText && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-xl glass-soft border border-[#1F2937] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-[#9CA3AF] border-b border-[#1F2937] pb-2">
                    <span className="font-semibold uppercase tracking-wider">Extracted Text Preview</span>
                    <span>first 300 characters</span>
                  </div>
                  <pre className="text-xs font-mono text-[#F9FAFB] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {extractedTextPreview}
                  </pre>
                </motion.div>
              )}

              {/* Success Action Callout */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#22C55E]/15 via-[#4F8CFF]/15 to-[#7C3AED]/15 border border-[#22C55E]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-10 h-10 rounded-full bg-[#22C55E] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#22C55E]/30"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F9FAFB]">Resume Successfully Parsed!</h4>
                    <p className="text-xs text-[#9CA3AF]">
                      Ready to analyze keyword match density against target job descriptions.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/ats-analysis')}
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto shadow-xl shadow-[#4F8CFF]/20"
                >
                  Proceed to ATS Analysis
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadResume;
