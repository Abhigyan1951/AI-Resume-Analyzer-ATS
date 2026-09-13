import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, CheckCircle2, RefreshCw, Eye, EyeOff, Award, HelpCircle, Send, Play, ShieldAlert, Zap } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function InterviewPrep() {
  const { token, user } = useAuth();
  const { showToast } = useToast();

  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [generating, setGenerating] = useState(false);

  // Interactive Mock Interview Mode state
  const [mockMode, setMockMode] = useState(false);
  const [mockIndex, setMockIndex] = useState(0);
  const [mockAnswer, setMockAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [mockFeedback, setMockFeedback] = useState(null);

  const fetchInterviewPrep = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/interview', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setInterviewData(res.data.data);
      }
    } catch (err) {
      console.error('Fetch interview error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchInterviewPrep();
    }
  }, [token]);

  const handleToggleReveal = (id) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleMastered = async (questionId) => {
    if (!interviewData) return;
    try {
      const updatedQuestions = interviewData.questions.map((q) =>
        q.id === questionId || q._id === questionId ? { ...q, userMastered: !q.userMastered } : q
      );
      setInterviewData({ ...interviewData, questions: updatedQuestions });

      const res = await axios.patch(
        `http://localhost:5000/api/interview/${interviewData._id}/question/${questionId}/mastered`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setInterviewData(res.data.data);
        showToast('Question status updated!', 'success');
      }
    } catch (err) {
      console.error('Toggle error:', err);
      showToast('Failed to update question status', 'error');
      fetchInterviewPrep();
    }
  };

  const handleRegenerate = async () => {
    try {
      setGenerating(true);
      const res = await axios.post(
        'http://localhost:5000/api/interview/generate',
        { targetRole: user?.careerPreferences?.targetRole || 'Full Stack Engineer' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setInterviewData(res.data.data);
        showToast('Generated fresh personalized interview set!', 'success');
      }
    } catch (err) {
      console.error('Regenerate error:', err);
      showToast('Failed to regenerate interview set', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleMockSubmit = async () => {
    if (!mockAnswer.trim()) {
      showToast('Please type your response before submitting.', 'warning');
      return;
    }
    const currentQ = questions[mockIndex];
    if (!currentQ) return;

    try {
      setEvaluating(true);
      setMockFeedback(null);
      const res = await axios.post(
        'http://localhost:5000/api/interview/mock-eval',
        {
          question: currentQ.question,
          userAnswer: mockAnswer,
          expectedAnswer: currentQ.expectedAnswer,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setMockFeedback(res.data.data);
        showToast('AI Mock Interview Evaluation Complete!', 'success');
      }
    } catch (err) {
      console.error('Mock eval error:', err);
      showToast('Failed to evaluate answer', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  const questions = interviewData?.questions || [];
  const categories = ['All', 'HR', 'Technical', 'Resume', 'Project', 'Behavioral'];

  const filteredQuestions =
    activeCategory === 'All'
      ? questions
      : questions.filter((q) => q.category === activeCategory);

  const getDifficultyBadge = (d) => {
    switch (d) {
      case 'Easy':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Easy</span>;
      case 'Hard':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">Hard</span>;
      default:
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Medium</span>;
    }
  };

  const currentMockQ = questions[mockIndex];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">AI Interview Preparation Hub</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Mock Interview Simulator
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Personalized HR, Technical, and Resume-specific questions tailored to your experience.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setMockMode(!mockMode);
              setMockIndex(0);
              setMockAnswer('');
              setMockFeedback(null);
            }}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition shadow-lg flex items-center gap-2 ${
              mockMode
                ? 'bg-purple-600 hover:bg-purple-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30'
            }`}
          >
            <Play className="w-4 h-4" />
            {mockMode ? 'Exit Mock Mode' : 'Start Mock Interview Mode'}
          </button>

          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
            title="Regenerate Interview Set"
          >
            <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* MOCK INTERVIEW MODE VIEW */}
      {mockMode ? (
        <div className="p-6 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Question {mockIndex + 1} of {questions.length}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Category: {currentMockQ?.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={mockIndex === 0}
                onClick={() => {
                  setMockIndex(mockIndex - 1);
                  setMockAnswer('');
                  setMockFeedback(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={mockIndex === questions.length - 1}
                onClick={() => {
                  setMockIndex(mockIndex + 1);
                  setMockAnswer('');
                  setMockFeedback(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-40"
              >
                Next Question
              </button>
            </div>
          </div>

          {currentMockQ && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 mb-1">
                  {getDifficultyBadge(currentMockQ.difficulty)}
                  <span className="text-xs text-slate-400">{currentMockQ.atsImpact}</span>
                </div>
                <h3 className="text-base font-bold text-white">{currentMockQ.question}</h3>
              </div>

              {/* User Answer Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-400" /> Type Your Response (STAR Format Recommended):
                </label>
                <textarea
                  rows={5}
                  value={mockAnswer}
                  onChange={(e) => setMockAnswer(e.target.value)}
                  placeholder="Structure your answer: Situation, Task, Action taken, and measurable Result metrics..."
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleMockSubmit}
                    disabled={evaluating}
                    className="px-5 py-2.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition flex items-center gap-2 shadow-lg shadow-purple-950 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {evaluating ? 'Evaluating Answer...' : 'Submit for AI Evaluation'}
                  </button>
                </div>
              </div>

              {/* AI Evaluation Feedback Card */}
              {mockFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <h4 className="text-sm font-bold text-white">AI Interviewer Evaluation Report</h4>
                    </div>
                    <div className="px-3 py-1 rounded-xl bg-purple-600 text-white font-black text-sm">
                      Score: {mockFeedback.score} / 10
                    </div>
                  </div>

                  <p className="text-xs text-purple-200 leading-relaxed font-medium">
                    {mockFeedback.feedback}
                  </p>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Core Strengths:
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                        {mockFeedback.strengths?.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> High-Impact Improvements:
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                        {mockFeedback.improvements?.map((imp, idx) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* STANDARD QUESTION CARDS VIEW */
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat} Questions
              </button>
            ))}
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading interview questions...</div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => {
                const qId = q.id || q._id || idx;
                const isRevealed = revealedAnswers[qId];

                return (
                  <motion.div
                    key={qId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-5 rounded-2xl border transition-all ${
                      q.userMastered
                        ? 'bg-slate-900/40 border-slate-800/80 opacity-80'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-md'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-slate-800 text-purple-300 border border-slate-700">
                            {q.category}
                          </span>
                          {getDifficultyBadge(q.difficulty)}
                          <span className="text-xs text-slate-400 font-medium">{q.atsImpact}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleMastered(qId)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition border flex items-center gap-1 ${
                              q.userMastered
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {q.userMastered ? 'Mastered' : 'Mark Mastered'}
                          </button>

                          <button
                            onClick={() => handleToggleReveal(qId)}
                            className="px-3 py-1 text-xs font-semibold text-purple-300 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg transition flex items-center gap-1.5"
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            {isRevealed ? 'Hide Model Answer' : 'Reveal Answer'}
                          </button>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug">{q.question}</h3>

                      {/* AI Explainability */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-purple-300">Why Recruiters Ask This: </span>
                          <span>{q.whyAsked || 'Evaluates practical engineering capabilities and execution style.'}</span>
                        </div>
                      </div>

                      {/* Model Answer Drawer */}
                      <AnimatePresence>
                        {isRevealed && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pt-3 overflow-hidden border-t border-slate-800/80 space-y-3"
                          >
                            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-purple-400" /> Expected Model Answer
                              </span>
                              <p className="text-xs text-slate-200 leading-relaxed">{q.expectedAnswer}</p>
                            </div>

                            {q.followUp && (
                              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                                <span className="font-bold text-amber-400">Strategic Follow-Up Question: </span>
                                <p className="italic text-slate-400">{q.followUp}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
