import prisma from '../lib/client';
import { User } from '../generated/prisma'
import { createUser, getUserById, getUserIdByEmail } from "../services/user.service"
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { profile } from 'node:console';
import { Profile } from 'passport-google-oauth20';
import { sendOTPEmail } from './accountSecurity.service';
import { userInfo } from 'node:os';
import { AppError } from '../utils/custom-error';
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const generateAccessToken = (user: User): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const payload = {
    id: user.user_id, email: user.email, role: user.role, fullName: user.fullName, avatar: user.avatar
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '5m' });
};
export const changePassword = async (user_id: string, oldPassword: string, newPassword: string) => {
  if (!user_id || !newPassword || !oldPassword) {
    throw new AppError("Missing field required", 400);
  }
  user_id = user_id.trim();
  newPassword = newPassword.trim();
  oldPassword = oldPassword.trim();
  if (newPassword.length < 6) {
    throw new AppError("New password must be more than 6 characters", 400);
  }
  const userInfor = await getUserById(user_id);
  if (!userInfor) {
    throw new AppError("Cannot find user", 404);
  }
  if (!userInfor.password) {
    throw new AppError("Cannot find old password", 400);
  }
  const checkOldPassword = await bcryptjs.compare(oldPassword, userInfor.password);
  if (!checkOldPassword) {
    throw new AppError("Old password is incorrect", 401);
  }
  if (oldPassword === newPassword) {
    throw new AppError("New password cannot be the same as old password", 400);
  }
  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  return prisma.user.update({
    where: {
      user_id: userInfor.user_id
    },
    data: {
      password: hashedPassword
    }
  });
};
export const getOtpRecovery = async (email: string) => {
  if (!email) throw new Error("Missing field required")
  try {
    const user_id = await getUserIdByEmail(email)
    if (!user_id) throw new Error("User not found")
    const otp = sendOTPEmail(user_id)
    return otp
  } catch (error) {
    throw new Error("Error while recovery password!")
  }
}
export const verifyTokenWhenRecoveryPassword = async (email: string, token: string): Promise<User> => {
  const userId = await getUserIdByEmail(email);
  if (!userId) throw new Error("Not found user")
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

  if (!accountSecurity.verification_token) {
    throw new Error('No verification token found');
  }

  if (accountSecurity.verification_token !== token) {
    throw new Error('Invalid verification token');
  }

  if (accountSecurity.token_expires_at && accountSecurity.token_expires_at < new Date()) {
    throw new Error('Verification token has expired');
  }

  await prisma.accountSecurity.update({
    where: { user_id: userId },
    data: {
      verification_token: null,
      token_expires_at: null,
      updatedAt: new Date()
    }
  });

  const updatedUser = await getUserById(userId);
  if (!updatedUser) {
    throw new Error('Failed to retrieve updated user');
  }

  return updatedUser;
};
export const recoveryPassword = async (email: string, newPassword: string) => {
  if (!email || !newPassword) throw new Error("Missing field required")
  try {
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    if (!hashedPassword) {
      throw new Error("Error while hashing password!")
    }
    return prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword
      }
    })
  } catch (error) {
    throw new Error("Error while recovery password!")
  }
}
export const generateRefreshToken = (user: User): string => {
  if (!REFRESH_SECRET) {
    throw new Error('REFRESH_SECRET is not defined');
  }
  const payload = { id: user.user_id, role: user.role };
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '3h' });
};

export const registerUser = async (email: string, password: string, fullName: string) => {
  if (!email || !password || !fullName) {
    throw new Error('Email, password, and full name are required');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  if (existingUser) {
    throw new Error('Email already registered');
  }
  const user = await createUser(email, password, fullName);
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new Error('Không tìm thấy người dùng với email này.');
  if (!user.password) throw new Error('Tài khoản này được đăng ký qua Google. Vui lòng đăng nhập bằng Google.');
  const isValidPassword = await bcryptjs.compare(password, user.password);
  if (!isValidPassword) throw new Error('Mật khẩu không hợp lệ.');
  await updateLastLogin(user.user_id);
  return user;
};


export const updateLastLogin = async (userId: string): Promise<void> => {
  await prisma.user.update({
    where: { user_id: userId },
    data: { last_login: new Date() },
  });
};

export const findOrCreateGoogleUser = async (profile: Profile): Promise<User> => {
  const googleId = profile.id;
  const email = profile.emails?.[0].value;
  const fullName = profile.displayName;
  const avatar = profile.photos?.[0].value;

  if (!email) {
    throw new Error('Không thể lấy email từ hồ sơ Google.');
  }
  let user = await prisma.user.findUnique({
    where: { googleId },
  });
  if (user) {
    await updateLastLogin(user.user_id);
    return user;
  }
  user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    user = await prisma.user.update({
      where: { email: user.email },
      data: {
        googleId,
        avatar: user.avatar || avatar,
        last_login: new Date()
      },
    });
    return user;
  }
  user = await prisma.user.create({
    data: {
      email,
      fullName,
      avatar,
      googleId,
      password: null,
      role: 'LEARNER',
      last_login: new Date()
    },
  });
  // Ensure learner and wallet records exist for learner role
  if (user.role === 'LEARNER') {
    const existingLearner = await prisma.learner.findUnique({ where: { user_id: user.user_id } });
    if (!existingLearner) {
      await prisma.learner.create({ data: { user_id: user.user_id } });
    }

    const existingWallet = await prisma.wallet.findUnique({ where: { user_id: user.user_id } });
    if (!existingWallet) {
      await prisma.wallet.create({ data: { user_id: user.user_id, balance: 0 } });
    }
  }

  return user;
};
