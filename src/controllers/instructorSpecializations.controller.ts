import { Request, Response } from "express";
import * as InstructorSpecializationsService from "../services/instructorSpecializations.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const instructorSpecializations = await InstructorSpecializationsService.createInstructorSpecializations(req.body);
    res.status(201).json(success(instructorSpecializations, "InstructorSpecializations created successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to create instructorSpecializations", err.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const instructorSpecializations = await InstructorSpecializationsService.getInstructorSpecializationsById(req.params.id);
    if (!instructorSpecializations) {
      res.status(404).json(failure("InstructorSpecializations not found"));
      return;
    }
    res.json(success(instructorSpecializations, "InstructorSpecializations fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch instructorSpecializations", err.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const instructorSpecializations = await InstructorSpecializationsService.getAllInstructorSpecializations();
    res.json(success(instructorSpecializations, "All instructorSpecializations fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch instructorSpecializations", err.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await InstructorSpecializationsService.updateInstructorSpecializations(req.params.id, req.body);
    res.json(success(updated, "InstructorSpecializations updated successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to update instructorSpecializations", err.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await InstructorSpecializationsService.deleteInstructorSpecializations(req.params.id);
    res.json(success(null, "InstructorSpecializations deleted successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete instructorSpecializations", err.message));
  }
};
