import { Request, Response } from "express";
import * as LessonService from "../services/lesson.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const lesson = await LessonService.createLesson(req.body);
    res.status(201).json(success(lesson, "Lesson created successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to create lesson", err.message));
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
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch lesson", err.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const lessons = await LessonService.getAllLessons();
    res.json(success(lessons, "All lessons fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch lessons", err.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await LessonService.updateLesson(req.params.id, req.body);
    res.json(success(updated, "Lesson updated successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to update lesson", err.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await LessonService.deleteLesson(req.params.id);
    res.json(success(null, "Lesson deleted successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete lesson", err.message));
  }
};
