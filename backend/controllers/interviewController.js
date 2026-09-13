import asyncHandler from '../utils/asyncHandler.js';
import interviewService from '../services/interviewService.js';

/**
 * @file interviewController.js
 * @description Controller handling AI Interview Preparation Hub HTTP endpoints.
 */

/**
 * @desc    Generate personalized interview questions
 * @route   POST /api/interview/generate
 * @access  Private
 */
export const generateInterviewSet = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { resumeId, targetRole } = req.body;

  const prep = await interviewService.generateInterviewPrep({
    userId,
    resumeId,
    targetRole,
  });

  res.status(201).json({
    success: true,
    message: 'Interview prep set generated successfully',
    data: prep,
  });
});

/**
 * @desc    Get user's interview preparation set
 * @route   GET /api/interview
 * @access  Private
 */
export const getInterviewPrep = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const prep = await interviewService.getUserInterviewPrep(userId);

  res.status(200).json({
    success: true,
    data: prep,
  });
});

/**
 * @desc    Toggle question mastery status
 * @route   PATCH /api/interview/:id/question/:questionId/mastered
 * @access  Private
 */
export const toggleQuestionMastery = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { id: prepId, questionId } = req.params;

  const prep = await interviewService.toggleMasteredQuestion(userId, prepId, questionId);

  res.status(200).json({
    success: true,
    message: 'Question status updated successfully',
    data: prep,
  });
});

/**
 * @desc    Evaluate practice answer in Interactive Mock Interview mode
 * @route   POST /api/interview/mock-eval
 * @access  Private
 */
export const evaluateAnswer = asyncHandler(async (req, res) => {
  const { question, userAnswer, expectedAnswer } = req.body;

  const evaluation = await interviewService.evaluateMockAnswer({
    question,
    userAnswer,
    expectedAnswer,
  });

  res.status(200).json({
    success: true,
    data: evaluation,
  });
});

export default {
  generateInterviewSet,
  getInterviewPrep,
  toggleQuestionMastery,
  evaluateAnswer,
};
