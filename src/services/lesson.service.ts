import prisma from "../lib/client";
import { Lesson } from '../generated/prisma'
import { uploadTemporaryVideo, uploadPermanentVideo, updateVideo, deleteVideo } from "./videoLesson.service";

export const createLesson = async (
  data: Omit<Lesson, 'lesson_id' | 'createAt' | 'updatedAt' | 'video_url'>,
  videoFile?: Express.Multer.File,
  duration?:string
): Promise<Lesson> => {
  let videoUrl: string | null = null;
  const lesson = await prisma.lesson.create({ 
    data: {
      ...data,
      video_url: null, 
    }
  });

  if (videoFile) {
    try {
      const chapter = await prisma.chapter.findUnique({
        where: { chapter_id: data.chapter_id },
        include: { belongCourse: true }
      });
      const isApproved = chapter?.belongCourse?.status === 'Published';
      videoUrl = isApproved ? await uploadPermanentVideo(lesson.lesson_id, videoFile) : await uploadTemporaryVideo(lesson.lesson_id, videoFile);
      return prisma.lesson.update({
        where: { lesson_id: lesson.lesson_id },
        data: { 
          video_url: videoUrl,
          duration: duration
        }
      });
    } catch (error) {
      // nếu upload lỗi xoá luôn lesson đó
      await prisma.lesson.delete({ where: { lesson_id: lesson.lesson_id } });
      throw error;
    }
  }
  return lesson;
};

export const getLessonById = async (lesson_id: string): Promise<Lesson | null> => {
  return prisma.lesson.findUnique({ where: { lesson_id } });
};

export const getAllLessons = async (): Promise<Lesson[]> => {
  return prisma.lesson.findMany();
};

export const updateLesson = async (
  lesson_id: string, 
  data: Partial<Omit<Lesson, 'lesson_id' | 'createAt' | 'updatedAt' | 'video_url'>>,
  videoFile?: Express.Multer.File,
  duration?: number
): Promise<Lesson> => {
  const lesson = await prisma.lesson.findUnique({ 
    where: { lesson_id },
    include: {
      belongChapter: {
        include: { belongCourse: true }
      }
    }
  });

  if (!lesson) {
    throw new Error('Lesson not found');
  }
  if (duration !== undefined) {
    data.duration = duration.toString();
  }
  if (videoFile) {
    const isApproved = lesson.belongChapter.belongCourse.status === 'Published';
    const newVideoUrl = await updateVideo(
      lesson_id, 
      lesson.video_url, 
      videoFile, 
      !isApproved
    );
    return prisma.lesson.update({ 
      where: { lesson_id }, 
      data: {
        ...data,
        video_url: newVideoUrl
      }
    });
  }

  return prisma.lesson.update({ where: { lesson_id }, data });
};

export const deleteLesson = async (lesson_id: string): Promise<Lesson> => {
  const lesson = await prisma.lesson.findUnique({ where: { lesson_id } });
  if (!lesson) {
    throw new Error('Lesson not found');
  }
  if (lesson.video_url) {
    await deleteVideo(lesson.video_url);
  }

  return prisma.lesson.delete({ where: { lesson_id } });
};
export const deleteLessonVideo = async (lesson_id: string): Promise<Lesson> => {
  const lesson = await prisma.lesson.findUnique({ where: { lesson_id } });
  if (!lesson) {
    throw new Error('Lesson not found');
  }
  if (!lesson.video_url) {
    throw new Error('Lesson has no video');
  }
  await deleteVideo(lesson.video_url);
  return prisma.lesson.update({
    where: { lesson_id },
    data: { video_url: null }
  });
};
