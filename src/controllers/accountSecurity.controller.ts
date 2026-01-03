import { Request, Response } from "express";
import * as AccountSecurityService from "../services/accountSecurity.service";
import { success, failure } from "../utils/response";
import { PrismaClientKnownRequestError } from "../generated/prisma/runtime/client";
import { AppError } from "../utils/custom-error";
import prisma from "../lib/client";

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

export const lockAccount = async (req:Request, res: Response) => {
  try {
    const {user_id, reason} = req.body;
    if(!user_id  || !reason) {
      res.status(400).json(failure("Missing field required"));
      return; 
    }
    await AccountSecurityService.lockAccount(user_id, reason)
    res.status(200).json(success("Account has been locked successfully!"))
  } catch (error) {
    const e = error as Error;
    if(e instanceof AppError) {
      res.status(400).json({
        error:"Missing field required"
      })
    } else {
      res.status(505).json({
        error:"Unexpected Error"
      })
    }
  }
}
export const activeAccount = async (req:Request, res: Response) => {
  try {
    const {user_id, reason} = req.body;
    if(!user_id  || !reason) {
      res.status(400).json(failure("Missing field required"));
      return; 
    }
    await AccountSecurityService.activeAcount(user_id, reason)
    res.status(200).json(success("Account has been actived successfully!"))
  } catch (error) {
    const e = error as Error;
    if(e instanceof AppError) {
      res.status(400).json({
        error:"Missing field required"
      })
    } else {
      res.status(505).json({
        error:"Unexpected Error"
      })
    }
  }
}
export const checkAccountActive = async (req:Request, res: Response): Promise<void> => {
  try {
    const {user_id} = req.body;
    if(!user_id) {
      res.status(400).json(failure("Missing field required"));
    }
    const result = await AccountSecurityService.isActiveAccount(user_id)
    if(result == true) {
      res.status(200).json(success(result,"This account is Activating!"))
    } else {
      res.status(200).json(success(result,"This account is NOT Activating"))
    }
  } catch (error) {
    const e = error as Error;
    if(e instanceof AppError) {
      res.status(400).json({
        error:"Missing field required"
      })
    } else {
      res.status(505).json({
        error:"Unexpected Error"
      })
    }
  }
}
export const freezeAccount = async (req:Request, res: Response) => {
  try {
    const {user_id, reason} = req.body;
    if(!user_id  || !reason) {
      res.status(400).json(failure("Missing field required"));
      return; 
    }
    await AccountSecurityService.freezeAccount(user_id, reason)
    res.status(200).json(success("Account has been freezed successfully!"))
  } catch (error) {
    const e = error as Error;
    if(e instanceof AppError) {
      res.status(400).json({
        error:"Missing field required"
      })
    } else {
      res.status(505).json({
        error:"Unexpected Error"
      })
    }
  }
}

export const getMyAccountStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = req.jwtPayload?.id;
    
    if (!user_id) {
      res.status(401).json(failure("Unauthorized"));
      return;
    }
    
    const accountSecurity = await prisma.accountSecurity.findFirst({
      where: { user_id },
      select: {
        status: true,
        account_noted: true
      }
    });
    
    if (!accountSecurity) {
      res.status(404).json(failure("Account security record not found"));
      return;
    }
    res.status(200).json(success(accountSecurity, "Account status retrieved successfully"));
  } catch (error) {
    const e = error as Error;
    res.status(500).json(failure("Unexpected Error", e.message));
  }
};