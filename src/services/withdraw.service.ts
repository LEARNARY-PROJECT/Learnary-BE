import { Prisma, WithdrawStatus, TransactionStatus, TransactionType, TransactionMethod, TransactionNote } from '../generated/prisma'; 
import prisma from '../lib/client';

export const WithdrawService = {
    
    // =========================================================
    // 1. GIẢNG VIÊN TẠO LỆNH RÚT TIỀN
    // =========================================================
    createWithdrawRequest: async (userId: string, amount: number, userNote: string) => {
        
        return await prisma.$transaction(async (tx) => {
            // A. Kiểm tra ví
            const wallet = await tx.wallet.findUnique({ where: { user_id: userId } });
            if (!wallet) throw new Error("Ví không tồn tại");
            
            const currentBalance = Number(wallet.balance);
            if (currentBalance < amount) throw new Error("Số dư không đủ");
            if (amount < 5000) throw new Error("Tối thiểu rút 50.000đ");

            // B. Trừ tiền ví ngay lập tức (Tạm giữ)
            await tx.wallet.update({
                where: { wallet_id: wallet.wallet_id },
                data: { balance: { decrement: amount } }
            });

            // C. Lấy 1 Admin mặc định để gán (Do schema bắt buộc admin_id)
            const defaultAdmin = await tx.admin.findFirst(); 
            const adminIdToAssign = defaultAdmin ? defaultAdmin.admin_id : "system-fallback-id"; 

            // D. Tạo lệnh rút tiền
            const request = await tx.withdrawRequest.create({
                data: {
                    user_id: userId,
                    admin_id: adminIdToAssign, 
                    balance: new Prisma.Decimal(amount), 
                    status: WithdrawStatus.Pending,
                    note: userNote 
                }
            });

            // E. Tạo Transaction lưu lịch sử
            await tx.transaction.create({
                data: {
                    user_id: userId,
                    wallet_id: wallet.wallet_id,
                    course_id: null, // Fake ID vì schema bắt buộc
                    amount: new Prisma.Decimal(amount),
                    currency: 'VND',
                    transaction_type: TransactionType.Withdraw, 
                    payment_method: TransactionMethod.Bank_Transfer,
                    status: TransactionStatus.Pending, 
                    note: TransactionNote.User_Pay, 
                    description: `Yêu cầu rút tiền #${request.withdraw_request_id}`,
                    payment_code: BigInt(Date.now()) 
                }
            });

            return request;
        });
    },

    // =========================================================
    // 2. ADMIN DUYỆT / TỪ CHỐI
    // =========================================================
    processWithdrawRequest: async (adminId: string, requestId: string, action: 'APPROVE' | 'REJECT', adminNote: string) => {
        
        return await prisma.$transaction(async (tx) => {
            const request = await tx.withdrawRequest.findUnique({
                where: { withdraw_request_id: requestId }
            });

            if (!request || request.status !== WithdrawStatus.Pending) {
                throw new Error("Yêu cầu không hợp lệ");
            }

            const amount = Number(request.balance);

            if (action === 'APPROVE') {
                // --- DUYỆT ---
                await tx.withdrawRequest.update({
                    where: { withdraw_request_id: requestId },
                    data: {
                        status: WithdrawStatus.Success,
                        note: `${request.note} | Admin Note: ${adminNote} (Đã chuyển khoản)`
                    }
                });

                // Cập nhật Transaction status thành Success
                await tx.transaction.updateMany({
                    where: {
                        user_id: request.user_id,
                        transaction_type: TransactionType.Withdraw,
                        description: `Yêu cầu rút tiền #${requestId}`,
                        status: TransactionStatus.Pending
                    },
                    data: {
                        status: TransactionStatus.Success
                    }
                });
            } else {
                // --- TỪ CHỐI (HOÀN TIỀN) ---
                await tx.withdrawRequest.update({
                    where: { withdraw_request_id: requestId },
                    data: {
                        status: WithdrawStatus.Rejected,
                        note: `${request.note} | Lý do từ chối: ${adminNote}`
                    }
                });

                // Lấy wallet của GV
                const wallet = await tx.wallet.findUnique({
                    where: { user_id: request.user_id }
                });

                if (!wallet) {
                    throw new Error("Không tìm thấy ví giảng viên");
                }

                // Hoàn tiền lại vào Ví GV
                await tx.wallet.update({
                    where: { user_id: request.user_id },
                    data: { balance: { increment: amount } }
                });

                // Cập nhật Transaction Withdraw cũ thành Cancel
                await tx.transaction.updateMany({
                    where: {
                        user_id: request.user_id,
                        transaction_type: TransactionType.Withdraw,
                        description: `Yêu cầu rút tiền #${requestId}`,
                        status: TransactionStatus.Pending
                    },
                    data: {
                        status: TransactionStatus.Cancel
                    }
                });

                // Tạo Transaction mới với type Refund
                await tx.transaction.create({
                    data: {
                        user_id: request.user_id,
                        wallet_id: wallet.wallet_id,
                        course_id: null,
                        amount: new Prisma.Decimal(amount),
                        currency: 'VND',
                        transaction_type: TransactionType.Refund,
                        payment_method: TransactionMethod.Bank_Transfer,
                        status: TransactionStatus.Refund,
                        note: TransactionNote.Pay_For_Instructor,
                        description: adminNote, // Ghi chú của admin
                        payment_code: BigInt(Date.now())
                    }
                });
            }

            return { success: true };
        });
    },

    // =========================================================
    // 3. LẤY THÔNG TIN VÍ VÀ GIAO DỊCH
    // =========================================================
    getWalletBalance: async (userId: string) => {
        // Tìm hoặc tạo ví
        let wallet = await prisma.wallet.findUnique({
            where: { user_id: userId }
        });

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    user_id: userId,
                    balance: new Prisma.Decimal(0)
                }
            });
        }

        // Query RIÊNG transactions theo user_id (không dùng include)
        const transactions = await prisma.transaction.findMany({
            where: { user_id: userId },
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
                course: {
                    select: {
                        course_id: true,
                        title: true
                    }
                },
                user: {
                    select: {
                        user_id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });

        return {
            ...wallet,
            transactions
        };
    },

    // =========================================================
    // 4. ADMIN - LẤY TẤT CẢ GIAO DỊCH
    // =========================================================
    getAllTransactions: async () => {
        const transactions = await prisma.transaction.findMany({
            take: 200,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        user_id: true,
                        fullName: true,
                        email: true
                    }
                },
                course: {
                    select: {
                        course_id: true,
                        title: true
                    }
                }
            }
        });

        return transactions;
    },

    // =========================================================
    // 5. ADMIN - LẤY TẤT CẢ YÊU CẦU RÚT TIỀN THEO STATUS
    // =========================================================
    getWithdrawRequests: async (status?: WithdrawStatus) => {
        const where = status ? { status } : {};
        
        const requests = await prisma.withdrawRequest.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        // Manually fetch user data for each request
        const requestsWithUser = await Promise.all(
            requests.map(async (req) => {
                const user = await prisma.user.findUnique({
                    where: { user_id: req.user_id },
                    select: {
                        user_id: true,
                        fullName: true,
                        email: true,
                        phone: true
                    }
                });

                return {
                    ...req,
                    belongUser: user
                };
            })
        );
        return requestsWithUser;
    }
};