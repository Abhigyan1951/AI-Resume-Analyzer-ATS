import express from 'express';
import { uploadResume, getResumeVersions, getLatestResume } from '../controllers/resumeController.js';
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

/**
 * @route   GET /api/resume/versions
 * @desc    Get all resume versions for authenticated user
 * @access  Private (JWT Protected)
 */
router.get('/versions', protect, getResumeVersions);

/**
 * @route   GET /api/resume/latest
 * @desc    Get latest resume version for authenticated user
 * @access  Private (JWT Protected)
 */
router.get('/latest', protect, getLatestResume);

export default router;
