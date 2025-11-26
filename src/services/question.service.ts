import prisma from "../lib/client";
import { Prisma } from '../generated/prisma'

export const createQuestion = async (data: Prisma.QuestionCreateInput) => {
  return prisma.question.create({ data });
};

export const getQuestionById = async (
  question_id: string,
  opts?: { include?: Prisma.QuestionInclude }
) => {
  return prisma.question.findUnique({ 
    where: { question_id }, 
    ...(opts ?? {}) 
  });
};

export const getAllQuestions = async (opts?: { include?: Prisma.QuestionInclude }) => {
  return prisma.question.findMany({ ...(opts ?? {}) });
};

export const updateQuestion = async (
  question_id: string,
  data: Prisma.QuestionUpdateInput
) => {
  return prisma.question.update({ where: { question_id }, data });
};

export const deleteQuestion = async (question_id: string) => {
  return prisma.question.delete({ where: { question_id } });
};