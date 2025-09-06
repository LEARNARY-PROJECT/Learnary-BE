import * as LearnerService from "../services/learner.service";
import { Response, Request } from "express";
import { Learner, User } from "@prisma/client";

async function ensureLearner(req: Request, res: Response): Promise<Learner | null> {
  const learner =  await ensureLearner(req,res)
  if (!learner) {
    res.status(403).json({ message: "You are not a learner" });
    return null;
  }
  return learner;
}

export const getAllLearnerNoUserData = async (
    res: Response
): Promise<Response> => {
    try {
        const learners: Learner[] = await LearnerService.getAllLearnerNoUserData();
        return res.status(200).json(learners);
    } catch (error) {
        console.error("failed from service", error);
        return res.status(500).json({ error: "Failed to fetch learners" });
    }
};


export const getAllLearnerWithUserData = async (
    res: Response
): Promise<Response> => {
    try {
        const learners: (Learner | { user: User })[] = await LearnerService.getAllLearnerNoUserData();
        return res.status(200).json(learners);
    } catch (error) {
        console.error("failed from service", error);
        return res.status(500).json({ error: "Failed to fetch learners" });
    }
};

export const getLearnerByUserId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const learner =  await ensureLearner(req,res)
        if (learner == null) {
            return res.status(403).json({ message: "You are not a learner" });
        } else {
            const extractedLearner = learner
            if (!extractedLearner) {
                return res.status(404).json({ message: "Not found" })
            } else {
                return res.status(200).json(extractedLearner)
            }
        }
    } catch (err) {
        console.error("Error getLearnerByUserId:", err);
        return res.status(500).json({ error: "Failed to fetch learner" });
    }
};


export const deleteLearner = async (req: Request, res: Response): Promise<Response> => {
    try {
        const learner = await ensureLearner(req,res)
        if (!learner) {
            return res.status(403).json({ message: "You don't have permission or learner not found" });
        } else {
            const deletedLearner = await LearnerService.deleteLearner(learner.learner_id);
            return res.status(200).json(deletedLearner);
        }
    } catch (err) {
        console.error("Error to fetch API delete Learner:", err);
        return res.status(500).json({ error: "Failed to delete learner" });
    }
};

export const updateLearner = async (req: Request, res: Response): Promise<Response> => {
    try {
        const learner = await ensureLearner(req,res)
        if (learner == null) {
            return res.status(403).json({ message: "You don't have permission or learner not found" });
        } else {
            const extractedLearner = await LearnerService.updateLearner(learner.learner_id, req.body);
            return res.status(200).json(extractedLearner);
        }
    } catch (err) {
        console.error("Error updateLearner:", err);
        return res.status(500).json({ error: "Failed to update learner" });
    }
};
