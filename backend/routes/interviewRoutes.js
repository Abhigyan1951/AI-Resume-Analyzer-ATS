import express from 'express';
import {
  generateInterviewSet,
  getInterviewPrep,
  toggleQuestionMastery,
  evaluateAnswer,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

/**
 * @file interviewRoutes.js
 * @description Express routing for AI Interview Preparation Hub endpoints.
 */

const router = express.Router();

router.post('/generate', protect, generateInterviewSet);
router.get('/', protect, getInterviewPrep);
router.patch('/:id/question/:questionId/mastered', protect, toggleQuestionMastery);
router.post('/mock-eval', protect, evaluateAnswer);

export default router;
