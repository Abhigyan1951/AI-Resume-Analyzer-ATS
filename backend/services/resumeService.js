import fs from 'fs/promises';
import { createRequire } from 'module';
import Resume from '../models/resumeModel.js';
import ApiError from '../utils/apiError.js';

// Initialize CommonJS require for pdf-parse in ES Module context
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

/**
 * @file resumeService.js
 * @description Core business logic for parsing uploaded PDF resumes and persisting data to MongoDB.
 * Uses pdf-parse to extract raw text content from uploaded PDF documents.
 */

import atsService from './atsService.js';

/**
 * Parses PDF file content and extracts textual data
 * 
 * @param {string} filePath - Absolute or relative path to the PDF on disk
 * @returns {Promise<string>} Extracted raw text content
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text ? pdfData.text.trim() : '';
  } catch (error) {
    throw new ApiError(500, `Failed to parse PDF document: ${error.message}`);
  }
};

/**
 * Helper: Generate Git-Style Commit Message based on newly added skills/content
 */
const generateCommitName = (versionNumber, newlyAddedKeywords, originalName) => {
  if (versionNumber === 1) {
    return `v1.0 - Initial Baseline Resume (${originalName})`;
  }
  if (newlyAddedKeywords && newlyAddedKeywords.length > 0) {
    const topKeywords = newlyAddedKeywords.slice(0, 3).join(', ');
    return `v${versionNumber}.0 - Integrated ${topKeywords}`;
  }
  return `v${versionNumber}.0 - Optimized Formatting & ATS Impact`;
};

/**
 * Processes an uploaded resume file: parses PDF text, creates versioned resume record in MongoDB,
 * calculates version deltas, and returns saved metadata with preview.
 * 
 * @param {Object} params - Processing parameters
 * @param {string} params.userId - Authenticated user MongoDB ObjectId
 * @param {Object} params.file - Multer uploaded file object
 * @returns {Promise<Object>} Object containing saved resume document and version details
 */
export const processResumeUpload = async ({ userId, file }) => {
  if (!file) {
    throw new ApiError(400, 'No resume file provided for processing.');
  }

  // 1. Extract text from uploaded PDF file using pdf-parse
  const extractedText = await extractTextFromPDF(file.path);

  if (!extractedText || extractedText.length === 0) {
    throw new ApiError(
      422,
      'Could not extract text from the uploaded PDF. The file may be scanned, empty, or password-protected.'
    );
  }

  // 2. Determine previous resume versions for user to calculate version number & keyword diffs
  const previousResumes = await Resume.find({ user: userId }).sort({ createdAt: -1 });
  const versionNumber = previousResumes.length > 0 ? previousResumes[0].versionNumber + 1 : 1;

  // Run initial baseline analysis
  const dummyJobDesc = "Software Engineer Full Stack developer JavaScript Node.js React Python Cloud CI/CD REST API SQL Docker Agile System Design";
  const skillsAnalysis = atsService.calculateSkillsOverlap(extractedText, dummyJobDesc);
  const expAnalysis = atsService.evaluateExperience(extractedText, dummyJobDesc);
  const structAnalysis = atsService.detectResumeSections(extractedText);
  
  const currentKeywords = atsService.extractKeywords(extractedText);
  const currentKeywordsArray = Array.from(currentKeywords);

  let newlyAddedKeywords = [];
  let removedWeaknesses = [];

  if (previousResumes.length > 0 && previousResumes[0].extractedText) {
    const prevKeywords = atsService.extractKeywords(previousResumes[0].extractedText);
    newlyAddedKeywords = currentKeywordsArray.filter(kw => !prevKeywords.has(kw)).slice(0, 8);
    removedWeaknesses = (previousResumes[0].missingKeywords || []).filter(kw => currentKeywords.has(kw)).slice(0, 5);
  } else {
    newlyAddedKeywords = currentKeywordsArray.slice(0, 5);
  }

  const keywordScore = Math.min(100, Math.round((currentKeywordsArray.length / 45) * 100));
  const overallScore = atsService.calculateOverallScore(keywordScore, expAnalysis.experienceScore, structAnalysis.structureScore);
  const commitName = generateCommitName(versionNumber, newlyAddedKeywords, file.originalname);

  // 3. Persist resume document into MongoDB
  const resume = await Resume.create({
    user: userId,
    originalName: file.originalname,
    fileName: file.filename,
    filePath: file.path,
    extractedText,
    versionNumber,
    commitName,
    atsScore: overallScore,
    keywordScore,
    experienceScore: expAnalysis.experienceScore,
    structureScore: structAnalysis.structureScore,
    targetRole: 'Full Stack Engineer',
    matchedKeywords: skillsAnalysis.matchedSkills,
    missingKeywords: skillsAnalysis.missingSkills,
    newlyAddedKeywords,
    removedWeaknesses,
    uploadDate: new Date(),
  });

  const previewText = extractedText.slice(0, 300);

  return {
    resume: {
      id: resume._id,
      user: resume.user,
      originalName: resume.originalName,
      fileName: resume.fileName,
      filePath: resume.filePath,
      versionNumber: resume.versionNumber,
      commitName: resume.commitName,
      atsScore: resume.atsScore,
      newlyAddedKeywords: resume.newlyAddedKeywords,
      uploadDate: resume.uploadDate,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    },
    previewText,
  };
};

/**
 * Fetch all versions of a user's resumes ordered by version number descending
 * @param {string} userId - User ObjectId
 * @returns {Promise<Array>} Array of versioned resume objects
 */
export const getUserResumeVersions = async (userId) => {
  const versions = await Resume.find({ user: userId }).sort({ versionNumber: -1 });
  return versions;
};

export default {
  extractTextFromPDF,
  processResumeUpload,
  getUserResumeVersions,
};
