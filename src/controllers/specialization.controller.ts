import { Request, Response } from "express";
import * as SpecializationService from "../services/specialization.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const specialization = await SpecializationService.createSpecialization(req.body);
    res.status(201).json(success(specialization, "Specialization created successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to create specialization", err.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const specialization = await SpecializationService.getSpecializationById(req.params.id);
    if (!specialization) {
      res.status(404).json(failure("Specialization not found"));
      return;
    }
    res.json(success(specialization, "Specialization fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch specialization", err.message));
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const { is_verified } = req.query;
    const filters: { isVerified?: boolean } = {};
    if (is_verified !== undefined) {
      filters.isVerified = is_verified === 'true';
    }
    
    const specializations = await SpecializationService.getAllSpecializations(filters);
    res.json(success(specializations, "All specializations fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch specializations", err.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await SpecializationService.updateSpecialization(req.params.id, req.body);
    res.json(success(updated, "Specialization updated successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to update specialization", err.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await SpecializationService.deleteSpecialization(req.params.id);
    res.json(success(null, "Specialization deleted successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete specialization", err.message));
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const verified = await SpecializationService.verifySpecialization(req.params.id);
    res.json(success(verified, "Specialization verified successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to verify specialization", err.message));
  }
};

export const getByInstructor = async (req: Request, res: Response) => {
  try {
    const specializations = await SpecializationService.getSpecializationsByInstructor(req.params.instructorId);
    res.json(success(specializations, "Specializations fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch specializations", err.message));
  }
};
