import prisma from "../lib/client";
import { InstructorCourseTransaction } from "@prisma/client";

export const createInstructorCourseTransaction = async (data: Omit<InstructorCourseTransaction, 'instructor_course_transaction_id' | 'createAt' | 'updateAt'>) => {
  return prisma.instructorCourseTransaction.create({ data });
};

export const getInstructorCourseTransactionById = async (instructor_course_transaction_id: string) => {
  return prisma.instructorCourseTransaction.findUnique({ where: { instructor_course_transaction_id } });
};

export const getAllInstructorCourseTransactions = async () => {
  return prisma.instructorCourseTransaction.findMany();
};

export const updateInstructorCourseTransaction = async (instructor_course_transaction_id: string, data: Partial<InstructorCourseTransaction>) => {
  return prisma.instructorCourseTransaction.update({ where: { instructor_course_transaction_id }, data });
};

export const deleteInstructorCourseTransaction = async (instructor_course_transaction_id: string) => {
  return prisma.instructorCourseTransaction.delete({ where: { instructor_course_transaction_id } });
};
