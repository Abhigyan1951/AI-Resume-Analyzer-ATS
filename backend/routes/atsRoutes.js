import express from 'express';
import { analyzeResume } from '../controllers/atsController.js';
import { protect } from '../middleware/authMiddleware.js';

/**
 * @file atsRoutes.js
 * @description Express routing for ATS resume evaluation and scoring endpoints.
 */

const router = express.Router();

/**
 * @route   POST /api/ats/analyze
 * @desc    Analyze uploaded resume text against target job description
 * @access  Private (JWT Protected)
 */
router.post('/analyze', protect, analyzeResume);

export default router;
