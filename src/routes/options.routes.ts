import { Router } from "express";
import * as optionsController from "../controllers/options.controller";

const router = Router();

/**
 * @swagger
 * /api/options:
 *   post:
 *     summary: Create a new option
 *     tags: [Options]
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
 *         description: Option created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", optionsController.createOption);

/**
 * @swagger
 * /api/options:
 *   get:
 *     summary: Get all options
 *     tags: [Options]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of options
 *       401:
 *         description: Unauthorized
 */
router.get("/", optionsController.getAllOptions);

/**
 * @swagger
 * /api/options/{id}:
 *   get:
 *     summary: Get option by ID
 *     tags: [Options]
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
 *         description: Option found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Option not found
 */
router.get("/:id", optionsController.getOptionById);

/**
 * @swagger
 * /api/options/{id}:
 *   put:
 *     summary: Update option by ID
 *     tags: [Options]
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
 *         description: Option updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Option not found
 */
router.put("/:id", optionsController.updateOption);

/**
 * @swagger
 * /api/options/{id}:
 *   delete:
 *     summary: Delete option by ID
 *     tags: [Options]
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
 *         description: Option deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Option not found
 */
router.delete("/:id", optionsController.deleteOption);

export default router;