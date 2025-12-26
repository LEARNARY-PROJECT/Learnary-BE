import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { PayOSWebhookBody } from '../types/payos'; 

export const PaymentController = {
    // 1. API Tạo Link Thanh Toán
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
            // Trả về 400 nếu lỗi do logic (ví dụ: đã mua rồi), 500 nếu lỗi hệ thống
            return res.status(500).json({ error: err.message });
        }
    },

    // 2. API Nhận Webhook (Tự động)
    handleWebhook: async (req: Request, res: Response) => {

        try {
            // Ép kiểu req.body về PayOSWebhookBody
            const webhookBody = req.body as PayOSWebhookBody;

            if (!webhookBody || !webhookBody.data) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid Webhook Body" 
                });
            }
            const result = await PaymentService.processWebhook(webhookBody);
            // PayOS yêu cầu phản hồi nhanh, nếu không nó sẽ gửi lại nhiều lần
            return res.json({ success: true, message: "Webhook processed successfully" });
        } catch (error) {
            const err = error as Error;
            
            // Nếu lỗi chữ ký -> Trả về 400 để PayOS biết
            // Nếu lỗi DB -> Vẫn có thể trả về 200 (success: false) để tránh PayOS spam retry (Tùy chiến lược của bạn)
            return res.status(400).json({ success: false, message: err?.message || String(err) });
        }
    },
    // 3. API Hủy Thanh Toán
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

    // 4. API Tạo Link Thanh Toán Combo
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

    // 5. API kiểm tra trạng thái giao dịch
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
    }
};