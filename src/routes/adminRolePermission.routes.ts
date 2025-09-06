import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/adminRolePermission.controller";

const router = express.Router();

/**
 * @openapi
 * /api/admin-role-permissions:
 *   post:
 *     summary: Create a new admin role permission
 *     tags: [AdminRolePermission]
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
 *         description: AdminRolePermission created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/admin-role-permissions", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/admin-role-permissions:
 *   get:
 *     summary: Get all admin role permissions
 *     tags: [AdminRolePermission]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admin role permissions
 *       401:
 *         description: Unauthorized
 */
router.get("/admin-role-permissions", authenticate, authorizeRoles("ADMIN"), getAll);

/**
 * @openapi
 * /api/admin-role-permissions/{permission_id}/{admin_role_id}:
 *   get:
 *     summary: Get admin role permission by IDs
 *     tags: [AdminRolePermission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: permission_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: admin_role_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: AdminRolePermission found
 *       404:
 *         description: AdminRolePermission not found
 *       401:
 *         description: Unauthorized
 */
router.get("/admin-role-permissions/:permission_id/:admin_role_id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/admin-role-permissions/{permission_id}/{admin_role_id}:
 *   put:
 *     summary: Update admin role permission by IDs
 *     tags: [AdminRolePermission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: permission_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: admin_role_id
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
 *         description: AdminRolePermission updated successfully
 *       404:
 *         description: AdminRolePermission not found
 *       401:
 *         description: Unauthorized
 */
router.put("/admin-role-permissions/:permission_id/:admin_role_id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/admin-role-permissions/{permission_id}/{admin_role_id}:
 *   delete:
 *     summary: Delete admin role permission by IDs
 *     tags: [AdminRolePermission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: permission_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: admin_role_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: AdminRolePermission deleted successfully
 *       404:
 *         description: AdminRolePermission not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/admin-role-permissions/:permission_id/:admin_role_id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
