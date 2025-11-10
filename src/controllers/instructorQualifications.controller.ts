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
    const dataWithUserId = {
      ...req.body,
      user_id: userId
    };
    const instructorQualifications = await InstructorQualificationsService.createInstructorQualifications(dataWithUserId, files);
    res.status(201).json(success(instructorQualifications, "InstructorQualifications created successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to create instructorQualifications", err.message));
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
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch instructorQualifications", err.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const instructorQualifications = await InstructorQualificationsService.getAllInstructorQualifications();
    res.json(success(instructorQualifications, "All instructorQualifications fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch instructorQualifications", err.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await InstructorQualificationsService.updateInstructorQualifications(req.params.id, req.body);
    res.json(success(updated, "InstructorQualifications updated successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to update instructorQualifications", err.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await InstructorQualificationsService.deleteInstructorQualifications(req.params.id);
    res.json(success(null, "InstructorQualifications deleted successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete instructorQualifications", err.message));
  }
};

export const approve = async (req: Request, res: Response) => {
  try {
    const { admin_id } = req.body;
    if (!admin_id) {
      res.status(400).json(failure("admin_id is required"));
      return;
    }
    const approved = await InstructorQualificationsService.approveQualification(req.params.id, admin_id);
    res.json(success(approved, "Qualification approved successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to approve qualification", err.message));
  }
};

export const reject = async (req: Request, res: Response) => {
  try {
    const rejected = await InstructorQualificationsService.rejectQualification(req.params.id);
    res.json(success(rejected, "Qualification rejected successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to reject qualification", err.message));
  }
};

export const getByInstructor = async (req: Request, res: Response) => {
  try {
    const qualifications = await InstructorQualificationsService.getQualificationsByInstructor(req.params.instructorId);
    res.json(success(qualifications, "Qualifications fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch qualifications", err.message));
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
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch your qualifications", err.message));
  }
};

export const getExpired = async (_: Request, res: Response) => {
  try {
    const expired = await InstructorQualificationsService.checkExpiredQualifications();
    res.json(success(expired, "Expired qualifications fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch expired qualifications", err.message));
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
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete image", err.message));
  }
};
