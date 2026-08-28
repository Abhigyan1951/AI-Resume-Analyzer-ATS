import express from 'express';
import { uploadResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadResumeFile } from '../middleware/uploadMiddleware.js';

/**
 * @file resumeRoutes.js
 * @description Express routing for Resume and ATS document management endpoints.
 */

const router = express.Router();

/**
 * @route   POST /api/resume/upload
 * @desc    Upload PDF resume, parse text content, and store metadata
 * @access  Private (JWT Protected)
 */
router.post('/upload', protect, uploadResumeFile, uploadResume);

export default router;
