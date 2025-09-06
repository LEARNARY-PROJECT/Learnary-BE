import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/permission.controller";

const router = express.Router();

/**
 * @openapi
 * /api/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permission]
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
 *         description: Permission created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/permissions", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permission]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions
 *       401:
 *         description: Unauthorized
 */
router.get("/permissions", authenticate, authorizeRoles("ADMIN"), getAll);

/**
 * @openapi
 * /api/permissions/{id}:
 *   get:
 *     summary: Get permission by ID
 *     tags: [Permission]
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
 *         description: Permission found
 *       404:
 *         description: Permission not found
 *       401:
 *         description: Unauthorized
 */
router.get("/permissions/:id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/permissions/{id}:
 *   put:
 *     summary: Update permission by ID
 *     tags: [Permission]
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
 *         description: Permission updated successfully
 *       404:
 *         description: Permission not found
 *       401:
 *         description: Unauthorized
 */
router.put("/permissions/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/permissions/{id}:
 *   delete:
 *     summary: Delete permission by ID
 *     tags: [Permission]
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
 *         description: Permission deleted successfully
 *       404:
 *         description: Permission not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/permissions/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
