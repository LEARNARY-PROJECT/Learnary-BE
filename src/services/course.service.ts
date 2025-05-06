import prisma from "../lib/client";

export const createCourse = async (data: {
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    instructorId: string;
}) => {
    return await prisma.course.create({
        data,
    });
};
export const getAllCourses = () => prisma.course.findMany({ include: { lessons: true, feedbacks: true } });

export const getCourseById = (id: string) =>
    prisma.course.findUnique({ where: { id }, include: { lessons: true, feedbacks: true } });

export const updateCourse = (id: string, data: any) =>
    prisma.course.update({ where: { id }, data });

export const deleteCourse = (id: string) => prisma.course.delete({ where: { id } });
