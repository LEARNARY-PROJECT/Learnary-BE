import prisma from "../lib/client";
import { InstructorQualifications } from "@prisma/client";

export const createInstructorQualifications = async (data: Omit<InstructorQualifications, 'instructor_qualification_id' | 'createdAt' | 'updateAt'>) => {
  return prisma.instructorQualifications.create({ data });
};

export const getInstructorQualificationsById = async (instructor_qualification_id: string) => {
  return prisma.instructorQualifications.findUnique({ where: { instructor_qualification_id } });
};

export const getAllInstructorQualifications = async () => {
  return prisma.instructorQualifications.findMany();
};

export const updateInstructorQualifications = async (instructor_qualification_id: string, data: Partial<InstructorQualifications>) => {
  return prisma.instructorQualifications.update({ where: { instructor_qualification_id }, data });
};

export const deleteInstructorQualifications = async (instructor_qualification_id: string) => {
  return prisma.instructorQualifications.delete({ where: { instructor_qualification_id } });
};
