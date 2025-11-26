import prisma from "../lib/client";
import { Prisma } from '../generated/prisma'

export const createQuiz = async (data: Prisma.QuizCreateInput) => {
  return prisma.quiz.create({ data });
};

export const getQuizById = async (
  quiz_id: string,
  opts?: { include?: Prisma.QuizInclude }
) => {
  return prisma.quiz.findUnique({ 
    where: { quiz_id }, 
    ...(opts ?? {}) 
  });
};

export const getAllQuizzes = async (opts?: { include?: Prisma.QuizInclude }) => {
  return prisma.quiz.findMany({ ...(opts ?? {}) });
};

export const updateQuiz = async (
  quiz_id: string,
  data: Prisma.QuizUpdateInput
) => {
  return prisma.quiz.update({ where: { quiz_id }, data });
};

export const deleteQuiz = async (quiz_id: string) => {
  return prisma.quiz.delete({ where: { quiz_id } });
};