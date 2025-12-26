import { TransactionStatus, TransactionType, TransactionMethod, TransactionNote, Prisma, CourseEnrollmentStatus } from '../generated/prisma'; // Đảm bảo đường dẫn import đúng với setup của bạn
import prisma from '../lib/client';
import payOS from '../lib/payos';
import { CreatePaymentParams, PayOSWebhookBody, PayOSWebhookData } from '../types/payos';
import { sendConfirmedEnrolledCourse } from './email.service';

export const PaymentService = {
    createPaymentLink: async (userId: string, courseId: string): Promise<{ qrCode: string, orderCode: number, amount: number}> => {
        const course = await prisma.course.findUnique({ where: { course_id: courseId } });
        if (!course) throw new Error("Khóa học không tồn tại");

        // Kiểm tra xem người mua có phải là giảng viên của khóa học không
        const instructor = await prisma.instructor.findUnique({ where: { user_id: userId } });
        if (instructor && instructor.instructor_id === course.instructor_id) {
            throw new Error("Bạn không thể mua khóa học của chính mình!");
        }

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
        return { qrCode: response.qrCode, orderCode, amount: Number(response.amount) };
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
                    where: { payment_code: BigInt(orderCode) },
                    include: { course: true  }
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
                // ⚠️ KIỂM TRA: Đây là thanh toán combo hay khóa học đơn?
                const isComboPayment = !updatedTrans.course_id && updatedTrans.description?.includes('combo');
                
                if (isComboPayment) {
                    // XỬ LÝ THANH TOÁN COMBO
                    // Lấy group_id từ description (format: "Thanh toán combo: {name}")
                    // Hoặc có thể lưu group_id vào field khác trong transaction
                    // Tạm thời tìm combo qua description
                    const groupMatches = await tx.group.findMany({
                        include: {
                            hasCourseGroup: {   
                                include: {
                                    belongToCourse: true
                                }
                            }
                        }
                    });

                    let targetGroup = null;
                    for (const group of groupMatches) {
                        if (updatedTrans.description?.includes(group.name)) {
                            targetGroup = group;
                            break;
                        }
                    }

                    if (!targetGroup) {
                        return;
                    }
                    // Tìm learner
                    const learner = await tx.learner.findUnique({
                        where: { user_id: updatedTrans.user_id }
                    });

                    if (!learner) {
                        return;
                    }

                    // Enroll tất cả khóa học trong combo
                    for (const cg of targetGroup.hasCourseGroup) {
                        const exists = await tx.learnerCourses.findUnique({
                            where: { 
                                learner_id_course_id: { 
                                    learner_id: learner.learner_id, 
                                    course_id: cg.course_id
                                } 
                            }
                        });

                        if (!exists) {
                            await tx.learnerCourses.create({
                                data: {
                                    learner_id: learner.learner_id,
                                    course_id: cg.course_id,
                                    status: CourseEnrollmentStatus.Enrolled,
                                    progress: new Prisma.Decimal(0),
                                    rating: 0,
                                    feedback: '',
                                    completedAt: new Date(0),
                                    enrolledAt: new Date()
                                }
                            });
                        }
                    }

                    // Cộng tiền cho giảng viên của từng khóa học
                    const totalPrice = Number(updatedTrans.amount);
                    const pricePerCourse = totalPrice / targetGroup.hasCourseGroup.length;

                    for (const cg of targetGroup.hasCourseGroup) {
                        const instructor = await tx.instructor.findUnique({
                            where: { instructor_id: cg.belongToCourse.instructor_id },
                            include: { user: true }
                        });

                        if (instructor && instructor.user) {
                            const platformFee = pricePerCourse * 0.1;
                            const instructorAmount = pricePerCourse * 0.9;

                            let instructorWallet = await tx.wallet.findUnique({
                                where: { user_id: instructor.user_id }
                            });

                            if (!instructorWallet) {
                                instructorWallet = await tx.wallet.create({
                                    data: {
                                        user_id: instructor.user_id,
                                        balance: new Prisma.Decimal(0)
                                    }
                                });
                            }

                            await tx.wallet.update({
                                where: { wallet_id: instructorWallet.wallet_id },
                                data: { balance: { increment: instructorAmount } }
                            });

                            await tx.transaction.create({
                                data: {
                                    user_id: instructor.user_id,
                                    wallet_id: instructorWallet.wallet_id,
                                    course_id: cg.course_id,
                                    amount: new Prisma.Decimal(instructorAmount),
                                    currency: 'VND',
                                    transaction_type: TransactionType.Deposit,
                                    payment_method: TransactionMethod.Bank_Transfer,
                                    status: TransactionStatus.Success,
                                    note: TransactionNote.Pay_For_Instructor,
                                    description: `Doanh thu combo "${targetGroup.name}" - Khóa: ${cg.belongToCourse.title}`,
                                    payment_code: BigInt(Date.now() + Math.floor(Math.random()*10000))
                                }
                            });
                        }
                    }
                    return; // Kết thúc xử lý combo
                }

                // XỬ LÝ THANH TOÁN KHÓA HỌC ĐƠN (code gốc)
                // ⚠️ KIỂM TRA course_id trước khi tiếp tục
                if (!updatedTrans.course_id) {
                    return;
                }

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
                        await tx.learnerCourses.create({
                            data: {
                                learner_id: learner.learner_id,
                                course_id: updatedTrans.course_id, 
                                status: CourseEnrollmentStatus.Enrolled,
                                progress: new Prisma.Decimal(0),
                                rating: 0,
                                feedback: '',
                                completedAt: new Date(0),
                                enrolledAt: new Date()
                            }
                        });
                        const user = await tx.user.findUnique({
                            where: { user_id: updatedTrans.user_id },
                            select: { email: true, fullName: true }
                        });
                        if (user && transaction.course) {
                            sendConfirmedEnrolledCourse({
                                orderCode: String(orderCode),
                                courseName: transaction.course.title,
                                coursePrice: Number(transaction.course.price),
                                transactionDate: webhookData.transactionDateTime,
                                buyerEmail: user.email,
                                buyerName: user.fullName || 'Học viên'
                            }).catch(err => console.error('Email error:', err));
                        }
                    }
                }

                // ===== PHẦN CỘNG TIỀN CHO GIẢNG VIÊN =====
                const course = transaction.course; 
                if (!course) {
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
    },

    // 4. Hàm tạo link thanh toán cho Combo
    createComboPaymentLink: async (userId: string, groupId: string): Promise<{ qrCode: string, orderCode: number, amount: number }> => {
        // Lấy thông tin combo/group
        const group = await prisma.group.findUnique({ 
            where: { group_id: groupId },
            include: {
                hasCourseGroup: {
                    include: {
                        belongToCourse: true
                    }
                }
            }
        });

        if (!group) throw new Error("Combo không tồn tại");
        if (!group.hasCourseGroup || group.hasCourseGroup.length === 0) {
            throw new Error("Combo không có khóa học nào");
        }

        // Tính tổng giá gốc
        const totalOriginalPrice = group.hasCourseGroup.reduce((sum, cg) => {
            return sum + Number(cg.belongToCourse.price);
        }, 0);

        // Tính giá sau giảm
        const discountedPrice = Math.round(totalOriginalPrice * (1 - Number(group.discount) / 100));

        const orderCode = Number(String(Date.now()).slice(-6));

        // Kiểm tra xem user đã mua combo chưa
        const learner = await prisma.learner.findUnique({ where: { user_id: userId } });
        
        if (learner) {
            // Kiểm tra xem đã mua tất cả khóa học trong combo chưa
            for (const cg of group.hasCourseGroup) {
                const alreadyEnrolled = await prisma.learnerCourses.findUnique({
                    where: {
                        learner_id_course_id: {
                            learner_id: learner.learner_id,
                            course_id: cg.course_id
                        }
                    }
                });

                if (alreadyEnrolled) {
                    throw new Error(`Bạn đã sở hữu khóa học "${cg.belongToCourse.title}" trong combo này rồi!`);
                }
            }
        }

        // Tạo Transaction cho combo
        await prisma.transaction.create({
            data: {
                user_id: userId,
                course_id: null, // Combo không có course_id cụ thể
                wallet_id: null,
                amount: new Prisma.Decimal(discountedPrice),
                currency: 'VND',
                payment_method: TransactionMethod.Bank_Transfer,
                transaction_type: TransactionType.Pay,
                status: TransactionStatus.Pending,
                note: TransactionNote.User_Pay,
                description: `Thanh toán combo: ${group.name}`,
                payment_code: BigInt(orderCode)
            }
        });

        // Tạo body gửi sang PayOS
        const paymentBody: CreatePaymentParams = {
            orderCode: orderCode,
            amount: discountedPrice,
            description: "Thanh toan combo",
            cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel`,
            returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`
        };

        // Gọi PayOS
        const response = await payOS.paymentRequests.create(paymentBody);
        return { qrCode: response.qrCode, orderCode, amount: Number(response.amount)};
    },

    // Cronjob: Tự động hủy các giao dịch Pending quá 1 phút
    autoCancelExpiredTransactions: async () => {
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        const expiredTransactions = await prisma.transaction.findMany({
            where: {
                status: TransactionStatus.Pending,
                createdAt: { lt: oneMinuteAgo }
            }
        });
        for (const tx of expiredTransactions) {
            await prisma.transaction.update({
                where: { transaction_id: tx.transaction_id },
                data: { status: TransactionStatus.Cancel }
            });
        }
        return expiredTransactions.length;
    }
    
};

// Tự động hủy các giao dịch Pending quá han
if (process.env.NODE_ENV !== 'test') {
    setInterval(() => {
        PaymentService.autoCancelExpiredTransactions()
            .then(count => {
                if (count > 0) console.log(`Đã hủy ${count} giao dịch quá hạn.`);
            })
            .catch(err => console.error('Auto cancel error:', err));
    }, 10000);
}

