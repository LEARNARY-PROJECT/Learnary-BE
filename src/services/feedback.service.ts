import prisma from '../lib/client';

export const createFeedback = async (data: {
    user_id: string;
    course_id: string;
    rating: number;
    comment: string;
}) => {
    return await prisma.feedback.create({
        data: {
            user_id:data.user_id,
            course_id:data.course_id,
            rating:data.rating,
            comment:data.comment
        }
    });
};

export const getFeedbackByCourse = async (course_id: string) => {
    return await prisma.feedback.findMany({
        where: { course_id },
        include: {
            user: {
                select: {
                    user_id: true,
                },
            },
        },
    });
};
