import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/chapter.controller";

const router = express.Router();

/**
 * @openapi
 * /api/chapters:
 *   post:
 *     summary: Create a new chapter
 *     tags: [Chapter]
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
 *         description: Chapter created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/chapters", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/chapters:
 *   get:
 *     summary: Get all chapters
 *     tags: [Chapter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chapters
 *       401:
 *         description: Unauthorized
 */
router.get("/chapters", authenticate, authorizeRoles("ADMIN"), getAll);

/**
 * @openapi
 * /api/chapters/{id}:
 *   get:
 *     summary: Get chapter by ID
 *     tags: [Chapter]
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
 *         description: Chapter found
 *       404:
 *         description: Chapter not found
 *       401:
 *         description: Unauthorized
 */
router.get("/chapters/:id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/chapters/{id}:
 *   put:
 *     summary: Update chapter by ID
 *     tags: [Chapter]
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
 *         description: Chapter updated successfully
 *       404:
 *         description: Chapter not found
 *       401:
 *         description: Unauthorized
 */
router.put("/chapters/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/chapters/{id}:
 *   delete:
 *     summary: Delete chapter by ID
 *     tags: [Chapter]
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
 *         description: Chapter deleted successfully
 *       404:
 *         description: Chapter not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/chapters/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
