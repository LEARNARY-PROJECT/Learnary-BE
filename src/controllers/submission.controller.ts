import { Request, Response } from "express";
import * as submissionService from "../services/submission.service";

export const createSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const submission = await submissionService.createSubmission(req.body);
    res.status(201).json(submission);
  } catch (error) {
    const e = error as Error;
    res.status(400).json({ error: e.message });
  }
};

export const getSubmissionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const submission = await submissionService.getSubmissionById(req.params.id);
    if (!submission) {
      res.status(404).json({ error: "Submission not found" });
      return;
    }
    res.json(submission);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ error: e.message });
  }
};

export const getAllSubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const submissions = await submissionService.getAllSubmissions();
    res.json(submissions);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ error: e.message });
  }
};

export const updateSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const submission = await submissionService.updateSubmission(req.params.id, req.body);
    res.json(submission);
  } catch (error) {
    const e = error as Error;
    res.status(400).json({ error: e.message });
  }
};

export const deleteSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    await submissionService.deleteSubmission(req.params.id);
    res.status(204).send();
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ error: e.message });
  }
};