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

        // Tạo Transaction trong DB (Trạng thái Pending)
        // Học viên thanh toán KHÔNG cần wallet, chỉ lưu lịch sử giao dịch
        await prisma.transaction.create({
            data: {
                user_id: userId,
                course_id: courseId,
                wallet_id: null, // Học viên không có ví
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
    
        console.log("🔔 Webhook nhận được:", JSON.stringify(webhookBody, null, 2));
        
        // 1. Xác thực và lấy mã đơn
        const webhookData = await payOS.webhooks.verify(webhookBody);
        const orderCode = webhookData.orderCode;

        console.log(`🔍 Đang tìm đơn hàng: ${orderCode} trong Database...`);

        // 2. Mở Transaction
        await prisma.$transaction(async (tx) => {
            
                // ⚠️ BƯỚC QUAN TRỌNG: Tìm xem đơn hàng có tồn tại không trước?
                const transaction = await tx.transaction.findUnique({
                    where: { payment_code: BigInt(orderCode) },
                    include: { course: true  }
                });

                // Nếu KHÔNG tìm thấy (VD: do PayOS test fake data 123)
                if (!transaction) {
                    console.log(`❌ Không tìm thấy đơn hàng mã ${orderCode}. Bỏ qua cập nhật.`);
                    return; // Dừng luôn, không làm gì cả, không báo lỗi
                }

                console.log(`✅ Tìm thấy transaction:`, transaction);

                // Nếu tìm thấy -> Thì mới Update
                const updatedTrans = await tx.transaction.update({
                    where: { transaction_id: transaction.transaction_id }, // Update theo ID cho chắc
                    data: { status: TransactionStatus.Success }
                });

                console.log("✅ Đã cập nhật trạng thái transaction thành công:", updatedTrans.transaction_id);

                // ⚠️ KIỂM TRA course_id trước khi tiếp tục
                if (!updatedTrans.course_id) {
                    console.log(`❌ Transaction không có course_id, bỏ qua enrollment`);
                    return;
                }

                // 2. Tìm thông tin học viên
                const learner = await tx.learner.findUnique({
                    where: { user_id: updatedTrans.user_id }
                });

                console.log(`🔍 Tìm learner với user_id: ${updatedTrans.user_id}`, learner);

                if (learner) {
                    // Kiểm tra trùng lặp lần cuối
                    const exists = await tx.learnerCourses.findUnique({
                        where: { 
                            learner_id_course_id: { 
                                learner_id: learner.learner_id, 
                                course_id: updatedTrans.course_id // Đã chắc chắn không null ở đây
                            } 
                        }
                    });

                    console.log(`🔍 Kiểm tra learner đã enroll chưa:`, exists);

                    if (!exists) {
                        // ⚠️ QUAN TRỌNG: Dùng 'tx.learnerCourses.create' thay vì hàm bên ngoài
                        // Để đảm bảo nằm chung trong transaction
                        const enrolled = await tx.learnerCourses.create({
                            data: {
                                learner_id: learner.learner_id,
                                course_id: updatedTrans.course_id, // TypeScript giờ biết nó không null
                                status: CourseEnrollmentStatus.Enrolled,
                                progress: new Prisma.Decimal(0),
                                rating: 0,
                                feedback: '',
                                completedAt: new Date(0),
                                enrolledAt: new Date()
                            }
                        });
                        console.log(`✅ Đã tạo learnerCourses:`, enrolled);
                    } else {
                        console.log(`⚠️ Learner đã enroll khóa học này rồi, bỏ qua.`);
                    }
                } else {
                    console.log(`❌ Không tìm thấy learner với user_id: ${updatedTrans.user_id}`);
                }

                // ===== PHẦN CỘNG TIỀN CHO GIẢNG VIÊN =====
                const course = transaction.course; 
                if (!course) {
                    console.log(`❌ Không tìm thấy thông tin khóa học`);
                    return;
                }

                const instructor = await tx.instructor.findUnique({
                    where: { instructor_id: course.instructor_id },
                    include: { user: true }
                });

                if (instructor && instructor.user) {
                    // Tính tiền (Giữ lại 10% phí nền tảng)
                    const originalPrice = Number(course.price);
                    const platformFee = originalPrice * 0.1;
                    const instructorAmount = originalPrice * 0.9; 

                    console.log(`💰 Tính toán: Giá ${originalPrice}đ - Phí 10% (${platformFee}đ) = GV nhận ${instructorAmount}đ`);

                    // Tìm ví giảng viên (hoặc tạo mới nếu chưa có)
                    let instructorWallet = await tx.wallet.findUnique({
                        where: { user_id: instructor.user_id }
                    });

                    // Nếu GV chưa có ví → Tạo mới
                    if (!instructorWallet) {
                        instructorWallet = await tx.wallet.create({
                            data: {
                                user_id: instructor.user_id,
                                balance: new Prisma.Decimal(0)
                            }
                        });
                        console.log(`✅ Đã tạo ví mới cho GV: ${instructorWallet.wallet_id}`);
                    }

                    // Cộng tiền vào ví
                    await tx.wallet.update({
                        where: { wallet_id: instructorWallet.wallet_id },
                        data: { balance: { increment: instructorAmount } }
                    });

                    // Lưu lịch sử biến động số dư (Giao dịch nội bộ)
                    await tx.transaction.create({
                        data: {
                            user_id: instructor.user_id,
                            wallet_id: instructorWallet.wallet_id,
                            course_id: course.course_id,
                            amount: new Prisma.Decimal(instructorAmount),
                            currency: 'VND',
                            transaction_type: TransactionType.Deposit, 
                            payment_method: TransactionMethod.Bank_Transfer,
                            status: TransactionStatus.Success,
                            note: TransactionNote.Pay_For_Instructor,
                            description: `Doanh thu bán khóa học: ${course.title} (Sau phí 10%)`,
                            payment_code: BigInt(Date.now() + Math.floor(Math.random()*10000)) 
                        }
                    });

                    console.log(`✅ Đã cộng ${instructorAmount}đ vào ví GV ${instructor.user.fullName}`);
                } else {
                    console.log(`⚠️ Không tìm thấy giảng viên của khóa học này`);
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
