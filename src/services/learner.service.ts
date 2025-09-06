import prisma from "../lib/client";
import { Learner, User } from "@prisma/client";

export const getAllLearnerNoUserData = async (): Promise<Learner[]> => {
  return prisma.learner.findMany();
};

export const getAllLearnerWithUserData = async (): Promise<
  (Learner & { user: User })[]
> => {
  return prisma.learner.findMany({
    include: {
      user: true,
    },
  });
};

export const getLearnerById = async (id: string): Promise<Learner | null> => {
  return prisma.learner.findUnique({
    where: { learner_id: id },
  });
};


export const deleteLearner = async (learner_id: string): Promise<Learner> => {
  return prisma.learner.delete({
    where: { learner_id },
  });
};

export const updateLearner = async (
  learner_id: string,
  data: Partial<Learner>
): Promise<Learner> => {
  return prisma.learner.update({
    where: { learner_id },
    data,
  });
};

