import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/leanrerCourses.controller";

const router = express.Router();

/**
 * @openapi
 * /api/leanrer-courses:
 *   post:
 *     summary: Create a new leanrer course
 *     tags: [LeanrerCourses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: LeanrerCourse created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/leanrer-courses", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/leanrer-courses:
 *   get:
 *     summary: Get all leanrer courses
 *     tags: [LeanrerCourses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leanrer courses
 *       401:
 *         description: Unauthorized
 */
router.get("/leanrer-courses", authenticate, authorizeRoles("ADMIN"), getAll);

/**
 * @openapi
 * /api/leanrer-courses/{id}:
 *   get:
 *     summary: Get leanrer course by ID
 *     tags: [LeanrerCourses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: LeanrerCourse found
 *       404:
 *         description: LeanrerCourse not found
 *       401:
 *         description: Unauthorized
 */
router.get("/leanrer-courses/:id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/leanrer-courses/{id}:
 *   put:
 *     summary: Update leanrer course by ID
 *     tags: [LeanrerCourses]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: LeanrerCourse updated successfully
 *       404:
 *         description: LeanrerCourse not found
 *       401:
 *         description: Unauthorized
 */
router.put("/leanrer-courses/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/leanrer-courses/{id}:
 *   delete:
 *     summary: Delete leanrer course by ID
 *     tags: [LeanrerCourses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: LeanrerCourse deleted successfully
 *       404:
 *         description: LeanrerCourse not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/leanrer-courses/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
