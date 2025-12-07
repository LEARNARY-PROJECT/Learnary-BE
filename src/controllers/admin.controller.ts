import { Request, Response } from "express";
import * as AdminService from "../services/admin.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const {email,password,fullName,admin_role_id_req} = req.body
    const NewAdmin = await AdminService.createAdmin(email,password,fullName,admin_role_id_req);
    res.status(201).json(success(NewAdmin, "Admin created successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to create admin", e.message));
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
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch admin", e.message));
  }
};
export const getAdminByUserId = async (req: Request,res:Response) => {
  try {
    const userId = req.params.id;
    if(!userId) {
      res.status(500).json(failure("Missing field userId required"));
      return;
    }
    const admin = await AdminService.getAdminIdByUserId(userId)
    if(!admin) {
      res.status(504).json(failure("Not found admin with this user_id"));
      return;
    }
    res.json(success(admin,"Admin fetched successfully"));
  } catch (error) {
    const e = error as Error;
    res.status(500).json(failure("Failed to fetch admin", e.message));
  }
}
export const getAll = async (_: Request, res: Response) => {
  try {
    const admins = await AdminService.getAllAdmins();
    res.json(success(admins, "All admins fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch admins", e.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await AdminService.updateAdmin(req.params.id, req.body);
    res.json(success(updated, "Admin updated successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to update admin", e.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await AdminService.deleteAdmin(req.params.id);
    res.json(success(null, "Admin deleted successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to delete admin", e.message));
  }
};
