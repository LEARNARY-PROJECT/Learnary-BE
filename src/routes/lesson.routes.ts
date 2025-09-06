import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/lesson.controller";

const router = express.Router();

/**
 * @openapi
 * /api/lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lesson]
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
 *         description: Lesson created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/lessons", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/lessons:
 *   get:
 *     summary: Get all lessons
 *     tags: [Lesson]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of lessons
 *       401:
 *         description: Unauthorized
 */
router.get("/lessons", authenticate, authorizeRoles("ADMIN"), getAll);

/**
 * @openapi
 * /api/lessons/{id}:
 *   get:
 *     summary: Get lesson by ID
 *     tags: [Lesson]
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
 *         description: Lesson found
 *       404:
 *         description: Lesson not found
 *       401:
 *         description: Unauthorized
 */
router.get("/lessons/:id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/lessons/{id}:
 *   put:
 *     summary: Update lesson by ID
 *     tags: [Lesson]
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
 *         description: Lesson updated successfully
 *       404:
 *         description: Lesson not found
 *       401:
 *         description: Unauthorized
 */
router.put("/lessons/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/lessons/{id}:
 *   delete:
 *     summary: Delete lesson by ID
 *     tags: [Lesson]
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
 *         description: Lesson deleted successfully
 *       404:
 *         description: Lesson not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/lessons/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
