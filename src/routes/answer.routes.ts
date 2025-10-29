import { Router } from "express";
import * as answerController from "../controllers/answer.controller";

const router = Router();

/**
 * @swagger
 * /api/answers:
 *   post:
 *     summary: Create a new answer
 *     tags: [Answer]
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
 *         description: Answer created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", answerController.createAnswer);

/**
 * @swagger
 * /api/answers:
 *   get:
 *     summary: Get all answers
 *     tags: [Answer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of answers
 *       401:
 *         description: Unauthorized
 */
router.get("/", answerController.getAllAnswers);

/**
 * @swagger
 * /api/answers/{id}:
 *   get:
 *     summary: Get answer by ID
 *     tags: [Answer]
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
 *         description: Answer found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Answer not found
 */
router.get("/:id", answerController.getAnswerById);

/**
 * @swagger
 * /api/answers/{id}:
 *   put:
 *     summary: Update answer by ID
 *     tags: [Answer]
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
 *         description: Answer updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Answer not found
 */
router.put("/:id", answerController.updateAnswer);

/**
 * @swagger
 * /api/answers/{id}:
 *   delete:
 *     summary: Delete answer by ID
 *     tags: [Answer]
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
 *         description: Answer deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Answer not found
 */
router.delete("/:id", answerController.deleteAnswer);

export default router;