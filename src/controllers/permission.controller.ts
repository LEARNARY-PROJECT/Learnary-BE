import { Request, Response } from "express";
import * as PermissionService from "../services/permission.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const permission = await PermissionService.createPermission(req.body);
    res.status(201).json(success(permission, "Permission created successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to create permission", err.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const permission = await PermissionService.getPermissionById(req.params.id);
    if (!permission) {
      res.status(404).json(failure("Permission not found"));
      return;
    }
    res.json(success(permission, "Permission fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch permission", err.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const permissions = await PermissionService.getAllPermissions();
    res.json(success(permissions, "All permissions fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch permissions", err.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await PermissionService.updatePermission(req.params.id, req.body);
    res.json(success(updated, "Permission updated successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to update permission", err.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await PermissionService.deletePermission(req.params.id);
    res.json(success(null, "Permission deleted successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete permission", err.message));
  }
};
