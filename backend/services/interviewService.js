import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Resume from '../models/resumeModel.js';
import InterviewPrep from '../models/interviewModel.js';
import ApiError from '../utils/apiError.js';

/**
 * @file interviewService.js
 * @description AI Interview Preparation Engine using Google Gemini API.
 * Generates personalized questions across HR, Technical, Resume-specific, Project-specific, and Behavioral
 * with model answers, follow-up questions, difficulty tags, AI Explainability ("whyAsked"), and Mock Interview evaluation.
 */

const parseGeminiJsonResponse = (rawText = '') => {
  try {
    return JSON.parse(rawText);
  } catch {
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
    }
    throw new Error('Could not parse valid JSON from AI response.');
  }
};

const getDefaultInterviewQuestions = (targetRole = 'Full Stack Engineer') => [
  {
    id: 'q1',
    category: 'HR',
    question: 'Tell me about yourself and why you are interested in this position.',
    expectedAnswer: 'Structure using Present-Past-Future format: Summarize current engineering expertise, highlight key technical accomplishments in modern Web/Node/React stack, and articulate why this role fits your growth trajectory.',
    followUp: 'What specific project best demonstrates your core technical strength?',
    difficulty: 'Easy',
    whyAsked: 'Assesses communication clarity, self-awareness, and cultural fit within the team.',
    atsImpact: 'Top Impression Signal',
    userMastered: false,
  },
  {
    id: 'q2',
    category: 'Technical',
    question: 'Explain how JWT Authentication works and how you prevent XSS/CSRF security vulnerabilities.',
    expectedAnswer: 'JWT contains Header, Payload, and Signature. Store tokens in HTTP-only SameSite cookies or use short-lived access tokens with secure refresh tokens in memory to mitigate XSS and CSRF risks.',
    followUp: 'How do you handle token revocation or user session invalidation prior to expiration?',
    difficulty: 'Medium',
    whyAsked: 'Verifies production security awareness and backend architecture knowledge.',
    atsImpact: 'High Recruiter Signal',
    userMastered: false,
  },
  {
    id: 'q3',
    category: 'Resume',
    question: 'Why did you choose MongoDB for data persistence in your recent projects over relational PostgreSQL?',
    expectedAnswer: 'Document schemas allowed rapid iteration for unstructured resume JSON models, flexible nested subdocuments, and high horizontal scaling capabilities.',
    followUp: 'When would you migrate to a relational database with strict ACID transactions?',
    difficulty: 'Medium',
    whyAsked: 'Tests architectural decision-making and database trade-off evaluation.',
    atsImpact: 'Senior Engineering Signal',
    userMastered: false,
  },
  {
    id: 'q4',
    category: 'Project',
    question: 'Describe a significant performance bottleneck in your web applications and how you optimized it.',
    expectedAnswer: 'Identified slow database queries using indexing, reduced bundle size with dynamic React code splitting, and implemented Redis caching for an 80% latency reduction.',
    followUp: 'How did you measure and monitor these metrics before and after deployment?',
    difficulty: 'Hard',
    whyAsked: 'Demonstrates deep analytical troubleshooting and performance engineering capabilities.',
    atsImpact: 'Critical Competency',
    userMastered: false,
  },
  {
    id: 'q5',
    category: 'Behavioral',
    question: 'Describe a situation where you had a tight deadline and conflicting priority requirements.',
    expectedAnswer: 'Used STAR method (Situation, Task, Action, Result). Communicated transparently with stakeholders, prioritized core MVP deliverables, refactored technical debt post-launch, and delivered on schedule.',
    followUp: 'What would you do differently if faced with the exact same constraint today?',
    difficulty: 'Medium',
    whyAsked: 'Evaluates resilience, stakeholder management, and agile problem solving under pressure.',
    atsImpact: 'High Leadership Signal',
    userMastered: false,
  },
];

export const generateInterviewPrep = async ({ userId, resumeId, targetRole = 'Full Stack Engineer' }) => {
  if (!userId) throw new ApiError(401, 'User authentication required.');

  let resumeText = '';
  let resumeDoc = null;
  if (resumeId && mongoose.Types.ObjectId.isValid(resumeId)) {
    resumeDoc = await Resume.findOne({ _id: resumeId, user: userId });
    if (resumeDoc) resumeText = resumeDoc.extractedText;
  } else {
    resumeDoc = await Resume.findOne({ user: userId }).sort({ createdAt: -1 });
    if (resumeDoc) resumeText = resumeDoc.extractedText;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  let questions = [];

  if (apiKey && apiKey !== 'your_gemini_api_key_here' && resumeText) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json',
        },
      });

      const prompt = `
You are an Executive Technical Recruiter and Senior Staff Software Engineer.
Generate 5 personalized, high-yield interview questions for a candidate based on their resume and target role "${targetRole}".

RESUME TEXT SUMMARY:
${resumeText.slice(0, 2500)}

INSTRUCTIONS:
Generate 1 question for EACH of the 5 categories:
1. HR
2. Technical
3. Resume (questions specific to technologies or projects in their resume)
4. Project (deep dive into architectural choices)
5. Behavioral

For each question include:
- id (e.g. "q1", "q2")
- category ("HR" | "Technical" | "Resume" | "Project" | "Behavioral")
- question (clear direct interview question)
- expectedAnswer (ideal comprehensive candidate answer outline)
- followUp (strategic follow-up question)
- difficulty ("Easy" | "Medium" | "Hard")
- whyAsked (AI Explainability: what technical signal recruiters evaluate)
- atsImpact (recruiter signal score badge)

OUTPUT FORMAT:
Return a JSON object:
{
  "questions": [ ... ]
}
`;

      const result = await model.generateContent(prompt);
      const responseText = (await result.response).text();
      const parsed = parseGeminiJsonResponse(responseText);
      if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        questions = parsed.questions.map(q => ({
          ...q,
          userMastered: false,
        }));
      }
    } catch (err) {
      console.warn('[interviewService] Gemini API failed or unconfigured, using default interview prep:', err.message);
    }
  }

  if (questions.length === 0) {
    questions = getDefaultInterviewQuestions(targetRole);
  }

  let prep = await InterviewPrep.findOne({ user: userId });
  if (prep) {
    prep.targetRole = targetRole;
    prep.resume = resumeDoc ? resumeDoc._id : prep.resume;
    prep.questions = questions;
    prep.readinessScore = 78;
    await prep.save();
  } else {
    prep = await InterviewPrep.create({
      user: userId,
      resume: resumeDoc ? resumeDoc._id : new mongoose.Types.ObjectId(),
      targetRole,
      questions,
      readinessScore: 78,
    });
  }

  return prep;
};

export const getUserInterviewPrep = async (userId) => {
  let prep = await InterviewPrep.findOne({ user: userId });
  if (!prep) {
    prep = await generateInterviewPrep({ userId });
  }
  return prep;
};

export const toggleMasteredQuestion = async (userId, prepId, questionId) => {
  const prep = await InterviewPrep.findOne({ _id: prepId, user: userId });
  if (!prep) throw new ApiError(404, 'Interview prep set not found.');

  const q = prep.questions.find(item => item.id === questionId || item._id?.toString() === questionId);
  if (!q) throw new ApiError(404, 'Question not found.');

  q.userMastered = !q.userMastered;
  
  const masteredCount = prep.questions.filter(item => item.userMastered).length;
  prep.readinessScore = Math.min(100, Math.round(60 + (masteredCount / prep.questions.length) * 40));

  await prep.save();
  return prep;
};

export const evaluateMockAnswer = async ({ question, userAnswer, expectedAnswer }) => {
  if (!userAnswer || userAnswer.trim().length < 5) {
    throw new ApiError(400, 'Please provide a detailed answer to evaluate.');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      });

      const prompt = `
You are an expert Technical Interviewer.
Evaluate the candidate's practice response to the following interview question:

QUESTION: ${question}
EXPECTED ANSWER OUTLINE: ${expectedAnswer}
CANDIDATE RESPONSE: ${userAnswer}

Provide evaluation feedback in strict JSON format:
{
  "score": number (1 to 10),
  "feedback": "string summarizing overall performance",
  "strengths": ["string"],
  "improvements": ["string"],
  "improvedSampleAnswer": "string showing enhanced version using STAR or technical precision"
}
`;

      const result = await model.generateContent(prompt);
      const text = (await result.response).text();
      return parseGeminiJsonResponse(text);
    } catch (err) {
      console.warn('[interviewService] Gemini mock eval failed, returning heuristic feedback:', err.message);
    }
  }

  // Fallback heuristic evaluation
  const wordCount = userAnswer.trim().split(/\s+/).length;
  const score = Math.min(9, Math.max(5, Math.round(wordCount / 12)));
  return {
    score,
    feedback: score > 7 ? 'Strong candidate response with solid technical context!' : 'Good start! Expand with specific STAR metrics and technical keywords.',
    strengths: ['Addressed the core question topic', 'Clear structure and professional tone'],
    improvements: ['Include specific technical metrics or quantified results', 'Reference exact security or architectural trade-offs'],
    improvedSampleAnswer: `${expectedAnswer} For example, in my recent project I implemented this exact pattern to improve latency by 35%.`,
  };
};

export default {
  generateInterviewPrep,
  getUserInterviewPrep,
  toggleMasteredQuestion,
  evaluateMockAnswer,
};
