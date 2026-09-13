import api from './api';

/**
 * Enterprise Service for Resume management, ATS Analysis, and AI Rewrites.
 */

// Helper: Save uploaded resume metadata to local history cache
export const saveResumeToHistory = (resumeData) => {
  try {
    const existing = JSON.parse(localStorage.getItem('resumes_history') || '[]');
    const filtered = existing.filter((item) => item.id !== resumeData.id && item._id !== resumeData._id);
    const updated = [resumeData, ...filtered];
    localStorage.setItem('resumes_history', JSON.stringify(updated));
    return updated;
  } catch {
    return [resumeData];
  }
};

// Helper: Get all saved resumes from history
export const getResumesHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('resumes_history') || '[]');
  } catch {
    return [];
  }
};

/**
 * Upload PDF resume file to POST /api/resume/upload
 * @param {File} file - PDF file object
 * @param {Function} onProgress - Progress percentage callback
 */
export const uploadResumeFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  const result = response.data;
  if (result.success && result.data?.resume) {
    saveResumeToHistory({
      id: result.data.resume._id || result.data.resume.id,
      _id: result.data.resume._id || result.data.resume.id,
      originalName: result.data.resume.originalName,
      extractedText: result.data.previewText || result.data.resume.extractedText,
      uploadedAt: result.data.resume.createdAt || new Date().toISOString(),
      score: 84, // Initial benchmark score
    });
  }

  return result;
};

/**
 * Run real-time ATS keyword and structure analysis via POST /api/ats/analyze
 * @param {string} resumeId - MongoDB ObjectId of resume
 * @param {string} jobDescription - Target job posting text
 */
export const analyzeATS = async (resumeId, jobDescription) => {
  const response = await api.post('/ats/analyze', {
    resumeId,
    jobDescription,
  });
  return response.data;
};

/**
 * Generate AI-powered resume rewrites via POST /api/ai/rewrite
 * @param {string} resumeId - MongoDB ObjectId of resume
 * @param {string} jobDescription - Target job posting text
 */
export const rewriteWithAI = async (resumeId, jobDescription) => {
  const response = await api.post('/ai/rewrite', {
    resumeId,
    jobDescription,
  });
  return response.data;
};

export default {
  uploadResumeFile,
  analyzeATS,
  rewriteWithAI,
  saveResumeToHistory,
  getResumesHistory,
};
