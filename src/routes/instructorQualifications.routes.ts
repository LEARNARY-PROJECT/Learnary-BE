import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/instructorQualifications.controller";

const router = express.Router();

/**
 * @openapi
 * /api/instructor-qualifications:
 *   post:
 *     summary: Create a new instructor qualification
 *     tags: [InstructorQualifications]
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
 *         description: InstructorQualifications created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/instructor-qualifications", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/instructor-qualifications:
 *   get:
 *     summary: Get all instructor qualifications
 *     tags: [InstructorQualifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of instructor qualifications
 *       401:
 *         description: Unauthorized
 */
router.get("/instructor-qualifications", authenticate, authorizeRoles("ADMIN"), getAll);

/**
 * @openapi
 * /api/instructor-qualifications/{id}:
 *   get:
 *     summary: Get instructor qualification by ID
 *     tags: [InstructorQualifications]
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
 *         description: InstructorQualifications found
 *       404:
 *         description: InstructorQualifications not found
 *       401:
 *         description: Unauthorized
 */
router.get("/instructor-qualifications/:id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/instructor-qualifications/{id}:
 *   put:
 *     summary: Update instructor qualification by ID
 *     tags: [InstructorQualifications]
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
 *         description: InstructorQualifications updated successfully
 *       404:
 *         description: InstructorQualifications not found
 *       401:
 *         description: Unauthorized
 */
router.put("/instructor-qualifications/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/instructor-qualifications/{id}:
 *   delete:
 *     summary: Delete instructor qualification by ID
 *     tags: [InstructorQualifications]
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
 *         description: InstructorQualifications deleted successfully
 *       404:
 *         description: InstructorQualifications not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/instructor-qualifications/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
