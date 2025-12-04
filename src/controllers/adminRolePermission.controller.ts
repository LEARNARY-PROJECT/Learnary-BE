import { Request, Response } from "express";
import * as AdminRolePermissionService from "../services/adminRolePermission.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const adminRolePermission = await AdminRolePermissionService.createAdminRolePermission(req.body);
    res.status(201).json(success(adminRolePermission, "AdminRolePermission created successfully"));
  } catch (err) {
    const e = err as Error;
    
    if (e.message.includes('Unique constraint failed')) {
      res.status(409).json(failure("Quyền này đã được cấp cho vai trò", e.message));
    } else {
      res.status(500).json(failure("Failed to create adminRolePermission", e.message));
    }
  }
};


export const getById = async (req: Request, res: Response) => {
  try {
    const { permission_id, admin_role_id } = req.params;
    const adminRolePermission = await AdminRolePermissionService.getAdminRolePermissionById(permission_id, admin_role_id);
    if (!adminRolePermission) {
      res.status(404).json(failure("AdminRolePermission not found"));
      return;
    }
    res.json(success(adminRolePermission, "AdminRolePermission fetched successfully"));
    } catch (err) {
      const e = err as Error;
      res.status(500).json(failure("Failed to fetch adminRolePermission", e.message));
    }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const adminRolePermissions = await AdminRolePermissionService.getAllAdminRolePermissions();
    res.json(success(adminRolePermissions, "All adminRolePermissions fetched successfully"));
    } catch (err) {
      const e = err as Error;
      res.status(500).json(failure("Failed to fetch adminRolePermissions", e.message));
    }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { permission_id, admin_role_id } = req.params;
    const updated = await AdminRolePermissionService.updateAdminRolePermission(permission_id, admin_role_id, req.body);
    res.json(success(updated, "AdminRolePermission updated successfully"));
    } catch (err) {
      const e = err as Error;
      res.status(500).json(failure("Failed to update adminRolePermission", e.message));
    }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { permission_id, admin_role_id } = req.params;
    await AdminRolePermissionService.deleteAdminRolePermission(permission_id, admin_role_id);
    res.json(success(null, "AdminRolePermission deleted successfully"));
    } catch (err) {
      const e = err as Error;
      res.status(500).json(failure("Failed to delete adminRolePermission", e.message));
    }
};
