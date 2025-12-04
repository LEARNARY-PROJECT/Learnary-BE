import { Request, Response } from "express";
import * as AdminRoleService from "../services/adminRole.service";
import { success, failure } from "../utils/response";
import { error } from "node:console";

export const create = async (req: Request, res: Response) => {
  try {
    if(!req.body) {
      res.status(500).json(error("Missing field required"));
    } 
    const adminRole = await AdminRoleService.createAdminRole(req.body);
    res.status(201).json(success(adminRole, "AdminRole created successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to create adminRole", e.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const adminRole = await AdminRoleService.getAdminRoleById(req.params.id);
    if (!adminRole) {
      res.status(404).json(failure("AdminRole not found"));
      return;
    }
    res.json(success(adminRole, "AdminRole fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch adminRole", e.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const adminRoles = await AdminRoleService.getAllAdminRoles();
    res.json(success(adminRoles, "All adminRoles fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch adminRoles", e.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await AdminRoleService.updateAdminRole(req.params.id, req.body);
    res.json(success(updated, "AdminRole updated successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to update adminRole", e.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await AdminRoleService.deleteAdminRole(req.params.id);
    res.json(success(null, "AdminRole deleted successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to delete adminRole", e.message));
  }
};
