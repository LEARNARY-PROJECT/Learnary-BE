import prisma from "../lib/client";
import { Lesson } from "@prisma/client";

export const createLesson = async (data: Omit<Lesson, 'lesson_id' | 'createAt' | 'updatedAt'>) => {
  return prisma.lesson.create({ data });
};

export const getLessonById = async (lesson_id: string) => {
  return prisma.lesson.findUnique({ where: { lesson_id } });
};

export const getAllLessons = async () => {
  return prisma.lesson.findMany();
};

export const updateLesson = async (lesson_id: string, data: Partial<Lesson>) => {
  return prisma.lesson.update({ where: { lesson_id }, data });
};

export const deleteLesson = async (lesson_id: string) => {
  return prisma.lesson.delete({ where: { lesson_id } });
};
