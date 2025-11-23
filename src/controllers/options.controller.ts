import { Request, Response } from "express";
import * as optionsService from "../services/options.service";

export const createOption = async (req: Request, res: Response): Promise<void> => {
  try {
    const option = await optionsService.createOption(req.body);
    res.status(201).json(option);
    } catch (error) {
      const e = error as Error;
      res.status(400).json({ error: e.message });
    }
};

export const getOptionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const option = await optionsService.getOptionById(req.params.id);
    if (!option) {
      res.status(404).json({ error: "Option not found" });
      return;
    }
    res.json(option);
    } catch (error) {
      const e = error as Error;
      res.status(500).json({ error: e.message });
    }
};

export const getAllOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const options = await optionsService.getAllOptions();
    res.json(options);
    } catch (error) {
      const e = error as Error;
      res.status(500).json({ error: e.message });
    }
};

export const updateOption = async (req: Request, res: Response): Promise<void> => {
  try {
    const option = await optionsService.updateOption(req.params.id, req.body);
    res.json(option);
    } catch (error) {
      const e = error as Error;
      res.status(400).json({ error: e.message });
    }
};

export const deleteOption = async (req: Request, res: Response): Promise<void> => {
  try {
    await optionsService.deleteOption(req.params.id);
    res.status(204).send();
    } catch (error) {
      const e = error as Error;
      res.status(500).json({ error: e.message });
    }
};