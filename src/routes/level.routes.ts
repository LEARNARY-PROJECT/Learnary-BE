import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/level.controller";

const router = express.Router();

/**
 * @openapi
 * /api/levels:
 *   post:
 *     summary: Create a new level
 *     tags: [Level]
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
 *         description: Level created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/levels", authenticate, authorizeRoles("ADMIN","LEARNER","INSTRUCTOR"), create);

/**
 * @openapi
 * /api/levels:
 *   get:
 *     summary: Get all levels
 *     tags: [Level]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of levels
 *       401:
 *         description: Unauthorized
 */
router.get("/levels", authenticate, authorizeRoles("ADMIN", "LEARNER","INSTRUCTOR"), getAll);

/**
 * @openapi
 * /api/levels/{id}:
 *   get:
 *     summary: Get level by ID
 *     tags: [Level]
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
 *         description: Level found
 *       404:
 *         description: Level not found
 *       401:
 *         description: Unauthorized
 */
router.get("/levels/:id", authenticate, authorizeRoles("ADMIN", "LEARNER","INSTRUCTOR"), getById);

/**
 * @openapi
 * /api/levels/{id}:
 *   put:
 *     summary: Update level by ID
 *     tags: [Level]
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
 *         description: Level updated successfully
 *       404:
 *         description: Level not found
 *       401:
 *         description: Unauthorized
 */
router.put("/levels/update/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/levels/{id}:
 *   delete:
 *     summary: Delete level by ID
 *     tags: [Level]
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
 *         description: Level deleted successfully
 *       404:
 *         description: Level not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/levels/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
