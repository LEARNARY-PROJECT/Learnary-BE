import prisma from "../lib/client";
import { Prisma } from '../generated/prisma'

export const createAnswer = async (data: Prisma.AnswerCreateInput) => {
  return prisma.answer.create({ data });
};

export const getAnswerById = async (answer_id: string, opts?: { include?: Prisma.AnswerInclude }) => {
  return prisma.answer.findUnique({ 
    where: { answer_id }, 
    ...(opts ?? {}) 
  });
};

export const getAllAnswers = async (opts?: { include?: Prisma.AnswerInclude }) => {
  return prisma.answer.findMany({ ...(opts ?? {}) });
};

export const updateAnswer = async (
  answer_id: string,
  data: Prisma.AnswerUpdateInput
) => {
  return prisma.answer.update({ where: { answer_id }, data });
};

export const deleteAnswer = async (answer_id: string) => {
  return prisma.answer.delete({ where: { answer_id } });
};