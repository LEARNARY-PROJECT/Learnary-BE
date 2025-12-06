import prisma from "../lib/client";
import { LearnerCourses } from '../generated/prisma'; // Hoặc đường dẫn đúng tới Client của bạn

export const createLearnerCourse = async (data: Omit<LearnerCourses, 'createdAt' | 'updatedAt'>) => {
  return prisma.learnerCourses.create({ data });
};

export const getLearnerCourseById = async (learner_id: string, course_id: string) => {
  return prisma.learnerCourses.findUnique({
    where: {
      // ⚠️ QUAN TRỌNG: Phải dùng cú pháp gộp (Composite Key)
      learner_id_course_id: {
        learner_id,
        course_id
      }
    }
  });
};

export const getAllLearnerCourses = async () => {
  return prisma.learnerCourses.findMany();
};

export const getCoursesByLearnerId = async (learner_id: string) => {
  return prisma.learnerCourses.findMany({
    where: { learner_id },
    include: {
      course: {
        select: {
          course_id: true,
          title: true,
          slug: true,
          thumbnail: true,
          description: true,
          price: true,
          status: true,
          available_language: true,
          category: {
            select: {
              category_id: true,
              category_name: true
            }
          },
          level: {
            select: {
              level_id: true,
              level_name: true
            }
          },
          instructor: {
            select: {
              instructor_id: true,
              user: {
                select: {
                  user_id: true,
                  fullName:true,
                  email: true,
                  avatar: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      enrolledAt: 'desc'
    }
  });
};

export const getCoursesByLearnerUserId = async (user_id: string) => {
  const learner = await prisma.learner.findUnique({
    where: { user_id }
  });

  if (!learner) {
    throw new Error('Learner not found');
  }

  return getCoursesByLearnerId(learner.learner_id);
};

export const updateLearnerCourse = async (learner_id: string, course_id: string, data: Partial<LearnerCourses>) => {
  return prisma.learnerCourses.update({
    where: {
      learner_id_course_id: {
        learner_id,
        course_id
      }
    },
    data
  });
};

export const deleteLearnerCourse = async (learner_id: string, course_id: string) => {
  return prisma.learnerCourses.delete({
    where: {
      learner_id_course_id: {
        learner_id,
        course_id
      }
    }
  });
};