import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { PayOSWebhookBody } from '../types/payos'; 

export const PaymentController = {
    // API Tạo Link Thanh Toán
    createPaymentLink: async (req: Request, res: Response) => {
        try {
            const { userId, courseId } = req.body as { userId: string, courseId: string };
            if (!userId || !courseId) {
                return res.status(400).json({ 
                    error: "Thiếu thông tin userId hoặc courseId" 
                });
            }
            const { qrCode, orderCode, amount } = await PaymentService.createPaymentLink(userId, courseId);

            return res.json({ qrCode, orderCode, amount });

        } catch (error) {
            const err = error as Error;
            return res.status(500).json({ error: err.message });
        }
    },
    //API Xử lý Webhook từ PayOS
    handleWebhook: async (req: Request, res: Response) => {

        try {
            const webhookBody = req.body as PayOSWebhookBody;

            if (!webhookBody || !webhookBody.data) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid Webhook Body" 
                });
            }
            const result = await PaymentService.processWebhook(webhookBody);
            return res.json({ success: true, message: "Webhook processed successfully" });
        } catch (error) {
            const err = error as Error;
            return res.status(400).json({ success: false, message: err?.message || String(err) });
        }
    },
    // API Hủy Thanh Toán
    cancelPayment: async (req: Request, res: Response) => {
        try {
            const { orderCode } = req.body as { orderCode: string };
            if (!orderCode) {
                return res.status(400).json({ 
                    error: "Thiếu mã đơn hàng (orderCode)" 
                });
            }
            await PaymentService.cancelPayment(Number(orderCode));
            return res.json({ 
                success: true, 
                message: "Đã hủy giao dịch thành công" 
            });

        } catch (error) {
            const err = error as Error;
            return res.status(500).json({ error: err.message });
        }
    },

    createComboPaymentLink: async (req: Request, res: Response) => {
        try {
            const { userId, groupId } = req.body as { userId: string, groupId: string };
            if (!userId || !groupId) {
                return res.status(400).json({ 
                    error: "Thiếu thông tin userId hoặc groupId" 
                });
            }
            const { qrCode, orderCode, amount } = await PaymentService.createComboPaymentLink(userId, groupId);

            return res.json({ qrCode, orderCode, amount });

        } catch (error) {
            const err = error as Error;
            console.error("Error creating combo payment link:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

    getPaymentStatus: async (req: Request, res: Response) => {
        try {
            const orderCode = req.query.orderCode;
            if (!orderCode) {
                return res.status(400).json({ error: "Thiếu orderCode" });
            }
            const transaction = await require('../lib/client').default.transaction.findUnique({
                where: { payment_code: BigInt(orderCode as string) }
            });
            if (!transaction) {
                return res.status(404).json({ error: "Không tìm thấy giao dịch" });
            }
            return res.json({ status: transaction.status });
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    },

    getLearnerTransactionHistory: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({ 
                    error: "Thiếu userId" 
                });
            }
            const result = await PaymentService.getLearnerTransactionHistory(userId);
            return res.json({ 
                success: true,
                data: result
            });
        } catch (error) {
            const err = error as Error;
            console.error("Error getting learner transaction history:", err.message);
            return res.status(500).json({ 
                success: false,
                error: err.message 
            });
        }
    }
};