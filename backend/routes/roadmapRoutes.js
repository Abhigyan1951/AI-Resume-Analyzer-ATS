import express from 'express';
import { generateRoadmap, getRoadmap, toggleRoadmapMilestone } from '../controllers/roadmapController.js';
import { protect } from '../middleware/authMiddleware.js';

/**
 * @file roadmapRoutes.js
 * @description Express routing for AI Career Growth Roadmap endpoints.
 */

const router = express.Router();

router.post('/generate', protect, generateRoadmap);
router.get('/', protect, getRoadmap);
router.patch('/:id/milestone/:milestoneId', protect, toggleRoadmapMilestone);

export default router;
