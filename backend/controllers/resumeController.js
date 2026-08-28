import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import { processResumeUpload } from '../services/resumeService.js';

/**
 * @file resumeController.js
 * @description Controller handling resume upload and PDF parsing HTTP requests.
 */

/**
 * @desc    Upload PDF resume, parse text content, and save metadata
 * @route   POST /api/resume/upload
 * @access  Private (JWT Protected)
 */
export const uploadResume = asyncHandler(async (req, res) => {
  // Ensure Multer successfully received and stored a file
  if (!req.file) {
    throw new ApiError(400, 'Please upload a PDF resume file using key "resume".');
  }

  const userId = req.user._id || req.user.id;

  // Delegate PDF parsing and persistence to resume service
  const { resume, previewText } = await processResumeUpload({
    userId,
    file: req.file,
  });

  res.status(201).json({
    success: true,
    message: 'Resume uploaded and parsed successfully',
    data: {
      resume,
      previewText,
    },
  });
});

export default {
  uploadResume,
};
