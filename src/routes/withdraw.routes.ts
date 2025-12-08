import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { WithdrawController } from "../controllers/withdraw.controller";

const router = express.Router();

/**
 * @openapi
 * /api/withdraw/request:
 *   post:
 *     summary: Giảng viên tạo yêu cầu rút tiền
 *     tags: [Withdraw]
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
 *               - amount
 *               - note
 *             properties:
 *               userId:
 *                 type: string
 *               amount:
 *                 type: number
 *               note:
 *                 type: string
 *                 description: Số tài khoản ngân hàng, tên ngân hàng...
 */
router.post(
    '/withdraw/request',
    authenticate,
    authorizeRoles("INSTRUCTOR"), // Chỉ Giảng viên mới được rút
    WithdrawController.createRequest
);

/**
 * @openapi
 * /api/withdraw/approve:
 *   post:
 *     summary: Admin duyệt hoặc từ chối yêu cầu rút tiền
 *     tags: [Withdraw]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adminId
 *               - requestId
 *               - action
 *               - note
 *             properties:
 *               adminId:
 *                 type: string
 *               requestId:
 *                 type: string
 *               action:
 *                 type: string
 *                 enum: [APPROVE, REJECT]
 *               note:
 *                 type: string
 */
router.post(
    '/withdraw/approve',
    authenticate,
    authorizeRoles("ADMIN"), // Chỉ Admin mới được duyệt
    WithdrawController.approveRequest
);

router.get(
    '/wallet/info', 
    // authenticate, 
    WithdrawController.getWallet // Đảm bảo Controller có hàm này
);

/**
 * @openapi
 * /api/transactions:
 *   get:
 *     summary: Admin lấy tất cả giao dịch
 *     tags: [Admin, Transactions]
 *     security:
 *       - bearerAuth: []
 */
router.get(
    '/transactions',
    authenticate,
    authorizeRoles("ADMIN"),
    WithdrawController.getAllTransactions
);

/**
 * @openapi
 * /api/withdraw/requests:
 *   get:
 *     summary: Admin lấy danh sách withdraw requests
 *     tags: [Admin, Withdraw]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Success, Rejected]
 *         description: Filter by status (optional)
 */
router.get(
    '/withdraw/requests',
    authenticate,
    authorizeRoles("ADMIN"),
    WithdrawController.getWithdrawRequests
);

export default router;