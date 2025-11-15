import prisma from "../lib/client";
import { CourseStatus } from '@prisma/client';

const getInstructorId = async (userId: string): Promise<string> => {
  const instructor = await prisma.instructor.findUnique({
    where: { user_id: userId },
  });
  if (!instructor) {
    throw new Error('Tài khoản này chưa đăng ký làm Giảng viên.');
  }
  return instructor.instructor_id;
};  

export const getAllCourses = () =>
  prisma.course.findMany({
    where: { status: CourseStatus.Published },
    include: { chapter: true, feedbacks: true }
  });


export const getCourseById = (course_id: string) =>
  prisma.course.findUnique({
    where: { course_id },
    include: {
      instructor: {
        include: {
          user: true,
        },
      },
      category: true,
      level: true,
      chapter: {
        orderBy: { order_index: 'asc' },
        include: {
          lessons: {
            orderBy: { order_index: 'asc' },
          },
          quiz: {
            include: {
              questions: {
                orderBy: { order_index: 'asc' },
                include: {
                  options: { orderBy: { order_index: 'asc' } },
                },
              },
            },
          },
        },
      },
      feedbacks: true,
    },
  });

export const getCoursesByInstructorId = async (userId: string) => {
  const instructor = await prisma.instructor.findUnique({
    where: { user_id: userId },
    select: { instructor_id: true },
  });
  if (!instructor) return [];
  return await prisma.course.findMany({
    where: { instructor_id: instructor.instructor_id },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { chapter: true } } },
  });
};

export const deleteCourse = (course_id: string) =>
  prisma.course.delete({ where: { course_id } });

export const createDraftCourse = async (
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any, 
) => {

  const instructor = await prisma.instructor.findUnique({
    where: { user_id: userId },
  });

  if (!instructor) {
    throw new Error('Tài khoản này chưa đăng ký làm Giảng viên.');
  }

  const realInstructorId = instructor.instructor_id;

  const draftCount = await prisma.course.count({
    where: { instructor_id: realInstructorId, status: CourseStatus.Draft },
  });

  if (draftCount >= 3) {
    throw new Error('Bạn đã đạt giới hạn 3 bản nháp.');
  }
  if (!data.chapter || data.chapter.length === 0) {
    throw new Error('Khóa học phải có ít nhất một chương.');
  }

  return await prisma.course.create({
    data: {
      instructor_id: realInstructorId,
      category_id: data.category_id,
      level_id: data.level_id,
      title: data.title,
      requirement: data.requirement,
      description: data.description,
      thumbnail: data.thumbnail,
      price: data.price,
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      status: CourseStatus.Draft,
      chapter: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        create: data.chapter.map((chapter: any) => ({
          chapter_title: chapter.chapter_title,
          lessons: chapter.lessons
            ? {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                create: chapter.lessons.map((lesson: any) => ({
                  title: lesson.title,
                  duration: lesson.duration || '00:00',
                  slug: lesson.title.toLowerCase().replace(/\s+/g, '-'),
                })),
              }
            : undefined,
          quiz: chapter.quiz
            ? {
                create: {
                  title: chapter.quiz.title,
                  slug: chapter.quiz.title.toLowerCase().replace(/\s+/g, '-'),
                  questions: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    create: chapter.quiz.questions.map((question: any) => ({
                      title: question.title,
                      options: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        create: question.options.map((option: any) => ({
                          option_content: option.option_content,
                          is_correct: option.is_correct,
                        })),
                      },
                    })),
                  },
                },
              }
            : undefined,
        })),
      },
    },
  });
};

export const updateDraftCourse = async (
  courseId: string,
  userId: string,
  data: any,
) => {
  const instructorId = await getInstructorId(userId); 
  console.log("DATA NHẬN ĐƯỢC TỪ FE:", JSON.stringify(data, null, 2));
  const course = await prisma.course.findFirst({
    where: { course_id: courseId, instructor_id: instructorId },
  });

  if (!course) throw new Error('Khóa học không tồn tại.');
  if (course.status !== CourseStatus.Draft) {
    throw new Error('Khóa học này đã được gửi duyệt, không thể lưu nháp.');
  }

  const hasVideo = data.chapter?.some((c: any) => c.lessons?.some((l: any) => l.video_url && l.video_url.length > 0));

  if (hasVideo) {
    throw new Error('Không thể lưu nháp khi đã có video. Vui lòng Gửi phê duyệt.');
  }

  return await prisma.$transaction(async (tx) => {
    await tx.chapter.deleteMany({
      where: { course_id: courseId },
    });
    const updatedCourse = await tx.course.update({
      where: { course_id: courseId },
      data: {
        title: data.title.trim(),
        description: data.description,
        requirement: data.requirement,
        price: data.price,
        category_id: data.category_id.trim(),
        level_id: data.level_id.trim(),
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
        chapter: {
          create: data.chapter.map((chapter: any) => ({
            chapter_title: chapter.chapter_title,
            lessons: chapter.lessons
              ? {
                  create: chapter.lessons.map((lesson: any) => ({
                    title: lesson.title,
                    duration: lesson.duration || '00:00',
                    slug: lesson.title.toLowerCase().replace(/\s+/g, '-'),
                  })),
                }
              : undefined,
            quiz: chapter.quiz
              ? {
                  create: {
                    title: chapter.quiz.title,
                    slug: chapter.quiz.title.toLowerCase().replace(/\s+/g, '-'),
                    questions: {
                      create: chapter.quiz.questions.map((question: any) => ({
                        title: question.title,
                        options: {
                          create: question.options.map((option: any) => ({
                            option_content: option.option_content,
                            is_correct: option.is_correct,
                          })),
                        },
                      })),
                    },
                  },
                }
              : undefined,
          })),
        },
      },
      include: {
        chapter: {
          include: {
            lessons: true,
            quiz: {
              include: { questions: { include: { options: true } } },
            },
          },
        },
      },
    });

    return updatedCourse;
  });
};

export const submitCourseForApproval = async (
  courseId: string,
  userId: string,
  data: any,
) => {
  const instructorId = await getInstructorId(userId);
  const course = await prisma.course.findFirst({
    where: { course_id: courseId, instructor_id: instructorId },
  });

  if (!course) throw new Error('Khóa học không tồn tại.');
  if (course.status !== CourseStatus.Draft) {
    throw new Error('Khóa học này đã được gửi duyệt.');
  }

  const allChaptersHaveLessons = data.chapter.every((c: any) => c.lessons && c.lessons.length > 0);
  if (!allChaptersHaveLessons) {
    throw new Error('Mỗi chương phải có ít nhất 1 bài học.');
  }

  const allLessonsHaveVideo = data.chapter.every((c: any) => 
    c.lessons.every((l: any) => l.video_url && l.video_url.trim() !== '')
  );
  if (!allLessonsHaveVideo) {
    throw new Error('Tất cả các bài học đã tạo phải có video mới được gửi duyệt.');
  }
    
  await prisma.$transaction(async (tx) => {
    await tx.chapter.deleteMany({ where: { course_id: courseId } });
    await tx.course.update({
      where: { course_id: courseId },
      data: {
        title: data.title.trim(),
        description: data.description,
        requirement: data.requirement,
        price: data.price,
        category_id: data.category_id?.trim(),
        level_id: data.level_id?.trim(),
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
        chapter: {
          create: data.chapter.map((chapter: any) => ({
            chapter_title: chapter.chapter_title,
            lessons: chapter.lessons ? {
                create: chapter.lessons.map((lesson: any) => ({
                   title: lesson.title,
                   duration: lesson.duration || '00:00',
                   slug: lesson.title.toLowerCase().replace(/\s+/g, '-'),
                   video_url: lesson.video_url, 
                }))
            } : undefined,
            quiz: chapter.quiz
              ? {
                  create: {
                    title: chapter.quiz.title,
                    slug: chapter.quiz.title.toLowerCase().replace(/\s+/g, '-'),
                    questions: {
                      create: chapter.quiz.questions.map((question: any) => ({
                        title: question.title,
                        options: {
                          create: question.options.map((option: any) => ({
                            option_content: option.option_content,
                            is_correct: option.is_correct,
                          })),
                        },
                      })),
                    },
                  },
                }
              : undefined,
          })),
        },
      },
      include: {
        chapter: {
          include: {
            lessons: true,
            quiz: {
              include: { questions: { include: { options: true } } },
            },
          },
        },
      },
    });
  });

  return await prisma.course.update({
    where: { course_id: courseId },
    data: { status: CourseStatus.Pending },
  });
};

export const getPendingCourses = () =>
  prisma.course.findMany({
    where: { status: CourseStatus.Pending },
    include: {
      instructor: {
        include: {
          user: {
            select: { fullName: true, email: true },
          },
        },
      },
    },
    orderBy: { updatedAt: 'asc' },
  });

export const approveCourse = (courseId: string) =>
  prisma.course.update({
    where: { course_id: courseId, status: CourseStatus.Pending },
    data: { status: CourseStatus.Published },
  });

export const rejectCourse = (courseId: string) =>
  prisma.course.update({
    where: { course_id: courseId, status: CourseStatus.Pending },
    data: { status: CourseStatus.Draft },
  });