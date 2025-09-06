import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/specialization.controller";

const router = express.Router();

/**
 * @openapi
 * /api/specializations:
 *   post:
 *     summary: Create a new specialization
 *     tags: [Specialization]
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
 *         description: Specialization created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/specializations", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/specializations:
 *   get:
 *     summary: Get all specializations
 *     tags: [Specialization]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of specializations
 *       401:
 *         description: Unauthorized
 */
router.get("/specializations", authenticate, authorizeRoles("ADMIN"), getAll);

/**
 * @openapi
 * /api/specializations/{id}:
 *   get:
 *     summary: Get specialization by ID
 *     tags: [Specialization]
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
 *         description: Specialization found
 *       404:
 *         description: Specialization not found
 *       401:
 *         description: Unauthorized
 */
router.get("/specializations/:id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/specializations/{id}:
 *   put:
 *     summary: Update specialization by ID
 *     tags: [Specialization]
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
 *         description: Specialization updated successfully
 *       404:
 *         description: Specialization not found
 *       401:
 *         description: Unauthorized
 */
router.put("/specializations/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/specializations/{id}:
 *   delete:
 *     summary: Delete specialization by ID
 *     tags: [Specialization]
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
 *         description: Specialization deleted successfully
 *       404:
 *         description: Specialization not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/specializations/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
