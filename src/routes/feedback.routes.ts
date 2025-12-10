import express from 'express';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';
import { createFeedback, getFeedbackByCourse } from '../controllers/feedback.controller';
const router = express.Router();

/**
 * @openapi
 * /api/feedbacks/{courseId}:
 *   get:
 *     summary: Get feedback for a specific course
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *     responses:
 *       200:
 *         description: Feedback list
 */
router.get('/feedbacks/:courseId', getFeedbackByCourse);

/**
 * @openapi
 * /api/feedbacks:
 *   post:
 *     summary: Submit feedback for a course
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - rating
 *               - comment
 *             properties:
 *               courseId:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback submitted
 */
router.post('/feedbacks', authenticate, createFeedback);

export default router;
