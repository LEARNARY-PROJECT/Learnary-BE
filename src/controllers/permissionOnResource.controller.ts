import { Request, Response } from 'express';
import * as PermissionOnResourceService from '../services/permissionOnResource.service';
import { success } from '../utils/response';

export const createPermissionOnResource = async (req: Request, res: Response) => {
  try {
    const { permissionId, resourceTypeId } = req.body;
    
    if (!permissionId || !resourceTypeId) {
      return res.status(400).json({ error: 'permissionId and resourceTypeId are required' });
    }

    const assignment = await PermissionOnResourceService.createPermissionOnResource(permissionId, resourceTypeId);
    return res.status(201).json(assignment);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const getPermissionOnResourceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const assignment = await PermissionOnResourceService.getPermissionOnResourceById(id);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    return res.json(assignment);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const getAllPermissionOnResources = async (req: Request, res: Response) => {
  try {
    const assignments = await PermissionOnResourceService.getAllPermissionOnResources();
    return res.json(assignments);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const getResourcesByPermissionId = async (req: Request, res: Response) => {
  try {
    const { permissionId } = req.params;
    
    const resources = await PermissionOnResourceService.getResourcesByPermissionId(permissionId);
    return res.json(resources);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const getPermissionsByResourceId = async (req: Request, res: Response) => {
  try {
    const { resourceTypeId } = req.params;
    
    const permissions = await PermissionOnResourceService.getPermissionsByResourceId(resourceTypeId);
    return res.json(permissions);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const deletePermissionOnResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await PermissionOnResourceService.deletePermissionOnResource(id);
    return res.status(204).send();
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const deleteByPermissionAndResource = async (req: Request, res: Response) => {
  try {
    const { permissionId, resourceTypeId } = req.body;
    if (!permissionId || !resourceTypeId) {
      return res.status(400).json({ error: 'permissionId and resourceTypeId are required' });
    }
    permissionId.trim()
    resourceTypeId.trim()
    const updated = await PermissionOnResourceService.deleteByPermissionAndResource(permissionId, resourceTypeId);
    return res.json(success(updated,"Delete Resource Success"))
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const assignResourcesToPermission = async (req: Request, res: Response) => {
  try {
    const { permissionId, resourceTypeIds } = req.body;
    
    if (!permissionId || !Array.isArray(resourceTypeIds)) {
      return res.status(400).json({ error: 'permissionId and resourceTypeIds (array) are required' });
    }

    const result = await PermissionOnResourceService.assignResourcesToPermission(permissionId, resourceTypeIds);
    return res.json({ 
      success: true, 
      count: result.count,
      message: `Assigned ${result.count} resources to permission` 
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const assignPermissionsToResource = async (req: Request, res: Response) => {
  try {
    const { resourceTypeId, permissionIds } = req.body;
    
    if (!resourceTypeId || !Array.isArray(permissionIds)) {
      return res.status(400).json({ error: 'resourceTypeId and permissionIds (array) are required' });
    }

    const result = await PermissionOnResourceService.assignPermissionsToResource(resourceTypeId, permissionIds);
    return res.json({ 
      success: true, 
      count: result.count,
      message: `Assigned ${result.count} permissions to resource` 
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};
