import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { create, getAll, getById, remove, update } from '../controllers/course.controller';

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: d1f3a488-3c9e-4fa2-9c01-187f304edf5d
 *         title:
 *           type: string
 *           example: Introduction to AI
 *         description:
 *           type: string
 *           example: A beginner's course on Artificial Intelligence.
 *         thumbnail:
 *           type: string
 *           example: https://example.com/image.jpg
 *         price:
 *           type: number
 *           example: 49.99
 *         instructorId:
 *           type: string
 *           example: 8c58f8f5-f91a-4bd6-9d34-4567867ecf89
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: List of all courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       500:
 *         description: Failed to fetch courses
 */
router.get('/courses', getAll);

/**
 * @openapi
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Failed to fetch course
 */
router.get('/courses/:id', getById);

/**
 * @openapi
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - thumbnail
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to AI
 *               description:
 *                 type: string
 *                 example: A beginner's course on AI
 *               thumbnail:
 *                 type: string
 *                 example: https://example.com/thumbnail.jpg
 *               price:
 *                 type: number
 *                 example: 49.99
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
router.post('/courses', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN'), create);

/**
 * @openapi
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course by ID
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course to update
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
 *                 example: Advanced AI
 *               description:
 *                 type: string
 *                 example: An advanced course on AI
 *               thumbnail:
 *                 type: string
 *                 example: https://example.com/updated-thumbnail.jpg
 *               price:
 *                 type: number
 *                 example: 99.99
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 */
router.put('/courses/:id', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN'), update);

/**
 * @openapi
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/courses/:id', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN'), remove);

export default router;
