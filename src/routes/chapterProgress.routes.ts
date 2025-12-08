import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import * as ChapterProgressController from "../controllers/chapterProgress.controller";

const router = express.Router();

/**
 * @openapi
 * /api/chapter-progress/complete:
 *   post:
 *     summary: Mark a chapter as completed
 *     tags: [ChapterProgress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chapter_id
 *             properties:
 *               chapter_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chapter marked as completed
 */
router.post("/chapter-progress/complete", authenticate, ChapterProgressController.markComplete);

/**
 * @openapi
 * /api/chapter-progress/incomplete:
 *   post:
 *     summary: Mark a chapter as incomplete
 *     tags: [ChapterProgress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chapter_id
 *             properties:
 *               chapter_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chapter marked as incomplete
 */
router.post("/chapter-progress/incomplete", authenticate, ChapterProgressController.markIncomplete);

/**
 * @openapi
 * /api/chapter-progress/my:
 *   get:
 *     summary: Get all chapter progress for current user
 *     tags: [ChapterProgress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User chapter progress
 */
router.get("/chapter-progress/my", authenticate, ChapterProgressController.getMyProgress);

/**
 * @openapi
 * /api/chapter-progress/course/{course_id}:
 *   get:
 *     summary: Get chapter progress for a specific course
 *     tags: [ChapterProgress]
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
 *         description: Course chapter progress
 */
router.get("/chapter-progress/course/:course_id", authenticate, ChapterProgressController.getCourseProgress);

/**
 * @openapi
 * /api/chapter-progress/{chapter_id}:
 *   get:
 *     summary: Get progress for a specific chapter
 *     tags: [ChapterProgress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chapter_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chapter progress
 */
router.get("/chapter-progress/:chapter_id", authenticate, ChapterProgressController.getProgress);

/**
 * @openapi
 * /api/chapter-progress/{chapter_id}:
 *   delete:
 *     summary: Delete chapter progress
 *     tags: [ChapterProgress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chapter_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Progress deleted
 */
router.delete("/chapter-progress/:chapter_id", authenticate, ChapterProgressController.remove);

export default router;
