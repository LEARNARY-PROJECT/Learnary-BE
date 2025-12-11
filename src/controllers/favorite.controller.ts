import { Request, Response } from 'express';
import { FavoriteService } from '../services/favorite.service';

export const FavoriteController = {
    // 1. Thêm khóa học vào yêu thích
    addFavorite: async (req: Request, res: Response) => {
        try {
            const { userId, courseId } = req.body as { userId: string, courseId: string };
            
            if (!userId || !courseId) {
                return res.status(400).json({ 
                    error: "Thiếu thông tin userId hoặc courseId" 
                });
            }

            const favorite = await FavoriteService.addFavorite(userId, courseId);
            return res.status(201).json({ 
                message: "Đã thêm vào danh sách yêu thích",
                data: favorite 
            });

        } catch (error) {
            const err = error as Error;
            console.error("Error adding favorite:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

    // 2. Xóa khóa học khỏi yêu thích
    removeFavorite: async (req: Request, res: Response) => {
        try {
            const { userId, courseId } = req.body as { userId: string, courseId: string };
            
            if (!userId || !courseId) {
                return res.status(400).json({ 
                    error: "Thiếu thông tin userId hoặc courseId" 
                });
            }

            await FavoriteService.removeFavorite(userId, courseId);
            return res.json({ 
                message: "Đã xóa khỏi danh sách yêu thích" 
            });

        } catch (error) {
            const err = error as Error;
            console.error("Error removing favorite:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

    // 3. Lấy danh sách khóa học yêu thích
    getFavorites: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            
            if (!userId) {
                return res.status(400).json({ 
                    error: "Thiếu thông tin userId" 
                });
            }

            const favorites = await FavoriteService.getFavorites(userId);
            return res.json({ data: favorites });

        } catch (error) {
            const err = error as Error;
            console.error("Error getting favorites:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

    // 4. Kiểm tra khóa học có trong yêu thích không
    checkFavorite: async (req: Request, res: Response) => {
        try {
            const { userId, courseId } = req.params;
            
            if (!userId || !courseId) {
                return res.status(400).json({ 
                    error: "Thiếu thông tin userId hoặc courseId" 
                });
            }

            const isFavorite = await FavoriteService.checkFavorite(userId, courseId);
            return res.json({ isFavorite });

        } catch (error) {
            const err = error as Error;
            console.error("Error checking favorite:", err.message);
            return res.status(500).json({ error: err.message });
        }
    }
};
