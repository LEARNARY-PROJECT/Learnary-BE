import prisma from "../lib/client";
import { AccountSecurity } from '../generated/prisma'
import { getUserById } from "./user.service";
import { User } from "../generated/prisma";
import { generateOTP, generateVerificationToken, getOTPExpiration } from "../utils/otp";
import { sendVerificationEmail, sendVerificationEmailWithLink } from "./email.service";
import { AppError } from "../utils/custom-error";
import { AccountStatus } from "../generated/prisma";
export const createAccountSecurity = async (data: Partial<AccountSecurity>) => {
  if (!data.user_id) {
    throw new Error('user_id is required');
  }
  return prisma.accountSecurity.create({
    data: {
      user_id: data.user_id,
      email_verified: data.email_verified ?? false,
      failed_login_attempts: data.failed_login_attempts ?? 0
    }
  });
};
export const lockAccount = async (user_id: string, reason: string): Promise<boolean> => {
  if (!user_id || !reason) {
    throw new AppError("Mising field required", 400)
  }
  await prisma.accountSecurity.update({
    where: {
      user_id
    },
    data: {
      status: AccountStatus.Locked,
      account_noted: reason
    }
  })
  return true
}
export const freezeAccount = async (user_id: string, reason: string): Promise<boolean> => {
  if (!user_id || !reason) {
    throw new AppError("Mising field required", 400)
  }
  await prisma.accountSecurity.update({
    where: {
      user_id
    },
    data: {
      status: AccountStatus.Freezed,
      account_noted: reason
    }
  })
  return true
}
export const activeAcount = async (user_id: string, reason: string): Promise<boolean> => {
  if (!user_id || !reason) {
    throw new AppError("Mising field required", 400)
  }
  await prisma.accountSecurity.update({
    where: {
      user_id
    },
    data: {
      status: AccountStatus.Active,
      account_noted: ""
    }
  })
  return true
}
export const isActiveAccount = async (user_id: string): Promise<boolean> => {
  if (!user_id) {
    throw new AppError("Missing field required", 400)
  }
  const res = await prisma.accountSecurity.findFirst({
    where: { user_id },
    select: {
      status:true
    }
  })
  if(res?.status === AccountStatus.Active) {
    return true
  }
  return false
}
export const sendOTPEmail = async (userId: string): Promise<string> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (!user.email) {
    throw new Error('User email not found');
  }
  const accountSecurity = await prisma.accountSecurity.findUnique({
    where: { user_id: userId }
  });

  if (accountSecurity?.email_verified) {
    throw new Error('Email already verified');
  }
  const otp = generateOTP();
  const expiresAt = getOTPExpiration(10); // 10 phút

  await prisma.accountSecurity.upsert({
    where: { user_id: userId },
    update: {
      verification_token: otp,
      token_expires_at: expiresAt,
      updatedAt: new Date()
    },
    create: {
      user_id: userId,
      email_verified: false,
      failed_login_attempts: 0,
      verification_token: otp,
      token_expires_at: expiresAt
    }
  });

  await sendVerificationEmail(user.email, otp);
  return otp;
};

export const sendVerificationLink = async (userId: string): Promise<string> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.email) {
    throw new Error('User email not found');
  }

  const accountSecurity = await prisma.accountSecurity.findUnique({
    where: { user_id: userId }
  });

  if (accountSecurity?.email_verified) {
    throw new Error('Email already verified');
  }

  const token = generateVerificationToken();
  const expiresAt = getOTPExpiration(1440); // 24 hours

  await prisma.accountSecurity.upsert({
    where: { user_id: userId },
    update: {
      verification_token: token,
      token_expires_at: expiresAt,
      updatedAt: new Date()
    },
    create: {
      user_id: userId,
      email_verified: false,
      failed_login_attempts: 0,
      verification_token: token,
      token_expires_at: expiresAt
    }
  });
  await sendVerificationEmailWithLink(user.email, token);
  return token;
};

export const verifyEmailWithToken = async (userId: string, token: string): Promise<User> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const accountSecurity = await prisma.accountSecurity.findUnique({
    where: { user_id: userId }
  });

  if (!accountSecurity) {
    throw new Error('Account security record not found');
  }

  if (accountSecurity.email_verified) {
    throw new Error('Email already verified');
  }

  if (!accountSecurity.verification_token) {
    throw new Error('No verification token found');
  }

  if (accountSecurity.verification_token !== token) {
    throw new Error('Invalid verification token');
  }

  if (accountSecurity.token_expires_at && accountSecurity.token_expires_at < new Date()) {
    throw new Error('Verification token has expired');
  }
  await prisma.$transaction(async (tx) => {
    await tx.accountSecurity.update({
      where: { user_id: userId },
      data: {
        email_verified: true,
        verification_token: null,
        token_expires_at: null,
        updatedAt: new Date()
      }
    });
    await tx.user.update({
      where: { user_id: userId },
      data: {
        isActive: true
      }
    })
  })
  const updatedUser = await getUserById(userId);
  if (!updatedUser) {
    throw new Error('Failed to retrieve updated user');
  }
  return updatedUser;
};

export const verifyEmail = async (userId: string): Promise<User> => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const accountSecurity = await prisma.accountSecurity.findUnique({
    where: { user_id: userId }
  });

  if (accountSecurity?.email_verified) {
    throw new Error('Email already verified');
  }

  await prisma.accountSecurity.upsert({ /* upsert: nếu đạt điều kiện where thì update (có user tồn tại), không đạt thì tạo bảng accountSecurity cho user đó */
    where: { user_id: userId },
    update: {
      email_verified: true,
      updatedAt: new Date()
    },
    create: {
      user_id: userId,
      email_verified: true,
      failed_login_attempts: 0
    }
  });
  const updatedUser = await getUserById(userId);
  if (!updatedUser) {
    throw new Error('Failed to retrieve updated user');
  }
  return updatedUser;
};



export const getAccountSecurityById = async (account_security_id: string) => {
  return prisma.accountSecurity.findUnique({ where: { account_security_id } });
};

export const getAllAccountSecurities = async () => {
  return prisma.accountSecurity.findMany();
};

export const updateAccountSecurity = async (account_security_id: string, data: Partial<AccountSecurity>) => {
  return prisma.accountSecurity.update({ where: { account_security_id }, data });
};

export const deleteAccountSecurity = async (account_security_id: string) => {
  return prisma.accountSecurity.delete({ where: { account_security_id } });
};
