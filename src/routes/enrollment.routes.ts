import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { createEnrollment, getAllEnrollments, getEnrollmentsByUser } from '../controllers/enrollment.controller';
const router = express.Router();

/**
 * @openapi
 * /api/enrollments:
 *   get:
 *     summary: Get all enrollments
 *     tags: [Enrollment]
 *     responses:
 *       200:
 *         description: List of enrollments
 */
router.get('/enrollments', authenticate, getAllEnrollments);

/**
 * @openapi
 * /api/enrollments/user:
 *   get:
 *     summary: Get enrollments of the authenticated user
 *     tags: [Enrollment]
 *     responses:
 *       200:
 *         description: List of user enrollments
 */
router.get('/enrollments/user', authenticate, getEnrollmentsByUser);

/**
 * @openapi
 * /api/enrollments:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Enrollment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 *       400:
 *         description: Enrollment failed
 */
router.post('/enrollments', authenticate, createEnrollment);

export default router;
