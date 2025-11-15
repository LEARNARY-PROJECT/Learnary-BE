import { Request, Response } from "express";
import * as InstructorService from "../services/instructor.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const instructor = await InstructorService.createInstructor(req.body);
    res.status(201).json(success(instructor, "Instructor created successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to create instructor", err.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const instructor = await InstructorService.getInstructorById(req.params.id);
    if (!instructor) res.status(404).json(failure("Instructor not found"));
    res.json(success(instructor, "Instructor fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch instructor", err.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const instructors = await InstructorService.getAllInstructors();
    res.json(success(instructors, "All instructors fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch instructors", err.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await InstructorService.updateInstructor(req.params.id, req.body);
    res.json(success(updated, "Instructor updated successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to update instructor", err.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await InstructorService.deleteInstructor(req.params.id);
    res.json(success(null, "Instructor deleted successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete instructor", err.message));
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const verified = await InstructorService.verifyInstructor(req.params.id);
    res.json(success(verified, "Instructor verified successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to verify instructor", err.message));
  }
};

export const getByUserId = async (req: Request, res: Response) => {
  try {
    const instructor = await InstructorService.getInstructorByUserId(req.params.userId);
    if (!instructor) {
      res.status(404).json(failure("Instructor not found"));
      return;
    }
    res.json(success(instructor, "Instructor fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch instructor", err.message));
  }
};
