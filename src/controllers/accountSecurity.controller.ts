import { Request, Response } from "express";
import * as AccountSecurityService from "../services/accountSecurity.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const accountSecurity = await AccountSecurityService.createAccountSecurity(req.body);
    res.status(201).json(success(accountSecurity, "AccountSecurity created successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to create accountSecurity", e.message));
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
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch accountSecurity", e.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const accountSecurities = await AccountSecurityService.getAllAccountSecurities();
    res.json(success(accountSecurities, "All accountSecurities fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch accountSecurities", e.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await AccountSecurityService.updateAccountSecurity(req.params.id, req.body);
    res.json(success(updated, "AccountSecurity updated successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to update accountSecurity", e.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await AccountSecurityService.deleteAccountSecurity(req.params.id);
    res.json(success(null, "AccountSecurity deleted successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to delete accountSecurity", e.message));
  }
};

export const verifyUserEmail = async (req: Request, res: Response) => {
  try {
    const userId  = req.jwtPayload?.id;
    const { otp } = req.body;
    
    if (!userId) {
      res.status(400).json(failure("User ID is required"));
      return;
    }
    
    if (!otp) {
      res.status(400).json(failure("OTP is required"));
      return;
    }
    
    const user = await AccountSecurityService.verifyEmailWithToken(userId, otp);
    res.json(success(user, "Email verified successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(400).json(failure("Failed to verify email", e.message));
  }
};

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const userId = req.jwtPayload?.id;
    if (!userId) {
      res.status(400).json(failure("User ID is required"));
      return;
    }
    await AccountSecurityService.sendOTPEmail(userId);
    res.json(success(null, "OTP sent to your email successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to send OTP", e.message));
  }
};

export const sendVerificationLink = async (req: Request, res: Response) => {
  try {
    const userId = req.jwtPayload?.id;
    if (!userId) {
      res.status(400).json(failure("User ID is required"));
      return;
    }
    await AccountSecurityService.sendVerificationLink(userId);
    res.json(success(null, "Verification link sent to your email successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to send verification link", e.message));
  }
};

export const verifyWithToken = async (req: Request, res: Response) => {
  try {
    const userId = req.jwtPayload?.id;
    const { token } = req.body;
    
    if (!userId) {
      res.status(400).json(failure("User ID is required"));
      return;
    }
    
    if (!token) {
      res.status(400).json(failure("Token/OTP is required"));
      return;
    }
    
    const user = await AccountSecurityService.verifyEmailWithToken(userId, token);
    res.json(success(user, "Email verified successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(400).json(failure("Failed to verify email", e.message));
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json(failure("User ID is required"));
      return;
    }
    await AccountSecurityService.sendOTPEmail(userId);
    res.json(success(null, "OTP resent to your email successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to resend OTP", e.message));
  }
};
