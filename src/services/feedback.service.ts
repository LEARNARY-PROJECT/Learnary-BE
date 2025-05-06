import prisma from '../lib/client';

export const createFeedback = async (data: {
    userId: string;
    courseId: string;
    rating: number;
    comment: string;
}) => {
    return await prisma.feedback.create({
        data,
    });
};

export const getFeedbackByCourse = async (courseId: string) => {
    return await prisma.feedback.findMany({
        where: { courseId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
};
