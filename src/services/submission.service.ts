import prisma from "../lib/client";
import { Prisma } from "@prisma/client";

export const createSubmission = async (data: Prisma.SubmissionCreateInput) => {
  return prisma.submission.create({ data });
};

export const getSubmissionById = async (
  submission_id: string,
  opts?: { include?: Prisma.SubmissionInclude }
) => {
  return prisma.submission.findUnique({ 
    where: { submission_id }, 
    ...(opts ?? {}) 
  });
};

export const getAllSubmissions = async (opts?: { include?: Prisma.SubmissionInclude }) => {
  return prisma.submission.findMany({ ...(opts ?? {}) });
};

export const updateSubmission = async (
  submission_id: string,
  data: Prisma.SubmissionUpdateInput
) => {
  return prisma.submission.update({ where: { submission_id }, data });
};

export const deleteSubmission = async (submission_id: string) => {
  return prisma.submission.delete({ where: { submission_id } });
};