import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/instructor.controller";

const router = express.Router();

/**
 * @openapi
 * /api/instructors:
 *   post:
 *     summary: Create a new instructor
 *     tags: [Instructor]
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
 *         description: Instructor created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/instructors", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/instructors:
 *   get:
 *     summary: Get all instructors
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of instructors
 *       401:
 *         description: Unauthorized
 */
router.get("/instructors", authenticate, authorizeRoles("ADMIN", "INSTRUCTOR"), getAll);

/**
 * @openapi
 * /api/instructors/{id}:
 *   get:
 *     summary: Get instructor by ID
 *     tags: [Instructor]
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
 *         description: Instructor found
 *       404:
 *         description: Instructor not found
 *       401:
 *         description: Unauthorized
 */
router.get("/instructors/:id", authenticate, authorizeRoles("ADMIN", "INSTRUCTOR"), getById);

/**
 * @openapi
 * /api/instructors/{id}:
 *   put:
 *     summary: Update instructor by ID
 *     tags: [Instructor]
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
 *         description: Instructor updated successfully
 *       404:
 *         description: Instructor not found
 *       401:
 *         description: Unauthorized
 */
router.put("/instructors/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/instructors/{id}:
 *   delete:
 *     summary: Delete instructor by ID
 *     tags: [Instructor]
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
 *         description: Instructor deleted successfully
 *       404:
 *         description: Instructor not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/instructors/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
