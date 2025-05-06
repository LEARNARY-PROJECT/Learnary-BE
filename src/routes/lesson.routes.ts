import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { createLessonController, createLessonByCourseId, deleteLessonController, getLessonsByCourse, getById, updateLessonController } from '../controllers/lesson.controller';

const router = express.Router();

/**
 * @openapi
 * /api/courses/{courseId}/lessons:
 *   get:
 *     summary: Get all lessons of a course
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID to get lessons from
 *     responses:
 *       200:
 *         description: List of lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */
router.get('/courses/:courseId/lessons', getLessonsByCourse);

/**
 * @openapi
 * /api/courses/{courseId}/lessons:
 *   post:
 *     summary: Create a new lesson in a specific course
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID of the course to add the lesson to
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Lesson 1 - Introduction
 *               videoUrl:
 *                 type: string
 *                 example: https://video.example.com/intro.mp4
 *               thumbnail:
 *                 type: string
 *                 example: https://img.example.com/lesson1.jpg
 *               content:
 *                 type: string
 *                 example: Welcome to your first lesson!
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/courses/:courseId/lessons', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN'), createLessonByCourseId);

/**
 * @openapi
 * /api/lessons:
 *   post:
 *     summary: Create a new lesson (standalone)
 *     tags: [Lesson]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - courseId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Lesson 2 - Deep Dive
 *               videoUrl:
 *                 type: string
 *                 example: https://video.example.com/lesson2.mp4
 *               thumbnail:
 *                 type: string
 *                 example: https://img.example.com/lesson2.jpg
 *               content:
 *                 type: string
 *                 example: In this lesson, we explore in depth...
 *               courseId:
 *                 type: string
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.post('/lessons', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN'), createLessonController);

/**
 * @openapi
 * /api/lessons/{id}:
 *   get:
 *     summary: Get lesson by ID
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 */
router.get('/lessons/:id', getById);

/**
 * @openapi
 * /api/lessons/{id}:
 *   put:
 *     summary: Update a lesson by ID
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 */
router.put('/lessons/:id', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN'), updateLessonController);

/**
 * @openapi
 * /api/lessons/{id}:
 *   delete:
 *     summary: Delete a lesson by ID
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 */
router.delete('/lessons/:id', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN'), deleteLessonController);

export default router;
