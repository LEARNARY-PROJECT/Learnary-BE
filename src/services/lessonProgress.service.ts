import prisma from "../lib/client";
import { AppError } from "../utils/custom-error";

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
  if(!lesson_id || !user_id) {
    throw new AppError("Missing field required", 404)
  }
  
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

export const updateLessonWatchTime = async (
  user_id: string, 
  lesson_id: string, 
  last_watch_time: number, 
  max_watch_time?: number
) => {
  const currentProgress = await prisma.lessonProgress.findUnique({
    where: {
      user_id_lesson_id: {
        user_id,
        lesson_id
      }
    },
    select: { max_watch_time: true }
  });
  const newMaxWatchTime = max_watch_time !== undefined 
    ? Math.max(max_watch_time, currentProgress?.max_watch_time || 0)
    : Math.max(last_watch_time, currentProgress?.max_watch_time || 0);

  return prisma.lessonProgress.upsert({
    where: {
      user_id_lesson_id: {
        user_id,
        lesson_id
      }
    },
    update: {
      last_watch_time,
      max_watch_time: newMaxWatchTime
    },
    create: {
      user_id,
      lesson_id,
      last_watch_time,
      max_watch_time: newMaxWatchTime,
      is_completed: false
    }
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
