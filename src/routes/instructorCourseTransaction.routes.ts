import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/instructorCourseTransaction.controller";

const router = express.Router();

/**
 * @openapi
 * /api/instructor-course-transactions:
 *   post:
 *     summary: Create a new instructor course transaction
 *     tags: [InstructorCourseTransaction]
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
 *         description: InstructorCourseTransaction created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/instructor-course-transactions", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/instructor-course-transactions:
 *   get:
 *     summary: Get all instructor course transactions
 *     tags: [InstructorCourseTransaction]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of instructor course transactions
 *       401:
 *         description: Unauthorized
 */
router.get("/instructor-course-transactions", authenticate, authorizeRoles("ADMIN"), getAll);

/**
 * @openapi
 * /api/instructor-course-transactions/{id}:
 *   get:
 *     summary: Get instructor course transaction by ID
 *     tags: [InstructorCourseTransaction]
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
 *         description: InstructorCourseTransaction found
 *       404:
 *         description: InstructorCourseTransaction not found
 *       401:
 *         description: Unauthorized
 */
router.get("/instructor-course-transactions/:id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/instructor-course-transactions/{id}:
 *   put:
 *     summary: Update instructor course transaction by ID
 *     tags: [InstructorCourseTransaction]
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
 *         description: InstructorCourseTransaction updated successfully
 *       404:
 *         description: InstructorCourseTransaction not found
 *       401:
 *         description: Unauthorized
 */
router.put("/instructor-course-transactions/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/instructor-course-transactions/{id}:
 *   delete:
 *     summary: Delete instructor course transaction by ID
 *     tags: [InstructorCourseTransaction]
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
 *         description: InstructorCourseTransaction deleted successfully
 *       404:
 *         description: InstructorCourseTransaction not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/instructor-course-transactions/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
