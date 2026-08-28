import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import { rewriteResumeAI } from '../services/aiService.js';

/**
 * @file aiController.js
 * @description Controller handling AI-driven resume rewriting and intelligent ATS optimization requests.
 */

/**
 * @desc    Generate AI-powered resume rewrites, optimized bullet points, and strategic suggestions
 * @route   POST /api/ai/rewrite
 * @access  Private (JWT Protected)
 */
export const rewriteResume = asyncHandler(async (req, res) => {
  const { resumeId, jobDescription } = req.body;
  const userId = req.user._id || req.user.id;

  if (!resumeId) {
    throw new ApiError(400, 'Please provide a valid resume ID in the request body.');
  }

  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
    throw new ApiError(400, 'Please provide the target job description text in the request body.');
  }

  const aiRewriteData = await rewriteResumeAI({
    resumeId,
    jobDescription,
    userId,
  });

  res.status(200).json({
    success: true,
    message: 'AI resume rewrite and optimization suggestions generated successfully',
    data: aiRewriteData,
  });
});

export default {
  rewriteResume,
};
