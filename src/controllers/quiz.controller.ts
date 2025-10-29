import { Request, Response } from "express";
import * as quizService from "../services/quiz.service";

export const createQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const quiz = await quizService.createQuiz(req.body);
    res.status(201).json(quiz);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getQuizById = async (req: Request, res: Response): Promise<void> => {
  try {
    const quiz = await quizService.getQuizById(req.params.id);
    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }
    res.json(quiz);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllQuizzes = async (req: Request, res: Response): Promise<void> => {
  try {
    const quizzes = await quizService.getAllQuizzes();
    res.json(quizzes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const quiz = await quizService.updateQuiz(req.params.id, req.body);
    res.json(quiz);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    await quizService.deleteQuiz(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};