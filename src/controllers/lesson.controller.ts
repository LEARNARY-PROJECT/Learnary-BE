import { Request, Response } from "express";
import * as LessonService from "../services/lesson.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const videoFile = req.file as Express.Multer.File | undefined;
    const lesson = await LessonService.createLesson(req.body, videoFile);
    res.status(201).json(success(lesson, "Lesson created successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to create lesson", e.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const lesson = await LessonService.getLessonById(req.params.id);
    if (!lesson) {
      res.status(404).json(failure("Lesson not found"));
      return;
    }
    res.json(success(lesson, "Lesson fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch lesson", e.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const lessons = await LessonService.getAllLessons();
    res.json(success(lessons, "All lessons fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch lessons", e.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const videoFile = req.file as Express.Multer.File | undefined;
    const updated = await LessonService.updateLesson(req.params.id, req.body, videoFile);
    res.json(success(updated, "Lesson updated successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to update lesson", e.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await LessonService.deleteLesson(req.params.id);
    res.json(success(null, "Lesson deleted successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to delete lesson", e.message));
  }
};
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const updated = await LessonService.deleteLessonVideo(req.params.id);
    res.json(success(updated, "Video deleted successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to delete video", e.message));
  }
};

