import asyncHandler from '../utils/asyncHandler.js';
import careerRoadmapService from '../services/careerRoadmapService.js';

/**
 * @file roadmapController.js
 * @description Express HTTP Controller for AI Career Growth Roadmap features.
 */

/**
 * @desc    Generate personalized career roadmap
 * @route   POST /api/roadmap/generate
 * @access  Private
 */
export const generateRoadmap = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { resumeId, jobDescription, targetRole } = req.body;

  const roadmap = await careerRoadmapService.generateCareerRoadmap({
    userId,
    resumeId,
    jobDescription,
    targetRole,
  });

  res.status(201).json({
    success: true,
    message: 'Career roadmap generated successfully',
    data: roadmap,
  });
});

/**
 * @desc    Get user's career roadmap
 * @route   GET /api/roadmap
 * @access  Private
 */
export const getRoadmap = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const roadmap = await careerRoadmapService.getUserRoadmap(userId);

  res.status(200).json({
    success: true,
    data: roadmap,
  });
});

/**
 * @desc    Toggle milestone completion status
 * @route   PATCH /api/roadmap/:id/milestone/:milestoneId
 * @access  Private
 */
export const toggleRoadmapMilestone = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { id: roadmapId, milestoneId } = req.params;

  const roadmap = await careerRoadmapService.toggleMilestone(userId, roadmapId, milestoneId);

  res.status(200).json({
    success: true,
    message: 'Milestone updated successfully',
    data: roadmap,
  });
});

export default {
  generateRoadmap,
  getRoadmap,
  toggleRoadmapMilestone,
};
