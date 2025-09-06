import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/instructorSpecializations.controller";

const router = express.Router();

/**
 * @openapi
 * /api/instructor-specializations:
 *   post:
 *     summary: Create a new instructor specialization
 *     tags: [InstructorSpecializations]
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
 *         description: InstructorSpecializations created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/instructor-specializations", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/instructor-specializations:
 *   get:
 *     summary: Get all instructor specializations
 *     tags: [InstructorSpecializations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of instructor specializations
 *       401:
 *         description: Unauthorized
 */
router.get("/instructor-specializations", authenticate, authorizeRoles("ADMIN"), getAll);

/**
 * @openapi
 * /api/instructor-specializations/{id}:
 *   get:
 *     summary: Get instructor specialization by ID
 *     tags: [InstructorSpecializations]
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
 *         description: InstructorSpecializations found
 *       404:
 *         description: InstructorSpecializations not found
 *       401:
 *         description: Unauthorized
 */
router.get("/instructor-specializations/:id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/instructor-specializations/{id}:
 *   put:
 *     summary: Update instructor specialization by ID
 *     tags: [InstructorSpecializations]
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
 *         description: InstructorSpecializations updated successfully
 *       404:
 *         description: InstructorSpecializations not found
 *       401:
 *         description: Unauthorized
 */
router.put("/instructor-specializations/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/instructor-specializations/{id}:
 *   delete:
 *     summary: Delete instructor specialization by ID
 *     tags: [InstructorSpecializations]
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
 *         description: InstructorSpecializations deleted successfully
 *       404:
 *         description: InstructorSpecializations not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/instructor-specializations/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
