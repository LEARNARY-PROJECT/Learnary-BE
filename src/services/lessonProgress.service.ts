import prisma from "../lib/client";

export const markLessonComplete = async (user_id: string, lesson_id: string) => {
  return prisma.lessonProgress.upsert({
    where: {
      user_id_lesson_id: {
        user_id,
        lesson_id
      }
    },
    update: {
      is_completed: true,
      completed_at: new Date()
    },
    create: {
      user_id,
      lesson_id,
      is_completed: true,
      completed_at: new Date()
    }
  });
};

export const markLessonIncomplete = async (user_id: string, lesson_id: string) => {
  return prisma.lessonProgress.upsert({
    where: {
      user_id_lesson_id: {
        user_id,
        lesson_id
      }
    },
    update: {
      is_completed: false,
      completed_at: null
    },
    create: {
      user_id,
      lesson_id,
      is_completed: false,
      completed_at: null
    }
  });
};

export const getLessonProgress = async (user_id: string, lesson_id: string) => {
  return prisma.lessonProgress.findUnique({
    where: {
      user_id_lesson_id: {
        user_id,
        lesson_id
      }
    },
    include: {
      lesson: {
        select: {
          lesson_id: true,
          title: true,
          duration: true,
          order_index: true
        }
      }
    }
  });
};

export const getUserLessonProgress = async (user_id: string) => {
  return prisma.lessonProgress.findMany({
    where: { user_id },
    include: {
      lesson: {
        select: {
          lesson_id: true,
          title: true,
          duration: true,
          order_index: true,
          chapter_id: true,
          belongChapter: {
            select: {
              chapter_id: true,
              chapter_title: true,
              course_id: true
            }
          }
        }
      }
    },
    orderBy: {
      completed_at: 'desc'
    }
  });
};

export const getCourseProgressByUser = async (user_id: string, course_id: string) => {
  return prisma.lessonProgress.findMany({
    where: {
      user_id,
      lesson: {
        belongChapter: {
          course_id
        }
      }
    },
    include: {
      lesson: {
        select: {
          lesson_id: true,
          title: true,
          duration: true,
          order_index: true,
          chapter_id: true,
          belongChapter: {
            select: {
              chapter_id: true,
              chapter_title: true,
              order_index: true
            }
          }
        }
      }
    },
    orderBy: [
      { lesson: { belongChapter: { order_index: 'asc' } } },
      { lesson: { order_index: 'asc' } }
    ]
  });
};

export const deleteLessonProgress = async (user_id: string, lesson_id: string) => {
  return prisma.lessonProgress.delete({
    where: {
      user_id_lesson_id: {
        user_id,
        lesson_id
      }
    }
  });
};
