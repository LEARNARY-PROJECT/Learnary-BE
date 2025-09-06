import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove } from "../controllers/accountSecurity.controller";

const router = express.Router();

/**
 * @openapi
 * /api/account-securities:
 *   post:
 *     summary: Create a new account security
 *     tags: [AccountSecurity]
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
 *         description: AccountSecurity created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/account-securities", authenticate, authorizeRoles("ADMIN"), create);

/**
 * @openapi
 * /api/account-securities:
 *   get:
 *     summary: Get all account securities
 *     tags: [AccountSecurity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of account securities
 *       401:
 *         description: Unauthorized
 */
router.get("/account-securities", authenticate, authorizeRoles("ADMIN"), getAll);

/**
 * @openapi
 * /api/account-securities/{id}:
 *   get:
 *     summary: Get account security by ID
 *     tags: [AccountSecurity]
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
 *         description: AccountSecurity found
 *       404:
 *         description: AccountSecurity not found
 *       401:
 *         description: Unauthorized
 */
router.get("/account-securities/:id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/account-securities/{id}:
 *   put:
 *     summary: Update account security by ID
 *     tags: [AccountSecurity]
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
 *         description: AccountSecurity updated successfully
 *       404:
 *         description: AccountSecurity not found
 *       401:
 *         description: Unauthorized
 */
router.put("/account-securities/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/account-securities/{id}:
 *   delete:
 *     summary: Delete account security by ID
 *     tags: [AccountSecurity]
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
 *         description: AccountSecurity deleted successfully
 *       404:
 *         description: AccountSecurity not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/account-securities/:id", authenticate, authorizeRoles("ADMIN"), remove);

export default router;
