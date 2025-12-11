import { Request, Response } from 'express';
import { InstructorStatsService } from '../services/instructorStats.service';

export const InstructorStatsController = {
    // Lấy tổng quan thống kê
    getOverviewStats: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            
            if (!userId) {
                return res.status(400).json({ 
                    error: "Thiếu thông tin userId" 
                });
            }

            const stats = await InstructorStatsService.getOverviewStats(userId);
            return res.json({ data: stats });

        } catch (error) {
            const err = error as Error;
            console.error("Error getting instructor stats:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

    // Lấy doanh thu theo tháng
    getRevenueByMonth: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            
            if (!userId) {
                return res.status(400).json({ 
                    error: "Thiếu thông tin userId" 
                });
            }

            const revenue = await InstructorStatsService.getRevenueByMonth(userId);
            return res.json({ data: revenue });

        } catch (error) {
            const err = error as Error;
            console.error("Error getting revenue by month:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

    // Lấy đăng ký gần đây
    getRecentEnrollments: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const limit = parseInt(req.query.limit as string) || 5;
            
            if (!userId) {
                return res.status(400).json({ 
                    error: "Thiếu thông tin userId" 
                });
            }

            const enrollments = await InstructorStatsService.getRecentEnrollments(userId, limit);
            return res.json({ data: enrollments });

        } catch (error) {
            const err = error as Error;
            console.error("Error getting recent enrollments:", err.message);
            return res.status(500).json({ error: err.message });
        }
    }
};
