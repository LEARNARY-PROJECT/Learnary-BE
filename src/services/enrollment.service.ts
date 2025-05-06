import prisma from '../lib/client';

export const createEnrollment = async (userId: string, courseId: string) => {
    return await prisma.enrollment.create({
        data: {
            userId,
            courseId,
        },
    });
};

export const getAllEnrollments = async () => {
    return await prisma.enrollment.findMany({
        include: {
            user: true,
            course: true,
        },
    });
};

export const getEnrollmentsByUser = async (userId: string) => {
    return await prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: true,
        },
    });
};
