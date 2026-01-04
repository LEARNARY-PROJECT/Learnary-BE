    import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { PaymentController } from "../controllers/payment.controller";

const router = express.Router();

/**
 * @openapi
 * /api/payment/create-link:
 *   post:
 *     summary: Create a PayOS payment link
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - courseId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user buying the course
 *               courseId:
 *                 type: string
 *                 description: ID of the course
 *     responses:
 *       200:
 *         description: Payment link created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checkoutUrl:
 *                   type: string
 *                   description: URL to redirect user to PayOS
 *       400:
 *         description: Invalid input or missing fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course or User not found
 *       500:
 *         description: Internal Server Error
 */
// Webhook route - MUST be defined BEFORE any middleware that requires auth


router.post(
  '/payment/create-link', 
  // authenticate, 
  // authorizeRoles("LEARNER", "ADMIN"), // Chỉ Learner hoặc Admin mới được tạo link mua
  PaymentController.createPaymentLink
);
router.post(
  '/payment/webhook', 
  PaymentController.handleWebhook
);

/**
 * @openapi
 * /api/payment/cancel:
 *   post:
 *     summary: Cancel a payment transaction
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderCode
 *             properties:
 *               orderCode:
 *                 type: string
 *                 description: Order code from PayOS
 *     responses:
 *       200:
 *         description: Payment cancelled successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post(
  '/payment/cancel',
  PaymentController.cancelPayment
);

/**
 * @openapi
 * /api/payment/create-combo-link:
 *   post:
 *     summary: Create a PayOS payment link for combo/group
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - groupId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user buying the combo
 *               groupId:
 *                 type: string
 *                 description: ID of the combo/group
 *     responses:
 *       200:
 *         description: Combo payment link created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checkoutUrl:
 *                   type: string
 *                   description: URL to redirect user to PayOS
 *       400:
 *         description: Invalid input or missing fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Combo or User not found
 *       500:
 *         description: Internal Server Error
 */
router.post(
  '/payment/create-combo-link',
  // authenticate,
  // authorizeRoles("LEARNER", "ADMIN"),
  PaymentController.createComboPaymentLink
);

/**
 * @openapi
 * /api/payment/status:
 *   get:
 *     summary: Get payment transaction status
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: orderCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Order code from PayOS
 *     responses:
 *       200:
 *         description: Payment status returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Transaction status
 *       400:
 *         description: Missing orderCode
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/payment/status', PaymentController.getPaymentStatus);

/**
 * @openapi
 * /api/payment/learner-history/{userId}:
 *   get:
 *     summary: Get learner transaction history
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the learner
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         fullName:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalTransactions:
 *                           type: number
 *                         successfulTransactions:
 *                           type: number
 *                         pendingTransactions:
 *                           type: number
 *                         cancelledTransactions:
 *                           type: number
 *                         totalSpent:
 *                           type: number
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Missing userId
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/payment/learner-history/:userId',
  authenticate,
  authorizeRoles("LEARNER", "ADMIN", "INSTRUCTOR"),
  PaymentController.getLearnerTransactionHistory
);

export default router;