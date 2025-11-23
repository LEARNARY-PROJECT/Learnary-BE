import * as LearnerService from "../services/learner.service";
import { Response, Request } from "express";
import { Learner } from "@prisma/client";
import { success, failure } from "../utils/response"; 

// Hàm này dùng để lấy thông tin Learner dựa trên Token của người đang đăng nhập
async function ensureLearner(req: Request, res: Response): Promise<Learner | null> {
  const userId = req.jwtPayload?.id;
  if (!userId) {
    res.status(401).json(failure("Unauthorized: No user ID found"));
    return null;
  }
  const learner = await LearnerService.getLearnerByUserId(userId);
  if (!learner) {
    res.status(403).json(failure("Access denied: You are not a learner"));
    return null;
  }
  return learner;
}

export const getAllLearnerNoUserData = async (req:Request, res: Response) => {
  try {
    const learners = await LearnerService.getAllLearnerNoUserData();
    return res.status(200).json(success(learners, "Learners fetched successfully"));
  } catch (error) {
    const e = error as Error;
    console.error("failed from service", e);
    return res.status(500).json(failure("Failed to fetch learners", e.message));
  }
};

export const getAllLearnerWithUserData = async (res: Response) => {
  try {
    const learners = await LearnerService.getAllLearnerWithUserData();
    return res.status(200).json(success(learners, "Learners with user data fetched successfully"));
  } catch (error) {
    const e = error as Error;
    console.error("failed from service", e);
    return res.status(500).json(failure("Failed to fetch learners", e.message));
  }
};

// --- Personal Functions (Cho user đang đăng nhập) ---

export const getLearnerByUserId = async (req: Request, res: Response) => {
  try {
    const learner = await ensureLearner(req, res);
    if (!learner) return;

    return res.status(200).json(success(learner, "Learner profile fetched successfully"));
  } catch (err) {
    const e = err as Error;
    console.error("Error getLearnerByUserId:", e);
    return res.status(500).json(failure("Failed to fetch learner", e.message));
  }
};

export const deleteLearner = async (req: Request, res: Response) => {
  try {
    const learner = await ensureLearner(req, res);
    if (!learner) return;

    const deletedLearner = await LearnerService.deleteLearner(learner.learner_id);
    return res.status(200).json(success(deletedLearner, "Learner deleted successfully"));
  } catch (err) {
    const e = err as Error;
    console.error("Error deleteLearner:", e);
    return res.status(500).json(failure("Failed to delete learner", e.message));
  }
};

export const updateLearner = async (req: Request, res: Response) => {
  try {
    const learner = await ensureLearner(req, res);
    if (!learner) return;

    const updatedLearner = await LearnerService.updateLearner(learner.learner_id, req.body);
    return res.status(200).json(success(updatedLearner, "Learner updated successfully"));
  } catch (err) {
    const e = err as Error;
    console.error("Error updateLearner:", e);
    return res.status(500).json(failure("Failed to update learner", e.message));
  }
};