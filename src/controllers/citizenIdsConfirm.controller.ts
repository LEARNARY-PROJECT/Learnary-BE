import { Request, Response } from "express";
import * as CitizenIdsConfirmService from "../services/citizenIdsConfirm.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const citizenIdsConfirm = await CitizenIdsConfirmService.createCitizenIdsConfirm(req.body);
    res.status(201).json(success(citizenIdsConfirm, "CitizenIdsConfirm created successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to create citizenIdsConfirm", e.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const citizenIdsConfirm = await CitizenIdsConfirmService.getCitizenIdsConfirmById(req.params.id);
    if (!citizenIdsConfirm) {
      res.status(404).json(failure("CitizenIdsConfirm not found"));
      return;
    }
    res.json(success(citizenIdsConfirm, "CitizenIdsConfirm fetched successfully"));
    } catch (err) {
      const e = err as Error;
      res.status(500).json(failure("Failed to fetch citizenIdsConfirm", e.message));
    }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const citizenIdsConfirms = await CitizenIdsConfirmService.getAllCitizenIdsConfirms();
    res.json(success(citizenIdsConfirms, "All citizenIdsConfirms fetched successfully"));
    } catch (err) {
      const e = err as Error;
      res.status(500).json(failure("Failed to fetch citizenIdsConfirms", e.message));
    }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await CitizenIdsConfirmService.updateCitizenIdsConfirm(req.params.id, req.body);
    res.json(success(updated, "CitizenIdsConfirm updated successfully"));
    } catch (err) {
      const e = err as Error;
      res.status(500).json(failure("Failed to update citizenIdsConfirm", e.message));
    }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await CitizenIdsConfirmService.deleteCitizenIdsConfirm(req.params.id);
    res.json(success(null, "CitizenIdsConfirm deleted successfully"));
    } catch (err) {
      const e = err as Error;
      res.status(500).json(failure("Failed to delete citizenIdsConfirm", e.message));
    }
};
