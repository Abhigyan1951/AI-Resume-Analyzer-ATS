import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import versionService from '../services/versionService.js';

/**
 * @file versionController.js
 * @description Controller handling Git-style Resume Versioning HTTP requests.
 */

/**
 * @desc    Create a new resume version snapshot
 * @route   POST /api/versions
 * @access  Private (JWT Protected)
 */
export const createVersion = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { resumeId, versionLabel, changesSummary, newlyAddedKeywords, removedWeaknesses, aiRewriteSnapshot } = req.body;

  if (!resumeId) {
    throw new ApiError(400, 'Resume ID is required to create a version snapshot.');
  }

  const version = await versionService.createVersionSnapshot({
    userId,
    resumeId,
    versionLabel,
    changesSummary,
    newlyAddedKeywords,
    removedWeaknesses,
    aiRewriteSnapshot,
  });

  res.status(201).json({
    success: true,
    message: 'Resume version snapshot created successfully',
    data: version,
  });
});

/**
 * @desc    Get all resume versions for a specific resume (or authenticated user)
 * @route   GET /api/versions/:resumeId
 * @access  Private (JWT Protected)
 */
export const getVersions = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { resumeId } = req.params;

  const versions = await versionService.getVersionsForResume(userId, resumeId);

  res.status(200).json({
    success: true,
    count: versions.length,
    data: versions,
  });
});

/**
 * @desc    Get all versions for current user (fallback listing)
 * @route   GET /api/versions
 * @access  Private (JWT Protected)
 */
export const getAllUserVersions = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;

  const versions = await versionService.getVersionsForResume(userId, null);

  res.status(200).json({
    success: true,
    count: versions.length,
    data: versions,
  });
});

/**
 * @desc    Compare two resume versions side-by-side
 * @route   GET /api/versions/:resumeId/compare/:versionA/:versionB
 * @access  Private (JWT Protected)
 */
export const compareVersions = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { resumeId, versionA, versionB } = req.params;

  const comparison = await versionService.compareVersions(userId, resumeId, versionA, versionB);

  res.status(200).json({
    success: true,
    message: 'Version comparison calculated successfully',
    data: comparison,
  });
});

export default {
  createVersion,
  getVersions,
  getAllUserVersions,
  compareVersions,
};
