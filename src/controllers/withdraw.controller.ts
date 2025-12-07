import { Request, Response } from 'express';
import { WithdrawService } from '../services/withdraw.service';

export const WithdrawController = {
    // 1. Tạo yêu cầu rút
    createRequest: async (req: Request, res: Response) => {
        try {
            const { userId, amount, note } = req.body; 
            const result = await WithdrawService.createWithdrawRequest(userId, Number(amount), note);
            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error occurred' });
            }
        }
    },

    // 2. Admin duyệt
    approveRequest: async (req: Request, res: Response) => {
        try {
            const { adminId, requestId, action, note } = req.body; 
            const result = await WithdrawService.processWithdrawRequest(adminId, requestId, action, note);
            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error occurred' });
            }
        }
    },

    // 3. Lấy thông tin ví (Hàm mới thêm bị lỗi đỏ)
    getWallet: async (req: Request, res: Response) => {
        try {
            const userId = req.query.userId as string; 
            
            if (!userId) {
                return res.status(400).json({ error: "Missing userId query param" });
            }

            const wallet = await WithdrawService.getWalletBalance(userId);
            
            const response = {
                ...wallet,
                balance: Number(wallet.balance),
                transactions: wallet.transactions?.map(t => ({
                    ...t,
                    amount: Number(t.amount),
                    payment_code: t.payment_code ? t.payment_code.toString() : null // Convert BigInt to string
                }))
            };
            
            res.json(response);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`❌ [getWallet] Error:`, error.message);
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Unknown error occurred' });
            }
        }
    },

    // 4. Admin - Lấy tất cả giao dịch
    getAllTransactions: async (req: Request, res: Response) => {
        try {
            const transactions = await WithdrawService.getAllTransactions();
            
            const response = transactions.map(t => ({
                ...t,
                amount: Number(t.amount),
                payment_code: t.payment_code ? t.payment_code.toString() : null
            }));
            
            res.json({ data: response });
        } catch (error) {
            if (error instanceof Error) {
                console.error(`❌ [getAllTransactions] Error:`, error.message);
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Unknown error occurred' });
            }
        }
    },

    // 5. Admin - Lấy danh sách withdraw requests
    getWithdrawRequests: async (req: Request, res: Response) => {
        try {
            const status = req.query.status as string | undefined;
            const requests = await WithdrawService.getWithdrawRequests(status as 'Pending' | 'Success' | 'Rejected' | undefined);
            const response = requests.map(r => ({
                ...r,
                balance: Number(r.balance)
            }));
            
            res.json({ data: response });
        } catch (error) {
            if (error instanceof Error) {
                console.error(`❌ [getWithdrawRequests] Error:`, error.message);
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Unknown error occurred' });
            }
        }
    }
};