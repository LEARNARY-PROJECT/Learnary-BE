import { Router } from "express";
import * as submissionController from "../controllers/submission.controller";

const router = Router();

/**
 * @swagger
 * /api/submissions:
 *   post:
 *     summary: Create a new submission
 *     tags: [Submission]
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
 *         description: Submission created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", submissionController.createSubmission);

/**
 * @swagger
 * /api/submissions:
 *   get:
 *     summary: Get all submissions
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of submissions
 *       401:
 *         description: Unauthorized
 */
router.get("/", submissionController.getAllSubmissions);

/**
 * @swagger
 * /api/submissions/{id}:
 *   get:
 *     summary: Get submission by ID
 *     tags: [Submission]
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
 *         description: Submission found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Submission not found
 */
router.get("/:id", submissionController.getSubmissionById);

/**
 * @swagger
 * /api/submissions/{id}:
 *   put:
 *     summary: Update submission by ID
 *     tags: [Submission]
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
 *         description: Submission updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Submission not found
 */
router.put("/:id", submissionController.updateSubmission);

/**
 * @swagger
 * /api/submissions/{id}:
 *   delete:
 *     summary: Delete submission by ID
 *     tags: [Submission]
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
 *         description: Submission deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Submission not found
 */
router.delete("/:id", submissionController.deleteSubmission);

export default router;