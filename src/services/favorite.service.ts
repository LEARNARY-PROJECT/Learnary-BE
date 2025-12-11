import prisma from '../lib/client';

export const FavoriteService = {
    // 1. Thêm khóa học vào yêu thích
    addFavorite: async (userId: string, courseId: string) => {
        // Tìm learner
        const learner = await prisma.learner.findUnique({
            where: { user_id: userId }
        });

        if (!learner) {
            throw new Error("Không tìm thấy thông tin học viên");
        }

        // Kiểm tra khóa học có tồn tại không
        const course = await prisma.course.findUnique({
            where: { course_id: courseId }
        });

        if (!course) {
            throw new Error("Khóa học không tồn tại");
        }

        // Kiểm tra đã yêu thích chưa
        const existing = await prisma.favorite.findUnique({
            where: {
                learner_id_course_id: {
                    learner_id: learner.learner_id,
                    course_id: courseId
                }
            }
        });

        if (existing) {
            throw new Error("Khóa học đã có trong danh sách yêu thích");
        }

        // Tạo favorite
        const favorite = await prisma.favorite.create({
            data: {
                learner_id: learner.learner_id,
                course_id: courseId
            },
            include: {
                course: {
                    select: {
                        course_id: true,
                        title: true,
                        thumbnail: true,
                        price: true,
                        status: true,
                        slug: true,
                        description: true,
                        category: {
                            select: {
                                category_name: true
                            }
                        },
                        instructor: {
                            select: {
                                user: {
                                    select: {
                                        fullName: true,
                                        avatar: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return favorite;
    },

    // 2. Xóa khóa học khỏi yêu thích
    removeFavorite: async (userId: string, courseId: string) => {
        // Tìm learner
        const learner = await prisma.learner.findUnique({
            where: { user_id: userId }
        });

        if (!learner) {
            throw new Error("Không tìm thấy thông tin học viên");
        }

        // Xóa favorite
        const deleted = await prisma.favorite.deleteMany({
            where: {
                learner_id: learner.learner_id,
                course_id: courseId
            }
        });

        if (deleted.count === 0) {
            throw new Error("Không tìm thấy khóa học trong danh sách yêu thích");
        }

        return deleted;
    },

    // 3. Lấy danh sách khóa học yêu thích
    getFavorites: async (userId: string) => {
        // Tìm learner
        const learner = await prisma.learner.findUnique({
            where: { user_id: userId }
        });

        if (!learner) {
            return [];
        }

        // Lấy danh sách favorites
        const favorites = await prisma.favorite.findMany({
            where: {
                learner_id: learner.learner_id
            },
            include: {
                course: {
                    select: {
                        course_id: true,
                        title: true,
                        thumbnail: true,
                        price: true,
                        status: true,
                        slug: true,
                        description: true,
                        sale_off: true,
                        hot: true,
                        available_language: true,
                        createdAt: true,
                        category: {
                            select: {
                                category_id: true,
                                category_name: true
                            }
                        },
                        level: {
                            select: {
                                level_id: true,
                                level_name: true
                            }
                        },
                        instructor: {
                            select: {
                                instructor_id: true,
                                user: {
                                    select: {
                                        fullName: true,
                                        avatar: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return favorites;
    },

    // 4. Kiểm tra khóa học có trong yêu thích không
    checkFavorite: async (userId: string, courseId: string): Promise<boolean> => {
        // Tìm learner
        const learner = await prisma.learner.findUnique({
            where: { user_id: userId }
        });

        if (!learner) {
            return false;
        }

        // Kiểm tra favorite
        const favorite = await prisma.favorite.findUnique({
            where: {
                learner_id_course_id: {
                    learner_id: learner.learner_id,
                    course_id: courseId
                }
            }
        });

        return !!favorite;
    }
};
