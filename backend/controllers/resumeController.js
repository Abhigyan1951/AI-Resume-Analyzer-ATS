import { processResumeUpload, getUserResumeVersions } from '../services/resumeService.js';
import Resume from '../models/resumeModel.js';

/**
 * @file resumeController.js
 * @description Controller handling resume upload, PDF parsing, and version history HTTP requests.
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

/**
 * @desc    Get all uploaded resume versions for authenticated user
 * @route   GET /api/resume/versions
 * @access  Private (JWT Protected)
 */
export const getResumeVersions = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const versions = await getUserResumeVersions(userId);

  res.status(200).json({
    success: true,
    count: versions.length,
    data: versions,
  });
});

/**
 * @desc    Get latest resume for authenticated user
 * @route   GET /api/resume/latest
 * @access  Private (JWT Protected)
 */
export const getLatestResume = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const latestResume = await Resume.findOne({ user: userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: latestResume || null,
  });
});

export default {
  uploadResume,
  getResumeVersions,
  getLatestResume,
};
