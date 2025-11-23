import { Request, Response } from "express";
import * as LevelService from "../services/level.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const level = await LevelService.createLevel(req.body);
    res.status(201).json(success(level, "Level created successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to create level", e.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const level = await LevelService.getLevelById(req.params.id);
    if (!level) {
      res.status(404).json(failure("Level not found"));
      return;
    }
    res.json(success(level, "Level fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch level", e.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const levels = await LevelService.getAllLevels();
    res.json(success(levels, "All levels fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch levels", e.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await LevelService.updateLevel(req.params.id, req.body);
    res.json(success(updated, "Level updated successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to update level", e.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await LevelService.deleteLevel(req.params.id);
    res.json(success(null, "Level deleted successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to delete level", e.message));
  }
};
