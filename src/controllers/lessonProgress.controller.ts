import { Request, Response } from "express";
import * as LessonProgressService from "../services/lessonProgress.service";
import * as ChapterProgressService from "../services/chapterProgress.service";
import { success, failure } from "../utils/response";
import prisma from "../lib/client";

export const markComplete = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    const { lesson_id } = req.body;

    if (!user_id) {
      return res.status(401).json(failure("Unauthorized"));
    }

    if (!lesson_id) {
      return res.status(400).json(failure("lesson_id is required"));
    }

    const progress = await LessonProgressService.markLessonComplete(user_id, lesson_id);

    // tự động check xem chapter đã hoàn thành chưa
    const lesson = await prisma.lesson.findUnique({
      where: { lesson_id },
      select: { chapter_id: true }
    });

    if (lesson) {
      await ChapterProgressService.autoCheckChapterCompletion(user_id, lesson.chapter_id);
    }

    res.json(success(progress, "Lesson marked as completed"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to mark lesson complete", e.message));
  }
};

export const markIncomplete = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    const { lesson_id } = req.body;

    if (!user_id) {
      return res.status(401).json(failure("Unauthorized"));
    }

    if (!lesson_id) {
      return res.status(400).json(failure("lesson_id is required"));
    }

    const progress = await LessonProgressService.markLessonIncomplete(user_id, lesson_id);
    res.json(success(progress, "Lesson marked as incomplete"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to mark lesson incomplete", e.message));
  }
};

export const getProgress = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    const { lesson_id } = req.params;

    if (!user_id) {
      return res.status(401).json(failure("Unauthorized"));
    }

    const progress = await LessonProgressService.getLessonProgress(user_id, lesson_id);
    res.json(success(progress, "Lesson progress fetched"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch lesson progress", e.message));
  }
};

export const getMyProgress = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;

    if (!user_id) {
      return res.status(401).json(failure("Unauthorized"));
    }

    const progress = await LessonProgressService.getUserLessonProgress(user_id);
    res.json(success(progress, "User lesson progress fetched"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch user progress", e.message));
  }
};

export const getCourseProgress = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    const { course_id } = req.params;

    if (!user_id) {
      return res.status(401).json(failure("Unauthorized"));
    }

    const progress = await LessonProgressService.getCourseProgressByUser(user_id, course_id);
    res.json(success(progress, "Course progress fetched"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch course progress", e.message));
  }
};

export const updateWatchTime = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    const { lesson_id, last_watch_time, max_watch_time } = req.body;
    if (!user_id) {
      return res.status(401).json(failure("Unauthorized"));
    }

    if (!lesson_id) {
      return res.status(400).json(failure("lesson_id is required"));
    }

    if (last_watch_time === undefined) {
      return res.status(400).json(failure("last_watch_time is required"));
    }

    const progress = await LessonProgressService.updateLessonWatchTime(
      user_id, 
      lesson_id, 
      last_watch_time, 
      max_watch_time
    );

    res.json(success(progress, "Watch time updated"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to update watch time", e.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    const { lesson_id } = req.params;

    if (!user_id) {
      return res.status(401).json(failure("Unauthorized"));
    }

    await LessonProgressService.deleteLessonProgress(user_id, lesson_id);
    res.json(success(null, "Lesson progress deleted"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to delete lesson progress", e.message));
  }
};
