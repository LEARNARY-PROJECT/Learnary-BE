import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { 
  create, 
  getAll, 
  getById, 
  update, 
  remove, 
  verifyUserEmail,
  sendOTP,
  sendVerificationLink,
  verifyWithToken,
  resendOTP
} from "../controllers/accountSecurity.controller";

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

/**
 * @openapi
 * /api/account-securities/send-otp:
 *   post:
 *     summary: Send OTP to user email for verification
 *     tags: [AccountSecurity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: User ID required or email already verified
 *       500:
 *         description: Failed to send OTP
 */
router.post("/account-securities/send-otp", authenticate, sendOTP);

/**
 * @openapi
 * /api/account-securities/resend-otp/{userId}:
 *   post:
 *     summary: Resend OTP to user email
 *     tags: [AccountSecurity]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to resend OTP
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: User ID required or email already verified
 *       500:
 *         description: Failed to resend OTP
 */
router.post("/account-securities/resend-otp/:userId",authenticate, resendOTP);

/**
 * @openapi
 * /api/account-securities/send-verification-link:
 *   post:
 *     summary: Send verification link to user email
 *     tags: [AccountSecurity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification link sent successfully
 *       400:
 *         description: User ID required or email already verified
 *       500:
 *         description: Failed to send verification link
 */
router.post("/account-securities/send-verification-link", authenticate, sendVerificationLink);

/**
 * @openapi
 * /api/account-securities/verify-with-token:
 *   post:
 *     summary: Verify email with OTP or token
 *     tags: [AccountSecurity]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: OTP code or verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Failed to verify email
 */
router.post("/account-securities/verify-with-token", authenticate, verifyWithToken);

/**
 * @openapi
 * /api/account-securities/verify-email/{userId}:
 *   post:
 *     summary: Verify user email (legacy endpoint)
 *     tags: [AccountSecurity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: User ID required
 *       404:
 *         description: User not found
 *       500:
 *         description: Email already verified or other error
 */
router.post("/account-securities/verify-email/:userId", authenticate, verifyUserEmail);

export default router;
