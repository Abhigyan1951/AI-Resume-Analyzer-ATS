import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createVersion,
  getVersions,
  getAllUserVersions,
  compareVersions,
} from '../controllers/versionController.js';

/**
 * @file versionRoutes.js
 * @description Express Routes for Git-Style Resume Version Intelligence.
 */

const router = express.Router();

// All version routes require JWT authentication
router.use(protect);

router.post('/', createVersion);
router.get('/', getAllUserVersions);
router.get('/:resumeId', getVersions);
router.get('/:resumeId/compare/:versionA/:versionB', compareVersions);

export default router;
