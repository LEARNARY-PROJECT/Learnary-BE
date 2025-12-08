import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import * as LessonProgressController from "../controllers/lessonProgress.controller";

const router = express.Router();

/**
 * @openapi
 * /api/lesson-progress/complete:
 *   post:
 *     summary: Mark a lesson as completed
 *     tags: [LessonProgress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lesson_id
 *             properties:
 *               lesson_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lesson marked as completed
 */
router.post("/lesson-progress/complete", authenticate, LessonProgressController.markComplete);

/**
 * @openapi
 * /api/lesson-progress/incomplete:
 *   post:
 *     summary: Mark a lesson as incomplete
 *     tags: [LessonProgress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lesson_id
 *             properties:
 *               lesson_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lesson marked as incomplete
 */
router.post("/lesson-progress/incomplete", authenticate, LessonProgressController.markIncomplete);

/**
 * @openapi
 * /api/lesson-progress/my:
 *   get:
 *     summary: Get all lesson progress for current user
 *     tags: [LessonProgress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User lesson progress
 */
router.get("/lesson-progress/my", authenticate, LessonProgressController.getMyProgress);

/**
 * @openapi
 * /api/lesson-progress/course/{course_id}:
 *   get:
 *     summary: Get lesson progress for a specific course
 *     tags: [LessonProgress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: course_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course lesson progress
 */
router.get("/lesson-progress/course/:course_id", authenticate, LessonProgressController.getCourseProgress);

/**
 * @openapi
 * /api/lesson-progress/{lesson_id}:
 *   get:
 *     summary: Get progress for a specific lesson
 *     tags: [LessonProgress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lesson_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson progress
 */
router.get("/lesson-progress/:lesson_id", authenticate, LessonProgressController.getProgress);

/**
 * @openapi
 * /api/lesson-progress/{lesson_id}:
 *   delete:
 *     summary: Delete lesson progress
 *     tags: [LessonProgress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lesson_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Progress deleted
 */
router.delete("/lesson-progress/:lesson_id", authenticate, LessonProgressController.remove);

export default router;
