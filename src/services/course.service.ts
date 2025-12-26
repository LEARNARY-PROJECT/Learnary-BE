import { Instructor } from './../generated/prisma/index.d';
import prisma from "../lib/client";
import { Course, CourseStatus } from '../generated/prisma'
import { moveVideosToPermanent, deleteVideos } from './videoLesson.service';
import type { CourseCreateDto, ChapterDto, LessonDto, QuizDto, QuestionDto, OptionDto } from '../types/course';
import { CreateSlug, checkExistingSlug } from "../utils/slug";
import { sliceHalfId } from "../utils/commons";
import path from "path";
import { S3_BUCKET_NAME, s3Client } from "../config/s3.config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getInstructorByUserId } from './instructor.service';
export const getCourseBySlug = async (slugs: string): Promise<Course> => {
  if (!slugs) throw new Error('Không tìm thấy slug truyền vào!')
  const course = await prisma.course.findFirst({
    where: {
      slug: slugs
    },
    include: {
      category: true,
      level: true,
      instructor: {
        include: {
          user: true,
        }
      },
      chapter: {
        include: {
          lessons: true,
          quiz: {
            include: {
              questions: {
                include: {
                  options: true,
                  answers: true,
                }
              },
              submissions: true
            }
          },
        }
      },
      feedbacks:true,
      learnerCourses:true,
    }
  })
  if (!course) throw new Error('Không tìm thấy khóa học với slug này!')
  return course;
}
const getInstructorId = async (userId: string): Promise<string> => {
  const instructor = await prisma.instructor.findUnique({
    where: { user_id: userId },
  });
  if (!instructor) {
    throw new Error('Tài khoản này chưa đăng ký làm Giảng viên.');
  }
  return instructor.instructor_id;
};

export const getAllCourses = async () => {
  return prisma.course.findMany({
    include: {
      instructor: {
        include: {
          user: {
            select: {
              fullName: true,
              avatar: true,
              email: true
            }
          }
        }
      },
      chapter: {
        include: { lessons: true }
      },
      feedbacks: true,
      // Lấy tên Danh mục
      category: true,

      // Đếm số lượng học viên đã tham gia
      _count: {
        select: { learnerCourses: true }
      }
    },

    orderBy: {
      createdAt: 'desc' // Khóa học mới nhất lên đầu
    }
  });
};

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
    include: {
      _count: {
        select: { chapter: true }
      },
      level: true
    },
  });
};

export const deleteCourse = async (course_id: string) => {
  const course = await prisma.course.findUnique({
    where: { course_id },
    include: {
      chapter: {
        include: {
          lessons: { select: { video_url: true } }
        }
      }
    }
  });
  if (!course) {
    throw new Error('Course not found');
  }
  const videoUrls: string[] = [];
  course.chapter.forEach(chapter => {
    chapter.lessons.forEach(lesson => {
      if (lesson.video_url) {
        videoUrls.push(lesson.video_url);
      }
    });
  });
  if (videoUrls.length > 0) {
    await deleteVideos(videoUrls);
  }
  return prisma.course.delete({ where: { course_id } });
};

export const createDraftCourse = async (
  userId: string,
  data: CourseCreateDto,
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
  const cleanData = {
    instructor_id: realInstructorId.trim(),
    category_id: data.category_id.trim(),
    level_id: data.level_id.trim(),
    title: data.title.trim(),
    requirement: data.requirement.trim(),
    description: data.description.trim(),
    thumbnail: data.thumbnail.trim(),
    price: data.price,
    slug: CreateSlug(data.title),
    status: CourseStatus.Draft.trim(),
    chapter: {
      create: (data.chapter as ChapterDto[]).map((chapter: ChapterDto) => ({
        chapter_title: chapter.chapter_title,
        lessons: chapter.lessons
          ? {
            create: chapter.lessons.map((lesson) => ({
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
                create: (chapter.quiz?.questions || []).map((question) => ({
                  title: question.title,
                  options: {
                    create: (question.options || []).map((option) => ({
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
  }
  if (await checkExistingSlug(cleanData.slug) == true) {
    throw new Error('Slug của khoá học này đã tồn tại, vui lòng chọn tên khác!');
  }
  return await prisma.course.create({
    data: {
      instructor_id: realInstructorId,
      category_id: cleanData.category_id,
      level_id: cleanData.level_id,
      title: cleanData.title,
      requirement: cleanData.requirement,
      description: cleanData.description,
      thumbnail: cleanData.thumbnail,
      price: cleanData.price,
      slug: cleanData.slug,
      status: CourseStatus.Draft,
      chapter: {
        create: (data.chapter as ChapterDto[]).map((chapter: ChapterDto) => ({
          chapter_title: chapter.chapter_title,
          lessons: chapter.lessons
            ? {
              create: chapter.lessons.map((lesson) => ({
                title: lesson.title,
                duration: lesson.duration || '00:00',
                slug: CreateSlug(lesson.title)
              })),
            }
            : undefined,
          quiz: chapter.quiz
            ? {
              create: {
                title: chapter.quiz.title,
                slug: chapter.quiz.title.toLowerCase().replace(/\s+/g, '-'),
                questions: {
                  create: (chapter.quiz?.questions || []).map((question) => ({
                    title: question.title,
                    options: {
                      create: (question.options || []).map((option) => ({
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
}

export const updateDraftCourse = async (
  courseId: string,
  userId: string,
  data: CourseCreateDto,
) => {
  const instructorId = await getInstructorId(userId);
  const course = await prisma.course.findFirst({
    where: { course_id: courseId, instructor_id: instructorId },
  });

  if (!course) throw new Error('Khóa học không tồn tại.');

  // Nếu Published chỉ cho phép cập nhật giá
  if (course.status === CourseStatus.Published) {
    return await prisma.course.update({
      where: { course_id: courseId },
      data: { price: data.price },
    });
  }

  // Nếu Draft thì giữ logic cũ
  if (course.status !== CourseStatus.Draft) {
    throw new Error('Khóa học này đã được gửi duyệt, không thể lưu nháp.');
  }

  const hasVideo = (data.chapter || []).some((c) => c.lessons?.some((l) => l.video_url && l.video_url.length > 0));

  if (hasVideo) {
    throw new Error('Không thể lưu nháp khi đã có video. Vui lòng Gửi phê duyệt.');
  }

  return await prisma.$transaction(async (tx) => {
    await tx.chapter.deleteMany({ where: { course_id: courseId } });

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
          create: (data.chapter || []).map((chapter) => ({
            chapter_title: chapter.chapter_title,
            lessons: chapter.lessons
              ? {
                create: chapter.lessons.map((lesson) => ({
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
                    create: (chapter.quiz?.questions || []).map((question) => ({
                      title: question.title,
                      options: {
                        create: (question.options || []).map((option) => ({
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
  data: CourseCreateDto,
) => {
  const instructorId = await getInstructorId(userId);
  const course = await prisma.course.findFirst({
    where: { course_id: courseId, instructor_id: instructorId },
  });
  if (!course) throw new Error('Khóa học không tồn tại.');
  // Cho phép gửi duyệt lại nếu là Draft hoặc Archived (bị từ chối)
  if (course.status !== CourseStatus.Draft && course.status !== CourseStatus.Archived) {
    throw new Error('Khóa học này đã được gửi duyệt.');
  }
  const allChaptersHaveLessons = (data.chapter || []).every((c) => c.lessons && c.lessons.length > 0);
  if (!allChaptersHaveLessons) {
    throw new Error('Mỗi chương phải có ít nhất 1 bài học.');
  }

  const allLessonsHaveVideo = (data.chapter || []).every((c) =>
    (c.lessons || []).every((l) => {
      const hasVideo = l.video_url && l.video_url.trim() !== '';
      return hasVideo;
    })
  );

  if (!allLessonsHaveVideo) {
    throw new Error('Tất cả các bài học đã tạo phải có video mới được gửi duyệt.');
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.chapter.deleteMany({ where: { course_id: courseId } });
      await tx.course.update({
        where: { course_id: courseId },
        data: {
          title: data.title.trim(),
          description: data.description?.trim(),
          requirement: data.requirement?.trim(),
          price: data.price,
          category_id: data.category_id?.trim(),
          level_id: data.level_id?.trim(),
          slug: CreateSlug(data.title.trim()),
          chapter: {
            create: (data.chapter || []).map((chapter, chapterIndex) => ({
              chapter_title: chapter.chapter_title.trim(),
              order_index: chapterIndex,
              lessons: chapter.lessons ? {
                create: chapter.lessons.map((lesson, lessonIndex) => ({
                  title: lesson.title.trim(),
                  duration: (lesson.duration || '00:00').trim(),
                  slug: lesson.title.trim().toLowerCase().replace(/\s+/g, '-'),
                  video_url: lesson.video_url?.trim(),
                  order_index: lessonIndex,
                }))
              } : undefined,
              quiz: chapter.quiz
                ? {
                  create: {
                    title: chapter.quiz.title.trim(),
                    slug: chapter.quiz.title.trim().toLowerCase().replace(/\s+/g, '-'),
                    questions: {
                      create: (chapter.quiz?.questions || [])
                        .filter(q => q.title && q.title.trim() !== '')
                        .map((question, questionIndex) => ({
                          title: question.title.trim(),
                          order_index: questionIndex,
                          options: {
                            create: (question.options || []).map((option, optionIndex) => ({
                              option_content: option.option_content.trim(),
                              is_correct: option.is_correct,
                              order_index: optionIndex,
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
  } catch (error) {
    console.error('=== TRANSACTION ERROR ===');
    console.error(error);
    throw error;
  }

  return await prisma.course.update({
    where: { course_id: courseId },
    data: { status: CourseStatus.Pending, admin_note: null }, // reset admin_note khi gửi duyệt lại
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

export const approveCourse = async (courseId: string) => {
  const course = await prisma.course.findUnique({
    where: { course_id: courseId, status: CourseStatus.Pending },
    include: {
      chapter: {
        include: {
          lessons: { select: { lesson_id: true, video_url: true } }
        }
      }
    }
  });

  if (!course) {
    throw new Error('Course not found or not pending');
  }

  const videoUpdates: { lessonId: string; oldUrl: string }[] = [];
  course.chapter.forEach(chapter => {
    chapter.lessons.forEach(lesson => {
      if (lesson.video_url && lesson.video_url.includes('temporary_videos')) {
        videoUpdates.push({
          lessonId: lesson.lesson_id,
          oldUrl: lesson.video_url
        });
      }
    });
  });

  // chuyển url video tạm cũ thành url video chính
  const temporaryUrls = videoUpdates.map(u => u.oldUrl);
  let newUrls: string[] = [];
  if (temporaryUrls.length > 0) {
    newUrls = await moveVideosToPermanent(temporaryUrls);
  }

  // cập nhật lại thông tin khác của course
  return prisma.$transaction(async (tx) => {
    const updatedCourse = await tx.course.update({
      where: { course_id: courseId },
      data: { status: CourseStatus.Published },
    });

    // cập nhật lại url mới vào db
    for (let i = 0; i < videoUpdates.length; i++) {
      await tx.lesson.update({
        where: { lesson_id: videoUpdates[i].lessonId },
        data: { video_url: newUrls[i] }
      });
    }
    return updatedCourse;
  });
};

export const rejectCourse = async (courseId: string, reason: string) => {
  const course = await prisma.course.findUnique({
    where: { course_id: courseId, status: CourseStatus.Pending },
    include: {
      chapter: {
        include: {
          lessons: { select: { lesson_id: true, video_url: true } }
        }
      }
    }
  });

  if (!course) {
    throw new Error('Course not found or not pending');
  }

  const videoUrls: string[] = [];
  const lessonIds: string[] = [];
  course.chapter.forEach(chapter => {
    chapter.lessons.forEach(lesson => {
      if (lesson.video_url && lesson.video_url.includes('temporary_videos')) {
        videoUrls.push(lesson.video_url);
        lessonIds.push(lesson.lesson_id);
      }
    });
  });
  if (videoUrls.length > 0) {
    await deleteVideos(videoUrls);
  }
  return prisma.$transaction(async (tx) => {
    const updatedCourse = await tx.course.update({
      where: { course_id: courseId },
      data: { status: CourseStatus.Archived, admin_note: reason },
    });
    for (const lessonId of lessonIds) {
      await tx.lesson.update({
        where: { lesson_id: lessonId },
        data: { video_url: null }
      });
    }
    return updatedCourse;
  });
};
export const updateThumbnail = async (
  courseId: string,
  userId: string,
  thumbnailUrl: string,
) => {
  const instructorId = await getInstructorByUserId(userId);
  if (!instructorId) {
    throw new Error("Can not find instructor id with this user id")
  }
  const course = await getCourseById(courseId);
  if (!course) {
    throw new Error("Can not find course!")
  }
  return prisma.course.update({
    where: {
      course_id: courseId,
    },
    data: {
      thumbnail: thumbnailUrl
    }
  })
}
export const uploadNewThumbnailToS3 = async (userId: string, courseId: string, file: Express.Multer.File | undefined) => {
  if (!courseId || !file) {
    throw new Error("Missing course id or file!")
  }
  const maxSize = 10 * 1024 * 1024 //10mb
  const allowedType = ["image/jpg", "image/png"]
  if (file.size > maxSize) {
    throw new Error("File is not fit with required (>10MB)")
  }
  if (!allowedType.includes(file.mimetype)) {
    throw new Error("File is not fit with required (ext file)")
  }
  const halfCourseId = sliceHalfId(courseId);
  const fileExtension = path.extname(file.originalname).trim()
  const fileName = `${halfCourseId}`
  const s3Key = `thumbnail/${fileName}${fileExtension}`
  try {
    const uploadThumbnailParams = {
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype
    }
    await s3Client.send(new PutObjectCommand(uploadThumbnailParams))
    const thumbnailUrl = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`
    const updatedThumbnail = await updateThumbnail(courseId, userId, thumbnailUrl);
    return updatedThumbnail;
  } catch (error) {
    throw new Error("Error while compare URL thumbnail")
  }
}