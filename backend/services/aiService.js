import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Resume from '../models/resumeModel.js';
import ApiError from '../utils/apiError.js';

/**
 * @file aiService.js
 * @description AI-Powered Resume Rewrite and Optimization Service using Google Gemini API.
 * Analyzes candidate resumes against target job descriptions to produce tailored summaries,
 * high-impact quantified bullet points, missing keywords, and strategic ATS suggestions.
 */

/**
 * Sanitizes and parses JSON responses from Gemini AI, handling markdown backticks or raw JSON.
 * @param {string} rawText - Raw text output from model
 * @returns {Object} Parsed JSON object
 */
const parseGeminiJsonResponse = (rawText = '') => {
  try {
    // 1. Direct JSON parse attempt
    return JSON.parse(rawText);
  } catch {
    // 2. Extract JSON block if surrounded by markdown fences ```json ... ```
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (err) {
        throw new ApiError(502, `Failed to parse AI response JSON block: ${err.message}`);
      }
    }

    // 3. Fallback: extract substring between first { and last }
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const potentialJson = rawText.substring(firstBrace, lastBrace + 1);
        return JSON.parse(potentialJson);
      } catch (err) {
        throw new ApiError(502, `Failed to extract valid JSON from AI output: ${err.message}`);
      }
    }

    throw new ApiError(502, 'AI model output did not contain valid JSON.');
  }
};

/**
 * Service: Rewrite and optimize resume text using Google Gemini Generative AI
 * 
 * @param {Object} params - Service parameters
 * @param {string} params.resumeId - MongoDB ObjectId of the uploaded resume
 * @param {string} params.jobDescription - Target job posting / description text
 * @param {string} params.userId - Authenticated user MongoDB ObjectId
 * @returns {Promise<Object>} Optimized rewrite payload
 */
export const rewriteResumeAI = async ({ resumeId, jobDescription, userId }) => {
  // 1. Input Validations
  if (!resumeId) {
    throw new ApiError(400, 'Resume ID is required for AI rewrite.');
  }

  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    throw new ApiError(400, 'Invalid Resume ID format.');
  }

  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
    throw new ApiError(400, 'Please provide a detailed job description (minimum 20 characters).');
  }

  // 2. Verify Gemini API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new ApiError(500, 'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables.');
  }

  // 3. Query Resume from MongoDB with User Ownership Check
  const resume = await Resume.findOne({
    _id: resumeId,
    user: userId,
  });

  if (!resume) {
    throw new ApiError(404, 'Resume not found or you do not have permission to access it.');
  }

  const resumeText = resume.extractedText;
  if (!resumeText || resumeText.trim().length === 0) {
    throw new ApiError(422, 'The selected resume contains no extracted text to analyze.');
  }

  // 4. Initialize Google Generative AI Client
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  });

  // 5. Construct Structured Prompt
  const prompt = `
You are an expert Executive Resume Writer and Applicant Tracking System (ATS) Optimization Specialist.
Analyze the provided RESUME TEXT against the TARGET JOB DESCRIPTION and generate a highly tailored, ATS-compliant optimization report.

---
TARGET JOB DESCRIPTION:
${jobDescription.trim()}

---
CANDIDATE RESUME TEXT:
${resumeText.trim()}

---
TASK INSTRUCTIONS:
1. Rewritten Professional Summary: Craft an impactful, 3-4 sentence summary emphasizing the candidate's core strengths aligned specifically with the job description requirements.
2. Improved Bullet Points: Select 4-6 experience bullet points from the resume (or create enhanced versions based on existing experience) transformed with the Google XYZ formula ("Accomplished [X], as measured by [Y], by doing [Z]") with strong action verbs and quantified impact metrics.
3. Missing Keywords: Identify high-priority skills, frameworks, methodologies, or certifications present in the Job Description that the candidate should add.
4. Actionable Suggestions: Provide 4-6 concrete, prioritized recommendations for formatting, ATS keyword placement, and interview readiness.
5. Skills To Highlight: A list of 6-10 primary technical and soft skills the candidate already possesses that are most relevant for this specific role.

OUTPUT FORMAT:
You MUST respond with a strict JSON object matching this exact structure:
{
  "rewrittenSummary": "string",
  "improvedBulletPoints": [
    {
      "original": "string",
      "improved": "string",
      "improvementReason": "string"
    }
  ],
  "missingKeywords": ["string"],
  "skillsToHighlight": ["string"],
  "actionableSuggestions": ["string"]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawOutput = response.text();

    const parsedData = parseGeminiJsonResponse(rawOutput);

    return {
      resumeId: resume._id,
      originalName: resume.originalName,
      modelUsed: modelName,
      rewrittenSummary: parsedData.rewrittenSummary || '',
      improvedBulletPoints: Array.isArray(parsedData.improvedBulletPoints) ? parsedData.improvedBulletPoints : [],
      missingKeywords: Array.isArray(parsedData.missingKeywords) ? parsedData.missingKeywords : [],
      skillsToHighlight: Array.isArray(parsedData.skillsToHighlight) ? parsedData.skillsToHighlight : [],
      actionableSuggestions: Array.isArray(parsedData.actionableSuggestions) ? parsedData.actionableSuggestions : [],
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Handle Gemini SDK specific errors
    if (error.status === 400 || error.message?.includes('API_KEY_INVALID')) {
      throw new ApiError(401, 'Invalid Gemini API key. Please check your GEMINI_API_KEY environment variable.');
    }
    if (error.status === 429 || error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new ApiError(429, 'Gemini AI rate limit exceeded. Please try again in a few moments.');
    }
    throw new ApiError(500, `AI Resume Rewrite failed: ${error.message}`);
  }
};

export default {
  rewriteResumeAI,
};
