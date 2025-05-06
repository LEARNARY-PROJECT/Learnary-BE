import prisma from '../lib/client';

export const createLesson = async (data: {
    title: string;
    courseId: string;
    videoUrl: string;
    thumbnail: string;
    content: string;
}) => {
    const existingCount = await prisma.lesson.count({
        where: { courseId: data.courseId },
    });
    console.log('existingCount', existingCount);
    console.log('data', data);
    return await prisma.lesson.create({
        data: {
            ...data,
            order: existingCount + 1,    // Provide a default or appropriate value for 'order'
        },
    });
};
export const getLessonsByCourseId = async (courseId: string) => {
    return await prisma.lesson.findMany({
        where: { courseId },
        orderBy: { order: 'asc' }, // sắp xếp theo thứ tự hiển thị
    });
};
export const getLessonById = async (id: string) => {
    return await prisma.lesson.findUnique({
        where: { id },
    });
};

export const deleteLesson = async (id: string) => {
    return await prisma.lesson.delete({
        where: { id },
    });
};
export const updateLesson = async (id: string, data: any) => {
    return await prisma.lesson.update({
        where: { id },
        data,
    });
};

