import prisma from "../lib/client";
import { Instructor } from "@prisma/client";

export const createInstructor = async (data: Omit<Instructor, 'instructor_id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.instructor.create({ data });
};

export const getInstructorById = async (instructor_id: string) => {
  return prisma.instructor.findUnique({ where: { instructor_id } });
};

export const getAllInstructors = async () => {
  return prisma.instructor.findMany();
};

export const updateInstructor = async (instructor_id: string, data: Partial<Instructor>) => {
  return prisma.instructor.update({ where: { instructor_id }, data });
};

export const deleteInstructor = async (instructor_id: string) => {
  return prisma.instructor.delete({ where: { instructor_id } });
};
