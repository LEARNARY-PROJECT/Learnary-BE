import prisma from '../lib/client';
import { Prisma } from '../generated/prisma';

export const InstructorStatsService = {
    // Lấy tổng quan thống kê cho instructor
    getOverviewStats: async (userId: string) => {
        // Tìm instructor
        const instructor = await prisma.instructor.findUnique({
            where: { user_id: userId }
        });

        if (!instructor) {
            throw new Error("Không tìm thấy thông tin giảng viên");
        }

        // 1. Tổng doanh thu (từ ví)
        const wallet = await prisma.wallet.findUnique({
            where: { user_id: userId }
        });
        const totalRevenue = wallet ? Number(wallet.balance) : 0;

        // 2. Tổng số học viên (đếm unique learners đã mua khóa của instructor)
        const courses = await prisma.course.findMany({
            where: { instructor_id: instructor.instructor_id },
            select: { course_id: true }
        });
        const courseIds = courses.map(c => c.course_id);

        // Đếm số học viên UNIQUE (distinct learner_id)
        const uniqueLearners = await prisma.learnerCourses.groupBy({
            by: ['learner_id'],
            where: {
                course_id: { in: courseIds },
                status: 'Enrolled'
            }
        });
        const totalStudents = uniqueLearners.length;

        // 3. Tổng số khóa học và số khóa học public
        const totalCourses = await prisma.course.count({
            where: { instructor_id: instructor.instructor_id }
        });

        const publishedCourses = await prisma.course.count({
            where: { 
                instructor_id: instructor.instructor_id,
                status: 'Published'
            }
        });

        // 4. Đánh giá trung bình
        const feedbacks = await prisma.feedback.findMany({
            where: {
                course_id: { in: courseIds }
            },
            select: { rating: true }
        });

        const averageRating = feedbacks.length > 0
            ? feedbacks.reduce((sum, f) => sum + Number(f.rating), 0) / feedbacks.length
            : 0;

        // 5. Tính % tăng trưởng doanh thu so với tháng trước
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Tháng trước
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        const currentMonthStart = new Date(currentYear, currentMonth, 1);
        const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
        const lastMonthStart = new Date(lastMonthYear, lastMonth, 1);
        const lastMonthEnd = new Date(lastMonthYear, lastMonth + 1, 0, 23, 59, 59);

        // Doanh thu tháng này
        const currentMonthTransactions = await prisma.transaction.findMany({
            where: {
                user_id: userId,
                course_id: { in: courseIds },
                transaction_type: 'Deposit',
                status: 'Success',
                createdAt: {
                    gte: currentMonthStart,
                    lte: currentMonthEnd
                }
            },
            select: { amount: true }
        });
        const currentMonthRevenue = currentMonthTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);

        // Doanh thu tháng trước
        const lastMonthTransactions = await prisma.transaction.findMany({
            where: {
                user_id: userId,
                course_id: { in: courseIds },
                transaction_type: 'Deposit',
                status: 'Success',
                createdAt: {
                    gte: lastMonthStart,
                    lte: lastMonthEnd
                }
            },
            select: { amount: true }
        });
        const lastMonthRevenue = lastMonthTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);

        // Tính % tăng trưởng
        let revenueGrowth = 0;
        if (lastMonthRevenue > 0) {
            revenueGrowth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        } else if (currentMonthRevenue > 0) {
            revenueGrowth = 100; // Tăng 100% nếu tháng trước không có doanh thu
        }

        return {
            totalRevenue,
            totalStudents,
            totalCourses,
            publishedCourses,
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: feedbacks.length,
            revenueGrowth: Math.round(revenueGrowth * 10) / 10
        };
    },

    // Lấy doanh thu theo tháng (12 tháng gần nhất)
    getRevenueByMonth: async (userId: string) => {
        const instructor = await prisma.instructor.findUnique({
            where: { user_id: userId }
        });

        if (!instructor) {
            throw new Error("Không tìm thấy thông tin giảng viên");
        }

        // Lấy các khóa học của instructor
        const courses = await prisma.course.findMany({
            where: { instructor_id: instructor.instructor_id },
            select: { course_id: true }
        });
        const courseIds = courses.map(c => c.course_id);

        // Lấy transactions trong 12 tháng gần nhất
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const transactions = await prisma.transaction.findMany({
            where: {
                user_id: userId,
                course_id: { in: courseIds },
                transaction_type: 'Deposit',
                status: 'Success',
                createdAt: { gte: twelveMonthsAgo }
            },
            select: {
                amount: true,
                createdAt: true
            },
            orderBy: { createdAt: 'asc' }
        });

        // Group by month
        const monthlyRevenue: { [key: string]: number } = {};
        const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

        transactions.forEach(tx => {
            const month = tx.createdAt.getMonth(); // 0-11
            const year = tx.createdAt.getFullYear();
            const key = `${months[month]} ${year}`;
            
            if (!monthlyRevenue[key]) {
                monthlyRevenue[key] = 0;
            }
            monthlyRevenue[key] += Number(tx.amount);
        });

        // Convert to array format for chart
        const result = Object.entries(monthlyRevenue)
            .slice(-12) // Lấy 12 tháng gần nhất
            .map(([name, total]) => ({
                name: name.split(' ')[0], // Chỉ lấy "T1", "T2"...
                total
            }));

        return result;
    },

    // Lấy danh sách đăng ký gần đây
    getRecentEnrollments: async (userId: string, limit: number = 5) => {
        const instructor = await prisma.instructor.findUnique({
            where: { user_id: userId }
        });

        if (!instructor) {
            throw new Error("Không tìm thấy thông tin giảng viên");
        }

        // Lấy các khóa học của instructor
        const courses = await prisma.course.findMany({
            where: { instructor_id: instructor.instructor_id },
            select: { course_id: true, title: true }
        });
        const courseIds = courses.map(c => c.course_id);

        // Lấy enrollments gần đây
        const enrollments = await prisma.learnerCourses.findMany({
            where: {
                course_id: { in: courseIds }
            },
            include: {
                learner: {
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                },
                course: {
                    select: {
                        title: true,
                        price: true
                    }
                }
            },
            orderBy: { enrolledAt: 'desc' },
            take: limit
        });

        return enrollments.map(e => ({
            id: e.learner_id + e.course_id,
            user: e.learner.user.fullName,
            email: e.learner.user.email,
            avatar: e.learner.user.avatar || '',
            course: e.course.title,
            amount: Number(e.course.price),
            enrolledAt: e.enrolledAt
        }));
    }
};
