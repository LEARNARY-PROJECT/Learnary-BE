import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/admin.controller";

const router = express.Router();

/**
 * @openapi
 * /api/admins:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
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
 *         description: Admin created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/admins", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admins
 *       401:
 *         description: Unauthorized
 */
router.get("/admins", authenticate, authorizeRoles("ADMIN"), getAll);


/**
 * @openapi
 * /api/admins/{id}:
 *   get:
 *     summary: Get admin by ID
 *     tags: [Admin]
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
 *         description: Admin found
 *       404:
 *         description: Admin not found
 *       401:
 *         description: Unauthorized
 */
router.get("/admins/:id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/admins/{id}:
 *   put:
 *     summary: Update admin by ID
 *     tags: [Admin]
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
 *         description: Admin updated successfully
 *       404:
 *         description: Admin not found
 *       401:
 *         description: Unauthorized
 */
router.put("/admins/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/admins/{id}:
 *   delete:
 *     summary: Delete admin by ID
 *     tags: [Admin]
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
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/admins/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
