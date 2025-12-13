import express from 'express';
import * as CourseGroupController from '../controllers/courseGroup.controller';
import { authenticate, authorizeRoles, optionalAuthenticate } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/course-groups/{groupId}/courses:
 *   get:
 *     summary: Get all courses in a group
 *     tags: [CourseGroup]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of courses in group
 */
router.get(
  '/course-groups/:groupId/courses',
  optionalAuthenticate,
  CourseGroupController.getCoursesByGroupId
);

/**
 * @openapi
 * /api/course-groups:
 *   post:
 *     summary: Add course to group
 *     tags: [CourseGroup]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group_id
 *               - course_id
 *               - order_index
 *             properties:
 *               group_id:
 *                 type: string
 *               course_id:
 *                 type: string
 *               order_index:
 *                 type: number
 *     responses:
 *       201:
 *         description: Course added to group
 */
router.post(
  '/course-groups',
  authenticate,
  authorizeRoles('ADMIN','INSTRUCTOR'),
  CourseGroupController.addCourseToGroup
);

/**
 * @openapi
 * /api/course-groups/{groupId}/courses/{courseId}:
 *   delete:
 *     summary: Remove course from group
 *     tags: [CourseGroup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Course removed from group
 */
router.delete(
  '/course-groups/:groupId/courses/:courseId',
  authenticate,
  authorizeRoles('ADMIN','INSTRUCTOR'),
  CourseGroupController.removeCourseFromGroup
);

/**
 * @openapi
 * /api/course-groups/{groupId}/courses/{courseId}/order:
 *   put:
 *     summary: Update course order in group
 *     tags: [CourseGroup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_index
 *             properties:
 *               order_index:
 *                 type: number
 *     responses:
 *       200:
 *         description: Order updated
 */
router.put(
  '/course-groups/:groupId/courses/:courseId/order',
  authenticate,
  authorizeRoles('ADMIN','INSTRUCTOR'),
  CourseGroupController.updateCourseOrder
);

/**
 * @openapi
 * /api/course-groups/{groupId}/bulk-order:
 *   put:
 *     summary: Bulk update course orders in group
 *     tags: [CourseGroup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courses
 *             properties:
 *               courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     course_id:
 *                       type: string
 *                     order_index:
 *                       type: number
 *     responses:
 *       200:
 *         description: Orders updated
 */
router.put(
  '/course-groups/:groupId/bulk-order',
  authenticate,
  authorizeRoles('ADMIN','INSTRUCTOR'),
  CourseGroupController.bulkUpdateCourseOrder
);

export default router;
