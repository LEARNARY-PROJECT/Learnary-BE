
import prisma from "../lib/client";

export const createCourse = async (data: {
  instructor_id: string;
  category_id: string;
  level_id: string;
  title: string;
  requirement:string;
  description: string;
  thumbnail: string;
  price: number;
}) => {
  return await prisma.courses.create({
    data: {
      instructor_id: data.instructor_id,
      category_id: data.category_id,
      level_id: data.level_id,
      title: data.title,
      requirement:data.requirement,
      description: data.description,
      thumbnail: data.thumbnail,
      price: data.price,
      slug: data.title.toLowerCase().replace(/\s+/g, "-"),
    },
  });
};
export const getAllCourses = () =>
  prisma.courses.findMany({ include: { chapter: true, feedbacks: true } });

export const getCourseById = (course_id: string) =>
  prisma.courses.findUnique({
    where: { course_id },
    include: { chapter: true, feedbacks: true },
  });

export const updateCourse = (course_id: string, data: any) =>
  prisma.courses.update({ where: { course_id }, data });

export const deleteCourse = (course_id: string) =>
  prisma.courses.delete({ where: { course_id } });
