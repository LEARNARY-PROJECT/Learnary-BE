import { Request, Response } from 'express';
import * as GroupService from '../services/group.service';
import { GroupType } from '../generated/prisma';

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, type, discount } = req.body;

    if (!name || !description || discount === undefined) {
      return res.status(400).json({ error: 'name, description, and discount are required' });
    }

    const group = await GroupService.createGroup({ name, description, type, discount });
    return res.status(201).json(group);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await GroupService.getAllGroups();
    return res.json(groups);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const group = await GroupService.getGroupById(id);
    return res.json(group);
  } catch (error) {
    const err = error as Error;
    if (err.message === 'Group not found') {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
};

export const getGroupsByType = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    
    if (!Object.values(GroupType).includes(type as GroupType)) {
      return res.status(400).json({ error: 'Invalid group type' });
    }

    const groups = await GroupService.getGroupsByType(type as GroupType);
    return res.json(groups);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, type, discount } = req.body;

    const group = await GroupService.updateGroup(id, { name, description, type, discount });
    return res.json(group);
  } catch (error) {
    const err = error as Error;
    if (err.message === 'Group not found') {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await GroupService.deleteGroup(id);
    return res.status(204).send();
  } catch (error) {
    const err = error as Error;
    if (err.message === 'Group not found') {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
};
