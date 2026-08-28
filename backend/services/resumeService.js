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
 * Processes an uploaded resume file: parses PDF text, creates resume record in MongoDB,
 * and returns saved metadata with a 300-character text preview.
 * 
 * @param {Object} params - Processing parameters
 * @param {string} params.userId - Authenticated user MongoDB ObjectId
 * @param {Object} params.file - Multer uploaded file object (filename, originalname, path, size, etc.)
 * @returns {Promise<Object>} Object containing saved resume document and first 300 characters preview
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

  // 2. Persist resume document into MongoDB
  const resume = await Resume.create({
    user: userId,
    originalName: file.originalname,
    fileName: file.filename,
    filePath: file.path,
    extractedText,
    uploadDate: new Date(),
  });

  // 3. Extract first 300 characters for immediate preview response
  const previewText = extractedText.slice(0, 300);

  return {
    resume: {
      id: resume._id,
      user: resume.user,
      originalName: resume.originalName,
      fileName: resume.fileName,
      filePath: resume.filePath,
      uploadDate: resume.uploadDate,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    },
    previewText,
  };
};

export default {
  extractTextFromPDF,
  processResumeUpload,
};
