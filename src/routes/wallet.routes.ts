import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/wallet.controller";

const router = express.Router();

/**
 * @openapi
 * /api/wallets:
 *   post:
 *     summary: Create a new wallet
 *     tags: [Wallet]
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
 *         description: Wallet created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/wallets", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/wallets:
 *   get:
 *     summary: Get all wallets
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wallets
 *       401:
 *         description: Unauthorized
 */
router.get("/wallets", authenticate, authorizeRoles("ADMIN"), getAll);

/**
 * @openapi
 * /api/wallets/{id}:
 *   get:
 *     summary: Get wallet by ID
 *     tags: [Wallet]
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
 *         description: Wallet found
 *       404:
 *         description: Wallet not found
 *       401:
 *         description: Unauthorized
 */
router.get("/wallets/:id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/wallets/{id}:
 *   put:
 *     summary: Update wallet by ID
 *     tags: [Wallet]
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
 *         description: Wallet updated successfully
 *       404:
 *         description: Wallet not found
 *       401:
 *         description: Unauthorized
 */
router.put("/wallets/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/wallets/{id}:
 *   delete:
 *     summary: Delete wallet by ID
 *     tags: [Wallet]
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
 *         description: Wallet deleted successfully
 *       404:
 *         description: Wallet not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/wallets/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
