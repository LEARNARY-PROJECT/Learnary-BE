import { Request, Response } from "express";
import * as InstructorCourseTransactionService from "../services/instructorCourseTransaction.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const instructorCourseTransaction = await InstructorCourseTransactionService.createInstructorCourseTransaction(req.body);
    res.status(201).json(success(instructorCourseTransaction, "InstructorCourseTransaction created successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to create instructorCourseTransaction", err.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const instructorCourseTransaction = await InstructorCourseTransactionService.getInstructorCourseTransactionById(req.params.id);
    if (!instructorCourseTransaction) {
      res.status(404).json(failure("InstructorCourseTransaction not found"));
      return;
    }
    res.json(success(instructorCourseTransaction, "InstructorCourseTransaction fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch instructorCourseTransaction", err.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const instructorCourseTransactions = await InstructorCourseTransactionService.getAllInstructorCourseTransactions();
    res.json(success(instructorCourseTransactions, "All instructorCourseTransactions fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch instructorCourseTransactions", err.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await InstructorCourseTransactionService.updateInstructorCourseTransaction(req.params.id, req.body);
    res.json(success(updated, "InstructorCourseTransaction updated successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to update instructorCourseTransaction", err.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await InstructorCourseTransactionService.deleteInstructorCourseTransaction(req.params.id);
    res.json(success(null, "InstructorCourseTransaction deleted successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete instructorCourseTransaction", err.message));
  }
};
