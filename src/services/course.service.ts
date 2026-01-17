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
import { sendNoticeCourseApproved, sendNoticeCourseRejected } from './email.service';
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
      category: true,
      level:true,
      _count: {
        select: { learnerCourses: true, feedbacks:true },
      },
    },
    orderBy: {
      createdAt: 'desc' 
    }
  });
};

// Admin cập nhật trạng thái hot cho một khóa học bất kỳ
export const updateCourseHotByAdmin = async (courseId: string, hot: boolean) => {
  const course = await prisma.course.findUnique({ where: { course_id: courseId } });
  if (!course) throw new Error('Course not found');
  return prisma.course.update({
    where: { course_id: courseId },
    data: { hot },
  });
};

export const setTopSellingCoursesHot = async () => {
  // Reset hot=false cho tất cả khóa học
  await prisma.course.updateMany({
    data: { hot: false },
    where: {},
  });
  // Lấy top 10 bán chạy
  const topCourses = await getTopSellingCourses();
  const topIds = topCourses.map(c => c.course_id);
  // Set hot=true cho top 10
  if (topIds.length > 0) {
    await prisma.course.updateMany({
      data: { hot: true },
      where: { course_id: { in: topIds } },
    });
  }
  return { updatedHotIds: topIds };
};

export const getTopSellingCourses = async () => {
  // Lấy các khóa học đã xuất bản, kèm số học viên và số feedback
  const courses = await prisma.course.findMany({
    where: { status: 'Published' },
    include: {
      _count: {
        select: { learnerCourses: true, feedbacks: true },
      },
      feedbacks: true,
    },
  });
  // Tính doanh thu, số học viên, số feedback, và điểm hot
  const coursesWithScore = courses
    .map((course) => {
      const soldCount = course._count.learnerCourses || 0;
      const revenue = Number(course.price) * soldCount;
      const price = Number(course.price);
      // Tính điểm giá
      let priceScore = 0;
      if (price < 10000) priceScore = 0;
      else if (price < 100000) priceScore = 1;
      else if (price < 1000000) priceScore = 3;
      else priceScore = 5;
      // Tính điểm trung bình sao
      let avgRating = 0;
      if (course.feedbacks && course.feedbacks.length > 0) {
        avgRating = course.feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / course.feedbacks.length;
      }
      // Điểm hot = priceScore + avgRating
      const hotScore = priceScore + avgRating;
      return {
        ...course,
        soldCount,
        revenue,
        priceScore,
        avgRating,
        hotScore,
      };
    })
    .filter(c => c !== null);
  // Sắp xếp theo điểm hot giảm dần
  coursesWithScore.sort((a, b) => b.hotScore - a.hotScore);
  // Lấy top 10
  const top10 = coursesWithScore.slice(0, 10);
  return top10;
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
      level: true,
      category:true
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
    sale_off: data.sale_off ?? null,
    hot: data.hot ?? null,
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
      sale_off: cleanData.sale_off,
      hot: cleanData.hot,
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

  // Nếu Published chỉ cho phép cập nhật giá và cấp độ, hot, sale_off
  if (course.status === CourseStatus.Published) {
    return await prisma.course.update({ 
      where: { course_id: courseId },
      data: {
        price: data.price,
        level_id: data.level_id?.trim(),
        sale_off: data.sale_off ?? null,
      },
    });
  }

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
  // Cho phép duyệt nếu là Pending hoặc Archived (bị từ chối trong vòng 3 ngày)
  const course = await prisma.course.findUnique({
    where: { course_id: courseId },
    include: {
      chapter: {
        include: {
          lessons: { select: { lesson_id: true, video_url: true } }
        }
      }
    }
  });

  if (!course) {
    throw new Error('Course not found');
  }

  // Nếu bị từ chối, chỉ cho phép duyệt lại trong 3 ngày kể từ rejectedAt
  if (course.status === 'Archived') {
    if (!course.rejectedAt) throw new Error('Thiếu thông tin thời gian bị từ chối');
    const now = new Date();
    const rejectedAt = new Date(course.rejectedAt);
    const diffMs = now.getTime() - rejectedAt.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays > 3) {
      throw new Error('Khóa học đã bị từ chối quá 3 ngày, không thể duyệt lại.');
    }
  } else if (course.status !== 'Pending') {
    throw new Error('Chỉ có thể duyệt khóa học ở trạng thái chờ duyệt hoặc vừa bị từ chối.');
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
      data: { status: CourseStatus.Published, rejectedAt: null }, // reset rejectedAt khi duyệt lại
    });

    // cập nhật lại url mới vào db
    for (let i = 0; i < videoUpdates.length; i++) {
      await tx.lesson.update({
        where: { lesson_id: videoUpdates[i].lessonId },
        data: { video_url: newUrls[i] }
      });
    }
    const instructor = await tx.instructor.findUnique({
      where: { instructor_id: updatedCourse.instructor_id },
      include: { user: true }
    });
    if (instructor && instructor.user) {
      sendNoticeCourseApproved({
        instructorName: instructor.user.fullName || instructor.user.fullName || 'Giảng viên',
        instructorEmail: instructor.user.email,
        courseName: updatedCourse.title,
        courseDescription: updatedCourse.description || undefined,
        coursePrice: Number(updatedCourse.price),
        approvedAt: new Date()
      }).catch(err => console.error('Email error:', err));
    }
    return updatedCourse;
  });
};

export const rejectCourse = async (courseId: string, reason: string) => {
  const course = await prisma.course.findUnique({
    where: { course_id: courseId, status: CourseStatus.Pending },
    include: {
      instructor: {
        include: {
          user: true
        }
      },
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

/*   const videoUrls: string[] = [];
  const lessonIds: string[] = [];
  course.chapter.forEach(chapter => {
    chapter.lessons.forEach(lesson => {
      if (lesson.video_url && lesson.video_url.includes('temporary_videos')) {
        videoUrls.push(lesson.video_url);
        lessonIds.push(lesson.lesson_id);
      }
    });
  }); */
/*   if (videoUrls.length > 0) {
    await deleteVideos(videoUrls);
  } */
  return prisma.$transaction(async (tx) => {
    const updatedCourse = await tx.course.update({
      where: { course_id: courseId },
      data: { status: CourseStatus.Archived, admin_note: reason, rejectedAt: new Date() },
    });
    /* for (const lessonId of lessonIds) {
      await tx.lesson.update({
        where: { lesson_id: lessonId },
        data: { video_url: null }
      });
    }  */
    if (course.instructor && course.instructor.user) {
      sendNoticeCourseRejected({
        instructorName: course.instructor.user.fullName || 'Giảng viên',
        instructorEmail: course.instructor.user.email,
        courseName: course.title,
        courseDescription: course.description || undefined,
        coursePrice: Number(course.price),
        rejectionReason: reason,
        rejectedAt: new Date()
      }).catch(err => console.error('Error sending course rejection email:', err));
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
  const allowedType = ["image/jpg", "image/png","image/jpeg"]
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
export const autoDeleteRejectedCourseVideos = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const rejectedCourses = await prisma.course.findMany({
      where: {
        status: CourseStatus.Archived,
        rejectedAt: {
          lte: sevenDaysAgo, // rejectedAt nhỏ hơn hoặc bằng 7 ngày trước
          not: null
        }
      },
      include: {
        chapter: {
          include: {
            lessons: {
              select: {
                lesson_id: true,
                video_url: true
              }
            }
          }
        }
      }
    });
    if (rejectedCourses.length === 0) {
      return {
        deletedCoursesCount: 0,
        deletedVideosCount: 0,
        message: 'Không có khóa học nào cần xóa video'
      };
    }
    let totalDeletedVideos = 0;
    const deletedCourses: string[] = [];
    for (const course of rejectedCourses) {
      const videoUrls: string[] = [];
      for (const chapter of course.chapter) {
        for (const lesson of chapter.lessons) {
          if (lesson.video_url) {
            videoUrls.push(lesson.video_url);
          }
        }
      }
      if (videoUrls.length > 0) {
        await deleteVideos(videoUrls);
        totalDeletedVideos += videoUrls.length;
        for (const chapter of course.chapter) {
          for (const lesson of chapter.lessons) {
            if (lesson.video_url) {
              await prisma.lesson.update({
                where: { lesson_id: lesson.lesson_id },
                data: { video_url: null }
              });
            }
          }
        }
        deletedCourses.push(course.title);
      }
    }
    return {
      deletedCoursesCount: deletedCourses.length,
      deletedVideosCount: totalDeletedVideos,
      message: `Đã xóa ${totalDeletedVideos} video từ ${deletedCourses.length} khóa học bị từ chối`,
      courses: deletedCourses
    };
  } catch (error) {
    console.error('Error in autoDeleteRejectedCourseVideos:', error);
    throw new Error('Lỗi khi tự động xóa video khóa học bị từ chối');
  }
}