import { TransactionStatus, TransactionType, TransactionMethod, TransactionNote, Prisma, CourseEnrollmentStatus } from '../generated/prisma'; // Đảm bảo đường dẫn import đúng với setup của bạn
import prisma from '../lib/client';
import payOS from '../lib/payos';
import { CreatePaymentParams, PayOSWebhookBody, PayOSWebhookData } from '../types/payos';

export const PaymentService = {
    // 1. Hàm tạo Payment Link
    createPaymentLink: async (userId: string, courseId: string): Promise<string> => {
        
        // Kiểm tra khóa học
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
        console.log("\n🔧 [WEBHOOK SERVICE] Starting processWebhook...");
        console.log("📦 Webhook body data:", JSON.stringify(webhookBody.data, null, 2));

        try {
            // 1. Xác thực và lấy mã đơn
            console.log("🔐 [STEP 1] Verifying webhook signature...");
            const webhookData = await payOS.webhooks.verify(webhookBody);
            const orderCode = webhookData.orderCode;
            console.log("✅ Webhook verified successfully. OrderCode:", orderCode);
            console.log("📊 Webhook data:", JSON.stringify(webhookData, null, 2));

            console.log(`\n🔍 [STEP 2] Searching for transaction with payment_code: ${orderCode}...`);

            // 2. Mở Transaction
            await prisma.$transaction(async (tx) => {
                console.log("💾 [DB TRANSACTION] Started database transaction");
                
                // ⚠️ BƯỚC QUAN TRỌNG: Tìm xem đơn hàng có tồn tại không trước?
                const transaction = await tx.transaction.findUnique({
                    where: { payment_code: BigInt(orderCode) }
                });

                // Nếu KHÔNG tìm thấy (VD: do PayOS test fake data 123)
                if (!transaction) {
                    console.log(`❌ [DB TRANSACTION] Transaction NOT FOUND with payment_code: ${orderCode}`);
                    console.log("ℹ️  This might be a test webhook or duplicate. Skipping...");
                    return; // Dừng luôn, không làm gì cả, không báo lỗi
                }
                
                console.log(`✅ [DB TRANSACTION] Found transaction:`);
                console.log(`   - transaction_id: ${transaction.transaction_id}`);
                console.log(`   - user_id: ${transaction.user_id}`);
                console.log(`   - course_id: ${transaction.course_id}`);
                console.log(`   - current status: ${transaction.status}`);
                console.log(`   - amount: ${transaction.amount}`);

                // Nếu tìm thấy -> Thì mới Update
                console.log(`\n🔄 [STEP 3] Updating transaction status to Success...`);
                const updatedTrans = await tx.transaction.update({
                    where: { transaction_id: transaction.transaction_id }, // Update theo ID cho chắc
                    data: { status: TransactionStatus.Success }
                });
                console.log(`✅ Transaction status updated to: ${updatedTrans.status}`);

                // 2. Tìm thông tin học viên
                console.log(`\n👤 [STEP 4] Looking for learner with user_id: ${updatedTrans.user_id}...`);
                const learner = await tx.learner.findUnique({
                    where: { user_id: updatedTrans.user_id }
                });

                if (!learner) {
                    console.error(`❌ [CRITICAL] Learner NOT FOUND for user_id: ${updatedTrans.user_id}`);
                    console.error(`   This user might not have a learner record yet!`);
                    throw new Error(`Learner not found for user_id: ${updatedTrans.user_id}`);
                }
                
                console.log(`✅ Found learner:`);
                console.log(`   - learner_id: ${learner.learner_id}`);
                console.log(`   - user_id: ${learner.user_id}`);

                // Kiểm tra trùng lặp lần cuối
                console.log(`\n🔍 [STEP 5] Checking if learner already enrolled in course...`);
                const exists = await tx.learnerCourses.findUnique({
                    where: { 
                        learner_id_course_id: { 
                            learner_id: learner.learner_id, 
                            course_id: updatedTrans.course_id 
                        } 
                    }
                });
                
                if (exists) {
                    console.log(`⚠️  Learner already enrolled in this course. Skipping enrollment.`);
                    console.log(`   - Existing record:`, JSON.stringify(exists, null, 2));
                    return;
                }
                
                console.log(`✅ No existing enrollment found. Creating new learner_course record...`);

                // ⚠️ QUAN TRỌNG: Dùng 'tx.learnerCourses.create' thay vì hàm bên ngoài
                // Để đảm bảo nằm chung trong transaction
                const learnerCourse = await tx.learnerCourses.create({
                    data: {
                        learner_id: learner.learner_id,
                        course_id: updatedTrans.course_id,
                        status: CourseEnrollmentStatus.Enrolled,
                        progress: new Prisma.Decimal(0),
                        rating: 0,
                        feedback: '',
                        completedAt: new Date(),
                        enrolledAt: new Date()
                    }
                });
                
                console.log(`\n🎉 [SUCCESS] LearnerCourse created successfully!`);
                console.log(`   - learner_id: ${learnerCourse.learner_id}`);
                console.log(`   - course_id: ${learnerCourse.course_id}`);
                console.log(`   - status: ${learnerCourse.status}`);
                console.log(`   - enrolled_at: ${learnerCourse.enrolledAt}`);
            });
            console.log(`\n✅✅✅ [WEBHOOK SERVICE] processWebhook completed successfully!\n`);
            return webhookData;
        } catch (error) {
            const err = error as any;
            console.error(`\n❌❌❌ [WEBHOOK SERVICE ERROR] ❌❌❌`);
            console.error(`Error type: ${err?.constructor?.name || 'Unknown'}`);
            console.error(`Error message: ${err?.message || String(err)}`);
            console.error(`Error code: ${err?.code || 'N/A'}`);
            console.error(`Error stack:`, err?.stack || 'No stack trace');
            console.error(`❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌\n`);
            throw err;
        }
    },

    // 3. Hàm hủy thanh toán
    cancelPayment: async (orderCode: number): Promise<void> => {
        console.log(`🔍 Hủy đơn hàng: ${orderCode}`);

        const transaction = await prisma.transaction.findUnique({
            where: { payment_code: BigInt(orderCode) }
        });

        if (!transaction) {
            console.log(`❌ Không tìm thấy đơn hàng mã ${orderCode}`);
            throw new Error('Không tìm thấy giao dịch');
        }

        // Chỉ cập nhật nếu đang ở trạng thái Pending
        if (transaction.status === TransactionStatus.Pending) {
            await prisma.transaction.update({
                where: { transaction_id: transaction.transaction_id },
                data: { status: TransactionStatus.Cancel }
            });
            console.log(`✅ Đã cập nhật trạng thái hủy cho đơn hàng ${orderCode}`);
        } else {
            console.log(`⚠️ Đơn hàng ${orderCode} đã có trạng thái ${transaction.status}, không cập nhật`);
        }
    }
};
