import prisma from "../lib/client";
import { LearnerCourses } from "@prisma/client";

export const createLearnerCourse = async (data: Omit<LearnerCourses, 'createdAt' | 'updatedAt'>) => {
  return prisma.learnerCourses.create({ data });
};

export const getLearnerCourseById = async (learner_id: string, course_id:string) => {
  return prisma.learnerCourses.findUnique({ where: { learner_id, course_id } });
};

export const getAllLearnerCourses = async () => {
  return prisma.learnerCourses.findMany();
};

export const updateLearnerCourse = async (learner_id: string, course_id:string, data: Partial<LearnerCourses>) => {
  return prisma.learnerCourses.update({ where: { learner_id, course_id }, data });
};

export const deleteLearnerCourse = async (learner_id: string, course_id:string) => {
  return prisma.learnerCourses.delete({ where: { learner_id, course_id } });
};
