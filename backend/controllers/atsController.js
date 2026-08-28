import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import { analyzeResumeATS } from '../services/atsService.js';

/**
 * @file atsController.js
 * @description Controller handling ATS scoring and resume analysis requests.
 */

/**
 * @desc    Analyze resume text against job description for ATS scoring
 * @route   POST /api/ats/analyze
 * @access  Private (JWT Protected)
 */
export const analyzeResume = asyncHandler(async (req, res) => {
  const { resumeId, jobDescription } = req.body;
  const userId = req.user._id || req.user.id;

  if (!resumeId) {
    throw new ApiError(400, 'Please provide a valid resume ID in request body.');
  }

  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
    throw new ApiError(400, 'Please provide the target job description text in request body.');
  }

  const analysisReport = await analyzeResumeATS({
    resumeId,
    jobDescription,
    userId,
  });

  res.status(200).json({
    success: true,
    message: 'ATS resume analysis completed successfully',
    data: analysisReport,
  });
});

export default {
  analyzeResume,
};
