import { Request, Response } from "express";
import * as ChapterProgressService from "../services/chapterProgress.service";
import { success, failure } from "../utils/response";

export const markComplete = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    const { chapter_id } = req.body;

    if (!user_id) {
      return res.status(401).json(failure("Unauthorized"));
    }

    if (!chapter_id) {
      return res.status(400).json(failure("chapter_id is required"));
    }

    const progress = await ChapterProgressService.markChapterComplete(user_id, chapter_id);
    res.json(success(progress, "Chapter marked as completed"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to mark chapter complete", e.message));
  }
};

export const markIncomplete = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    const { chapter_id } = req.body;

    if (!user_id) {
      return res.status(401).json(failure("Unauthorized"));
    }

    if (!chapter_id) {
      return res.status(400).json(failure("chapter_id is required"));
    }

    const progress = await ChapterProgressService.markChapterIncomplete(user_id, chapter_id);
    res.json(success(progress, "Chapter marked as incomplete"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to mark chapter incomplete", e.message));
  }
};

export const getProgress = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    const { chapter_id } = req.params;

    if (!user_id) {
      return res.status(401).json(failure("Unauthorized"));
    }

    const progress = await ChapterProgressService.getChapterProgress(user_id, chapter_id);
    res.json(success(progress, "Chapter progress fetched"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch chapter progress", e.message));
  }
};

export const getMyProgress = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;

    if (!user_id) {
      return res.status(401).json(failure("Unauthorized"));
    }

    const progress = await ChapterProgressService.getUserChapterProgress(user_id);
    res.json(success(progress, "User chapter progress fetched"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch user chapter progress", e.message));
  }
};

export const getCourseProgress = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    const { course_id } = req.params;

    if (!user_id) {
      return res.status(401).json(failure("Unauthorized"));
    }

    const progress = await ChapterProgressService.getCourseChapterProgress(user_id, course_id);
    res.json(success(progress, "Course chapter progress fetched"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch course chapter progress", e.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    const { chapter_id } = req.params;

    if (!user_id) {
      return res.status(401).json(failure("Unauthorized"));
    }

    await ChapterProgressService.deleteChapterProgress(user_id, chapter_id);
    res.json(success(null, "Chapter progress deleted"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to delete chapter progress", e.message));
  }
};
