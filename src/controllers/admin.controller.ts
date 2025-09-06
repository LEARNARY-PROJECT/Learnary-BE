import { Request, Response } from "express";
import * as AdminService from "../services/admin.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const admin = await AdminService.createAdmin(req.body);
    res.status(201).json(success(admin, "Admin created successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to create admin", err.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const admin = await AdminService.getAdminById(req.params.id);
    if (!admin) {
      res.status(404).json(failure("Admin not found"));
      return;
    }
    res.json(success(admin, "Admin fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch admin", err.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const admins = await AdminService.getAllAdmins();
    res.json(success(admins, "All admins fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch admins", err.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await AdminService.updateAdmin(req.params.id, req.body);
    res.json(success(updated, "Admin updated successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to update admin", err.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await AdminService.deleteAdmin(req.params.id);
    res.json(success(null, "Admin deleted successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete admin", err.message));
  }
};
