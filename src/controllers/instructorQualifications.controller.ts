import { Request, Response } from "express";
import * as InstructorQualificationsService from "../services/instructorQualifications.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const instructorQualifications = await InstructorQualificationsService.createInstructorQualifications(req.body);
    res.status(201).json(success(instructorQualifications, "InstructorQualifications created successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to create instructorQualifications", err.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const instructorQualifications = await InstructorQualificationsService.getInstructorQualificationsById(req.params.id);
    if (!instructorQualifications) {
      res.status(404).json(failure("InstructorQualifications not found"));
      return;
    }
    res.json(success(instructorQualifications, "InstructorQualifications fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch instructorQualifications", err.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const instructorQualifications = await InstructorQualificationsService.getAllInstructorQualifications();
    res.json(success(instructorQualifications, "All instructorQualifications fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch instructorQualifications", err.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await InstructorQualificationsService.updateInstructorQualifications(req.params.id, req.body);
    res.json(success(updated, "InstructorQualifications updated successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to update instructorQualifications", err.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await InstructorQualificationsService.deleteInstructorQualifications(req.params.id);
    res.json(success(null, "InstructorQualifications deleted successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete instructorQualifications", err.message));
  }
};
