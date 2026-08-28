import express from 'express';
import { rewriteResume } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

/**
 * @file aiRoutes.js
 * @description Express routing for AI-powered resume enhancement, bullet rewriting, and ATS suggestions.
 */

const router = express.Router();

/**
 * @route   POST /api/ai/rewrite
 * @desc    Generate AI tailored resume summary, improved bullet points, and keyword suggestions
 * @access  Private (JWT Protected)
 */
router.post('/rewrite', protect, rewriteResume);

export default router;
