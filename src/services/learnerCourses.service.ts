import prisma from "../lib/client";
import { LeanrerCourses } from "@prisma/client";

export const createLeanrerCourse = async (data: Omit<LeanrerCourses, 'learner_course_id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.leanrerCourses.create({ data });
};

export const getLeanrerCourseById = async (learner_course_id: string) => {
  return prisma.leanrerCourses.findUnique({ where: { learner_course_id } });
};

export const getAllLeanrerCourses = async () => {
  return prisma.leanrerCourses.findMany();
};

export const updateLeanrerCourse = async (learner_course_id: string, data: Partial<LeanrerCourses>) => {
  return prisma.leanrerCourses.update({ where: { learner_course_id }, data });
};

export const deleteLeanrerCourse = async (learner_course_id: string) => {
  return prisma.leanrerCourses.delete({ where: { learner_course_id } });
};
