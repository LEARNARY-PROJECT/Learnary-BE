import { Request, Response } from "express";
import * as LeanrerCoursesService from "../services/learnerCourses.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const leanrerCourse = await LeanrerCoursesService.createLeanrerCourse(req.body);
    res.status(201).json(success(leanrerCourse, "LeanrerCourse created successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to create leanrerCourse", err.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const leanrerCourse = await LeanrerCoursesService.getLeanrerCourseById(req.params.id);
    if (!leanrerCourse) {
      res.status(404).json(failure("LeanrerCourse not found"));
      return;
    }
    res.json(success(leanrerCourse, "LeanrerCourse fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch leanrerCourse", err.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const leanrerCourses = await LeanrerCoursesService.getAllLeanrerCourses();
    res.json(success(leanrerCourses, "All leanrerCourses fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch leanrerCourses", err.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await LeanrerCoursesService.updateLeanrerCourse(req.params.id, req.body);
    res.json(success(updated, "LeanrerCourse updated successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to update leanrerCourse", err.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await LeanrerCoursesService.deleteLeanrerCourse(req.params.id);
    res.json(success(null, "LeanrerCourse deleted successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete leanrerCourse", err.message));
  }
};
