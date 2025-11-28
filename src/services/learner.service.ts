import prisma from "../lib/client";
import { Learner, User } from '../generated/prisma'

export const getAllLearnerNoUserData = async (): Promise<Learner[]> => {
  return prisma.learner.findMany();
};

export const getAllLearnerWithUserData = async () => {
  return prisma.learner.findMany({
    where: {
      user: {
        role: 'LEARNER' 
      }
    },
    include: {
      user: {
        select: {
          user_id: true,
          fullName: true,
          email: true,
          phone: true,
          avatar: true,
          isActive: true,
          last_login: true,
        }
      },
      _count: {
        select: {
          learner_courses: true
        }
      }
    },
    orderBy: {
      enrolledAt: 'desc'
    }
  });
};

export const getLearnerById = async (id: string): Promise<Learner | null> => {
  return prisma.learner.findUnique({
    where: { learner_id: id },
  });
};

export const getLearnerByUserId = async (userId: string): Promise<Learner | null> => {
  return prisma.learner.findUnique({
    where: { user_id: userId },
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