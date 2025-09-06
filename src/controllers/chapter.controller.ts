import { Request, Response } from "express";
import * as ChapterService from "../services/chapter.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const chapter = await ChapterService.createChapter(req.body);
    res.status(201).json(success(chapter, "Chapter created successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to create chapter", err.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const chapter = await ChapterService.getChapterById(req.params.id);
    if (!chapter) {
      res.status(404).json(failure("Chapter not found"));
      return;
    }
    res.json(success(chapter, "Chapter fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch chapter", err.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const chapters = await ChapterService.getAllChapters();
    res.json(success(chapters, "All chapters fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch chapters", err.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await ChapterService.updateChapter(req.params.id, req.body);
    res.json(success(updated, "Chapter updated successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to update chapter", err.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await ChapterService.deleteChapter(req.params.id);
    res.json(success(null, "Chapter deleted successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete chapter", err.message));
  }
};
