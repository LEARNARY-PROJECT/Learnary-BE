import prisma from "../lib/client";

export const markChapterComplete = async (user_id: string, chapter_id: string) => {
  return prisma.chapterProgress.upsert({
    where: {
      user_id_chapter_id: {
        user_id,
        chapter_id
      }
    },
    update: {
      is_completed: true,
      completed_at: new Date()
    },
    create: {
      user_id,
      chapter_id,
      is_completed: true,
      completed_at: new Date()
    }
  });
};

export const markChapterIncomplete = async (user_id: string, chapter_id: string) => {
  return prisma.chapterProgress.upsert({
    where: {
      user_id_chapter_id: {
        user_id,
        chapter_id
      }
    },
    update: {
      is_completed: false,
      completed_at: null
    },
    create: {
      user_id,
      chapter_id,
      is_completed: false,
      completed_at: null
    }
  });
};

export const getChapterProgress = async (user_id: string, chapter_id: string) => {
  return prisma.chapterProgress.findUnique({
    where: {
      user_id_chapter_id: {
        user_id,
        chapter_id
      } 
    },
    include: {
      chapter: {
        select: {
          chapter_id: true,
          chapter_title: true,
          order_index: true,
          course_id: true
        }
      }
    }
  });
};

export const getUserChapterProgress = async (user_id: string) => {
  return prisma.chapterProgress.findMany({
    where: { user_id },
    include: {
      chapter: {
        select: {
          chapter_id: true,
          chapter_title: true,
          order_index: true,
          course_id: true,
          belongCourse: {
            select: {
              course_id: true,
              title: true,
              thumbnail: true
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

export const getCourseChapterProgress = async (user_id: string, course_id: string) => {
  return prisma.chapterProgress.findMany({
    where: {
      user_id,
      chapter: {
        course_id
      }
    },
    include: {
      chapter: {
        select: {
          chapter_id: true,
          chapter_title: true,
          order_index: true
        }
      }
    },
    orderBy: {
      chapter: {
        order_index: 'asc'
      }
    }
  });
};

export const autoCheckChapterCompletion = async (user_id: string, chapter_id: string) => {
  const lessons = await prisma.lesson.findMany({
    where: { chapter_id }
  });
  const completedLessons = await prisma.lessonProgress.findMany({
    where: {
      user_id,
      lesson_id: { in: lessons.map(l => l.lesson_id) },
      is_completed: true
    }
  });
  if (lessons.length > 0 && completedLessons.length === lessons.length) {
    return markChapterComplete(user_id, chapter_id);
  }
  return null;
};

export const deleteChapterProgress = async (user_id: string, chapter_id: string) => {
  return prisma.chapterProgress.delete({
    where: {
      user_id_chapter_id: {
        user_id,
        chapter_id
      }
    }
  });
};
