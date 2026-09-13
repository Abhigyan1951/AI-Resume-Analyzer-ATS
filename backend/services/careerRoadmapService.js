import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Resume from '../models/resumeModel.js';
import Roadmap from '../models/roadmapModel.js';
import ApiError from '../utils/apiError.js';

/**
 * @file careerRoadmapService.js
 * @description AI Career Growth Roadmap Generator using Google Gemini 3.6 API.
 * Generates personalized 7-day, 30-day, 60-day, and 90-day action plans with priority,
 * estimated effort, resources, AI explainability ("whyItMatters"), and estimated ATS impact.
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

const getDefaultMilestones = (targetRole = 'Full Stack Engineer') => [
  {
    timeframe: '7_days',
    title: 'Containerize Backend & Add Dockerfile',
    description: 'Create multi-stage Docker build for Node.js API and MongoDB connection layer.',
    priority: 'High',
    estimatedEffort: '3-5 hours',
    resources: ['https://docs.docker.com/get-started/', 'https://node-docker-guide.dev'],
    completed: false,
    whyItMatters: 'DevOps & containerization skills are present in 78% of modern backend/full-stack postings.',
    atsImpact: '+8 ATS Points',
  },
  {
    timeframe: '7_days',
    title: 'Quantify Experience Bullet Points',
    description: 'Transform resume bullets using Google XYZ formula ("Accomplished X as measured by Y by doing Z").',
    priority: 'High',
    estimatedEffort: '2 hours',
    resources: ['https://resume.guide/xyz-formula'],
    completed: false,
    whyItMatters: 'Recruiters reject 65% of resumes that lack clear measurable impact metrics.',
    atsImpact: '+12 ATS Points',
  },
  {
    timeframe: '30_days',
    title: 'Implement GitHub Actions CI/CD Pipeline',
    description: 'Automate linting, unit testing, and Docker build workflows on push to main branch.',
    priority: 'High',
    estimatedEffort: '8-10 hours',
    resources: ['https://docs.github.com/en/actions'],
    completed: false,
    whyItMatters: 'Demonstrates end-to-end engineering velocity and automation experience.',
    atsImpact: '+10 ATS Points',
  },
  {
    timeframe: '30_days',
    title: 'Master Redis Caching & System Design',
    description: 'Implement distributed session management and query result caching using Redis.',
    priority: 'Medium',
    estimatedEffort: '12 hours',
    resources: ['https://redis.io/docs/manual/client-side-caching/'],
    completed: false,
    whyItMatters: 'Differentiates senior candidates in technical system design interviews.',
    atsImpact: '+6 ATS Points',
  },
  {
    timeframe: '60_days',
    title: 'Deploy Production Cloud Infrastructure',
    description: 'Deploy application to AWS EC2/ECS or Vercel + AWS DocumentDB with custom domain & SSL.',
    priority: 'High',
    estimatedEffort: '15 hours',
    resources: ['https://aws.amazon.com/getting-started/'],
    completed: false,
    whyItMatters: 'Real cloud deployment experience instantly elevates your resume above entry-level candidates.',
    atsImpact: '+15 ATS Points',
  },
  {
    timeframe: '90_days',
    title: 'AWS Cloud Practitioner Certification',
    description: 'Complete foundational AWS Cloud Practitioner certification to validate cloud architecture expertise.',
    priority: 'Medium',
    estimatedEffort: '30 hours',
    resources: ['https://aws.amazon.com/certification/certified-cloud-practitioner/'],
    completed: false,
    whyItMatters: 'Industry certifications act as hard filters for HR keyword screeners.',
    atsImpact: '+14 ATS Points',
  },
];

export const generateCareerRoadmap = async ({ userId, resumeId, jobDescription, targetRole = 'Full Stack Engineer' }) => {
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
  let milestones = [];

  if (apiKey && apiKey !== 'your_gemini_api_key_here' && (resumeText || jobDescription)) {
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
You are a Principal Technical Career Strategist and Hiring Manager.
Generate a structured 90-Day Personalized AI Career Growth Roadmap for a candidate targeting the role: "${targetRole}".

CANDIDATE RESUME SUMMARY:
${(resumeText || 'Full Stack Engineer candidate looking to optimize resume and career skills.').slice(0, 2000)}

TARGET JOB DESCRIPTION / GOALS:
${(jobDescription || 'Full Stack Developer with Node.js, React, Cloud, DevOps, CI/CD, and System Design experience.').slice(0, 2000)}

INSTRUCTIONS:
Generate 6 milestone objects distributed across 4 timeframes:
- 7_days (2 items)
- 30_days (2 items)
- 60_days (1 item)
- 90_days (1 item)

For each milestone include:
- timeframe ("7_days" | "30_days" | "60_days" | "90_days")
- title (actionable concise title)
- description (specific technical guidance)
- priority ("High" | "Medium" | "Low")
- estimatedEffort (e.g. "3-5 hours")
- resources (array of 2 helpful doc/tutorial URLs or resource names)
- whyItMatters (AI Explainability: explanation of why recruiters care)
- atsImpact (estimated ATS point gain e.g. "+8 ATS Points")

OUTPUT FORMAT:
Return a JSON object:
{
  "targetRole": "${targetRole}",
  "milestones": [ ... ]
}
`;

      const result = await model.generateContent(prompt);
      const responseText = (await result.response).text();
      const parsed = parseGeminiJsonResponse(responseText);
      if (Array.isArray(parsed.milestones) && parsed.milestones.length > 0) {
        milestones = parsed.milestones.map(m => ({
          ...m,
          completed: false,
        }));
      }
    } catch (err) {
      console.warn('[careerRoadmapService] Gemini API call failed or unconfigured, using heuristic roadmap:', err.message);
    }
  }

  if (milestones.length === 0) {
    milestones = getDefaultMilestones(targetRole);
  }

  let roadmap = await Roadmap.findOne({ user: userId });
  if (roadmap) {
    roadmap.targetRole = targetRole;
    roadmap.resume = resumeDoc ? resumeDoc._id : roadmap.resume;
    roadmap.milestones = milestones;
    roadmap.overallProgress = 0;
    await roadmap.save();
  } else {
    roadmap = await Roadmap.create({
      user: userId,
      resume: resumeDoc ? resumeDoc._id : new mongoose.Types.ObjectId(),
      targetRole,
      milestones,
      overallProgress: 0,
    });
  }

  return roadmap;
};

export const getUserRoadmap = async (userId) => {
  let roadmap = await Roadmap.findOne({ user: userId });
  if (!roadmap) {
    roadmap = await generateCareerRoadmap({ userId });
  }
  return roadmap;
};

export const toggleMilestone = async (userId, roadmapId, milestoneId) => {
  const roadmap = await Roadmap.findOne({ _id: roadmapId, user: userId });
  if (!roadmap) throw new ApiError(404, 'Roadmap not found.');

  const milestone = roadmap.milestones.id(milestoneId);
  if (!milestone) throw new ApiError(404, 'Milestone not found.');

  milestone.completed = !milestone.completed;
  
  const completedCount = roadmap.milestones.filter(m => m.completed).length;
  roadmap.overallProgress = Math.round((completedCount / roadmap.milestones.length) * 100);

  await roadmap.save();
  return roadmap;
};

export default {
  generateCareerRoadmap,
  getUserRoadmap,
  toggleMilestone,
};
