import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/adminRole.controller";

const router = express.Router();

/**
 * @openapi
 * /api/admin-roles:
 *   post:
 *     summary: Create a new admin role
 *     tags: [AdminRole]
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
 *         description: AdminRole created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/admin-roles", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/admin-roles:
 *   get:
 *     summary: Get all admin roles
 *     tags: [AdminRole]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admin roles
 *       401:
 *         description: Unauthorized
 */
router.get("/admin-roles", authenticate, authorizeRoles("ADMIN"), getAll);

/**
 * @openapi
 * /api/admin-roles/{id}:
 *   get:
 *     summary: Get admin role by ID
 *     tags: [AdminRole]
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
 *         description: AdminRole found
 *       404:
 *         description: AdminRole not found
 *       401:
 *         description: Unauthorized
 */
router.get("/admin-roles/:id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/admin-roles/{id}:
 *   put:
 *     summary: Update admin role by ID
 *     tags: [AdminRole]
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
 *         description: AdminRole updated successfully
 *       404:
 *         description: AdminRole not found
 *       401:
 *         description: Unauthorized
 */
router.put("/admin-roles/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/admin-roles/{id}:
 *   delete:
 *     summary: Delete admin role by ID
 *     tags: [AdminRole]
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
 *         description: AdminRole deleted successfully
 *       404:
 *         description: AdminRole not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/admin-roles/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
