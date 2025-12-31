import { Request, Response } from "express";
import * as InstructorQualificationsService from "../services/instructorQualifications.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const userId = req.jwtPayload?.id; 
    if (!userId) {
      res.status(401).json(failure("User not authenticated"));
      return;
    }
    const { issue_date, expire_date, ...otherData } = req.body;
    const dataWithUserId = {
      ...otherData,
      user_id: userId,
      issue_date: new Date(issue_date),
      expire_date: expire_date ? new Date(expire_date) : null,
    };
    const instructorQualifications = await InstructorQualificationsService.createInstructorQualifications(dataWithUserId, files);
    res.status(201).json(success(instructorQualifications, "InstructorQualifications created successfully"));
  } catch (err) {
    const e = err as Error;
    console.error("Create Qualification Error:", e);
    res.status(500).json(failure("Failed to create instructorQualifications", e.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const instructorQualifications = await InstructorQualificationsService.getInstructorQualificationsById(req.params.id);
    if (!instructorQualifications) {
      res.status(404).json(failure("InstructorQualifications not found"));
      return;
    }
    res.json(success(instructorQualifications, "InstructorQualifications fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch instructorQualifications", e.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const instructorQualifications = await InstructorQualificationsService.getAllInstructorQualifications();
    res.json(success(instructorQualifications, "All instructorQualifications fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch instructorQualifications", e.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await InstructorQualificationsService.updateInstructorQualifications(req.params.id, req.body);
    res.json(success(updated, "InstructorQualifications updated successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to update instructorQualifications", e.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await InstructorQualificationsService.deleteInstructorQualifications(req.params.id);
    res.json(success(null, "InstructorQualifications deleted successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to delete instructorQualifications", e.message));
  }
};

export const approve = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.jwtPayload?.id;
    if (!currentUserId) {
      res.status(401).json(failure("User not authenticated"));
      return;
    }
    const approved = await InstructorQualificationsService.approveQualification(
      req.params.id, 
      currentUserId 
    );
    res.json(success(approved, "Qualification approved successfully"));
  } catch (err) {
    const e = err as Error;
    console.error(e);
    res.status(500).json(failure("Failed to approve qualification", e.message));
  }
};

export const reject = async (req: Request, res: Response) => {
  try {
    const rejected = await InstructorQualificationsService.rejectQualification(req.params.id);
    res.json(success(rejected, "Qualification rejected successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to reject qualification", e.message));
  }
};

export const getByInstructor = async (req: Request, res: Response) => {
  try {
    const qualifications = await InstructorQualificationsService.getQualificationsByInstructor(req.params.instructorId);
    res.json(success(qualifications, "Qualifications fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch qualifications", e.message));
  }
};

export const getByCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.jwtPayload?.id;
    if (!userId) {
      res.status(401).json(failure("User not authenticated"));
      return;
    }
    const qualifications = await InstructorQualificationsService.getQualificationsByUserId(userId);
    res.json(success(qualifications, "Your qualifications fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch your qualifications", e.message));
  }
};

export const getExpired = async (_: Request, res: Response) => {
  try {
    const expired = await InstructorQualificationsService.checkExpiredQualifications();
    res.json(success(expired, "Expired qualifications fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch expired qualifications", e.message));
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      res.status(400).json(failure("imageUrl is required"));
      return;
    }
    const updated = await InstructorQualificationsService.deleteSingleImage(req.params.id, imageUrl);
    res.json(success(updated, "Image deleted successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to delete image", e.message));
  }
};
