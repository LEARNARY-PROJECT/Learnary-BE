import prisma from "../lib/client";
import { InstructorSpecializations } from "@prisma/client";

export const createInstructorSpecializations = async (data: Omit<InstructorSpecializations, 'instructor_specialization_id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.instructorSpecializations.create({ data });
};

export const getInstructorSpecializationsById = async (instructor_specialization_id: string) => {
  return prisma.instructorSpecializations.findUnique({ where: { instructor_specialization_id } });
};

export const getAllInstructorSpecializations = async () => {
  return prisma.instructorSpecializations.findMany();
};

export const updateInstructorSpecializations = async (instructor_specialization_id: string, data: Partial<InstructorSpecializations>) => {
  return prisma.instructorSpecializations.update({ where: { instructor_specialization_id }, data });
};

export const deleteInstructorSpecializations = async (instructor_specialization_id: string) => {
  return prisma.instructorSpecializations.delete({ where: { instructor_specialization_id } });
};
