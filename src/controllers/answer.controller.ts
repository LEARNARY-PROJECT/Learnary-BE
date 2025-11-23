import { Request, Response } from "express";
import * as answerService from "../services/answer.service";

export const createAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const answer = await answerService.createAnswer(req.body);
    res.status(201).json(answer);
  } catch (error) {
    const e = error as Error;
    res.status(400).json({ error: e.message });
  }
};

export const getAnswerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const answer = await answerService.getAnswerById(req.params.id);
    if (!answer) {
      res.status(404).json({ error: "Answer not found" });
      return;
    }
    res.json(answer);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ error: e.message });
  }
};

export const getAllAnswers = async (req: Request, res: Response): Promise<void> => {
  try {
    const answers = await answerService.getAllAnswers();
    res.json(answers);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ error: e.message });
  }
};

export const updateAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const answer = await answerService.updateAnswer(req.params.id, req.body);
    res.json(answer);
  } catch (error) {
    const e = error as Error;
    res.status(400).json({ error: e.message });
  }
};

export const deleteAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    await answerService.deleteAnswer(req.params.id);
    res.status(204).send();
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ error: e.message });
  }
};