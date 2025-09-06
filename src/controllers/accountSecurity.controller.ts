import { Request, Response } from "express";
import * as AccountSecurityService from "../services/accountSecurity.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const accountSecurity = await AccountSecurityService.createAccountSecurity(req.body);
    res.status(201).json(success(accountSecurity, "AccountSecurity created successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to create accountSecurity", err.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const accountSecurity = await AccountSecurityService.getAccountSecurityById(req.params.id);
    if (!accountSecurity) {
      res.status(404).json(failure("AccountSecurity not found"));
      return;
    }
    res.json(success(accountSecurity, "AccountSecurity fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch accountSecurity", err.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const accountSecurities = await AccountSecurityService.getAllAccountSecurities();
    res.json(success(accountSecurities, "All accountSecurities fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch accountSecurities", err.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await AccountSecurityService.updateAccountSecurity(req.params.id, req.body);
    res.json(success(updated, "AccountSecurity updated successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to update accountSecurity", err.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await AccountSecurityService.deleteAccountSecurity(req.params.id);
    res.json(success(null, "AccountSecurity deleted successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete accountSecurity", err.message));
  }
};
