import { Request, Response } from 'express';
import * as ResourceTypeService from '../services/resourceType.service';

export const createResourceType = async (req: Request, res: Response) => {
  try {
    const { resource_name } = req.body;
    
    if (!resource_name) {
      return res.status(400).json({ error: 'resource_name is required' });
    }

    const resourceType = await ResourceTypeService.createResourceType({ resource_name });
    return res.status(201).json(resourceType);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const getResourceTypeById = async (req: Request, res: Response) => {
  try {
    const { resource_id } = req.params;
    
    const resourceType = await ResourceTypeService.getResourceTypeById(resource_id);
    
    if (!resourceType) {
      return res.status(404).json({ error: 'ResourceType not found' });
    }

    return res.json(resourceType);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const getAllResourceTypes = async (req: Request, res: Response) => {
  try {
    const resourceTypes = await ResourceTypeService.getAllResourceTypes();
    return res.json(resourceTypes);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const updateResourceType = async (req: Request, res: Response) => {
  try {
    const { resource_id } = req.params;
    const { resource_name } = req.body;

    const resourceType = await ResourceTypeService.updateResourceType(resource_id, { resource_name });
    return res.json(resourceType);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const deleteResourceType = async (req: Request, res: Response) => {
  try {
    const { resource_id } = req.params;
    
    await ResourceTypeService.deleteResourceType(resource_id);
    return res.status(204).send();
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};
