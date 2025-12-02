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

export default router;