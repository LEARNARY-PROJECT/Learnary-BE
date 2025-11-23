import { Request, Response } from "express";
import * as questionService from "../services/question.service";

export const createQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await questionService.createQuestion(req.body);
    res.status(201).json(question);
  } catch (error) {
    const e = error as Error;
    res.status(400).json({ error: e.message });
  }
};

export const getQuestionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await questionService.getQuestionById(req.params.id);
    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
    }
    res.json(question);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ error: e.message });
  }
};

export const getAllQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const questions = await questionService.getAllQuestions();
    res.json(questions);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ error: e.message });
  }
};

export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await questionService.updateQuestion(req.params.id, req.body);
    res.json(question);
  } catch (error) {
    const e = error as Error;
    res.status(400).json({ error: e.message });
  }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    await questionService.deleteQuestion(req.params.id);
    res.status(204).send();
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ error: e.message });
  }
};