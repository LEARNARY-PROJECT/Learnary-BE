import { TransactionStatus, TransactionType, TransactionMethod, TransactionNote, Prisma, CourseEnrollmentStatus } from '../generated/prisma'; // Đảm bảo đường dẫn import đúng với setup của bạn
import prisma from '../lib/client';
import payOS from '../lib/payos';
import { CreatePaymentParams, PayOSWebhookBody, PayOSWebhookData } from '../types/payos';

export const PaymentService = {
    createPaymentLink: async (userId: string, courseId: string): Promise<string> => {
        const course = await prisma.course.findUnique({ where: { course_id: courseId } });
        if (!course) throw new Error("Khóa học không tồn tại");

        // PayOS yêu cầu orderCode là number (nhỏ hơn 9 triệu tỷ)
        const orderCode = Number(String(Date.now()).slice(-6)); 

        // Kiểm tra xem user đã mua chưa
        const learner = await prisma.learner.findUnique({ where: { user_id: userId } });
        
        if (learner) {
            const alreadyEnrolled = await prisma.learnerCourses.findUnique({
                where: {
                    learner_id_course_id: {
                        learner_id: learner.learner_id,
                        course_id: courseId
                    }
                }
            });

            if (alreadyEnrolled) {
                throw new Error("Bạn đã sở hữu khóa học này rồi, không cần mua lại!");
            }
        }

        // Lấy wallet (nếu có)
        const wallet = await prisma.wallet.findUnique({ where: { user_id: userId } });

        // Tạo Transaction trong DB (Trạng thái Pending)
        await prisma.transaction.create({
            data: {
                user_id: userId,
                course_id: courseId,
                wallet_id: wallet?.wallet_id || null,
                amount: course.price,
                currency: 'VND' ,
                payment_method: TransactionMethod.Bank_Transfer,
                transaction_type: TransactionType.Pay,
                status: TransactionStatus.Pending,
                note: TransactionNote.User_Pay,
                payment_code: BigInt(orderCode)
            }
        });

        // Tạo body gửi sang PayOS
        const paymentBody: CreatePaymentParams = {
            orderCode: orderCode,
            amount: Number(course.price),
            description: "Thanh toan khoa hoc",
            // Lưu ý: Đảm bảo biến môi trường FRONTEND_URL không có dấu / ở cuối
            cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel`,
            returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`
        };

        // Gọi PayOS
        const response = await payOS.paymentRequests.create(paymentBody);
        
        return response.checkoutUrl; 
    },

    // 2. Hàm xử lý Webhook
    processWebhook: async (webhookBody: PayOSWebhookBody): Promise<PayOSWebhookData> => {
    
    // 1. Xác thực và lấy mã đơn
    const webhookData = await payOS.webhooks.verify(webhookBody);
    const orderCode = webhookData.orderCode;

    // 2. Mở Transaction
    await prisma.$transaction(async (tx) => {
        
        // ⚠️ BƯỚC QUAN TRỌNG: Tìm xem đơn hàng có tồn tại không trước?
        const transaction = await tx.transaction.findUnique({
            where: { payment_code: BigInt(orderCode) }
        });

        // Nếu KHÔNG tìm thấy (VD: do PayOS test fake data 123)
        if (!transaction) {
            return; // Dừng luôn, không làm gì cả, không báo lỗi
        }

        // Nếu tìm thấy -> Thì mới Update
        const updatedTrans = await tx.transaction.update({
            where: { transaction_id: transaction.transaction_id }, // Update theo ID cho chắc
            data: { status: TransactionStatus.Success }
        });

            // 2. Tìm thông tin học viên
            const learner = await tx.learner.findUnique({
                where: { user_id: updatedTrans.user_id }
            });

            if (learner) {
                // Kiểm tra trùng lặp lần cuối
                const exists = await tx.learnerCourses.findUnique({
                    where: { 
                        learner_id_course_id: { 
                            learner_id: learner.learner_id, 
                            course_id: updatedTrans.course_id 
                        } 
                    }
                });

                if (!exists) {
                    // ⚠️ QUAN TRỌNG: Dùng 'tx.learnerCourses.create' thay vì hàm bên ngoài
                    // Để đảm bảo nằm chung trong transaction
                    const enrolled = await tx.learnerCourses.create({
                        data: {
                            learner_id: learner.learner_id,
                            course_id: updatedTrans.course_id,
                            status: CourseEnrollmentStatus.Enrolled,
                            progress: new Prisma.Decimal(0),
                            rating: 0,
                            feedback: '',
                            completedAt: new Date(0), // Hoặc null
                            enrolledAt: new Date()
                        }
                    });
                }
            }
        });

        return webhookData;
    },

    // 3. Hàm hủy thanh toán
    cancelPayment: async (orderCode: number): Promise<void> => {
        const transaction = await prisma.transaction.findUnique({
            where: { payment_code: BigInt(orderCode) }
        });

        if (!transaction) {
            throw new Error('Không tìm thấy giao dịch');
        }

        // Chỉ cập nhật nếu đang ở trạng thái Pending
        if (transaction.status === TransactionStatus.Pending) {
            await prisma.transaction.update({
                where: { transaction_id: transaction.transaction_id },
                data: { status: TransactionStatus.Cancel }
            });
        }
    }
};
