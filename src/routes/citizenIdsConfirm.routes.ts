import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/citizenIdsConfirm.controller";

const router = express.Router();

/**
 * @openapi
 * /api/citizen-ids-confirms:
 *   post:
 *     summary: Create a new citizen ids confirm
 *     tags: [CitizenIdsConfirm]
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
 *         description: CitizenIdsConfirm created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/citizen-ids-confirms", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/citizen-ids-confirms:
 *   get:
 *     summary: Get all citizen ids confirms
 *     tags: [CitizenIdsConfirm]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of citizen ids confirms
 *       401:
 *         description: Unauthorized
 */
router.get("/citizen-ids-confirms", authenticate, authorizeRoles("ADMIN"), getAll);

/**
 * @openapi
 * /api/citizen-ids-confirms/{id}:
 *   get:
 *     summary: Get citizen ids confirm by ID
 *     tags: [CitizenIdsConfirm]
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
 *         description: CitizenIdsConfirm found
 *       404:
 *         description: CitizenIdsConfirm not found
 *       401:
 *         description: Unauthorized
 */
router.get("/citizen-ids-confirms/:id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/citizen-ids-confirms/{id}:
 *   put:
 *     summary: Update citizen ids confirm by ID
 *     tags: [CitizenIdsConfirm]
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
 *         description: CitizenIdsConfirm updated successfully
 *       404:
 *         description: CitizenIdsConfirm not found
 *       401:
 *         description: Unauthorized
 */
router.put("/citizen-ids-confirms/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/citizen-ids-confirms/{id}:
 *   delete:
 *     summary: Delete citizen ids confirm by ID
 *     tags: [CitizenIdsConfirm]
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
 *         description: CitizenIdsConfirm deleted successfully
 *       404:
 *         description: CitizenIdsConfirm not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/citizen-ids-confirms/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
