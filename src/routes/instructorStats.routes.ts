import { Router } from 'express';
import { InstructorStatsController } from '../controllers/instructorStats.controller';

const router = Router();

/**
 * @swagger
 * /api/instructor/stats/overview/{userId}:
 *   get:
 *     summary: Lấy tổng quan thống kê của giảng viên
 *     tags: [Instructor Stats]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thống kê tổng quan
 *       400:
 *         description: Thiếu thông tin userId
 *       500:
 *         description: Lỗi server
 */
router.get('/stats/overview/:userId', InstructorStatsController.getOverviewStats);

/**
 * @swagger
 * /api/instructor/stats/revenue/{userId}:
 *   get:
 *     summary: Lấy doanh thu theo tháng (7 tháng gần nhất)
 *     tags: [Instructor Stats]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dữ liệu doanh thu theo tháng
 *       400:
 *         description: Thiếu thông tin userId
 *       500:
 *         description: Lỗi server
 */
router.get('/stats/revenue/:userId', InstructorStatsController.getRevenueByMonth);

/**
 * @swagger
 * /api/instructor/stats/enrollments/{userId}:
 *   get:
 *     summary: Lấy các đăng ký khóa học gần đây
 *     tags: [Instructor Stats]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Danh sách đăng ký gần đây
 *       400:
 *         description: Thiếu thông tin userId
 *       500:
 *         description: Lỗi server
 */
router.get('/stats/enrollments/:userId', InstructorStatsController.getRecentEnrollments);

export default router;
