import prisma from '../lib/client';
import { User } from '../generated/prisma'
import {createUser} from "../services/user.service"
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { profile } from 'node:console';
import { Profile } from 'passport-google-oauth20';

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const generateAccessToken = (user: User): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const payload = {
    id: user.user_id, email: user.email, role: user.role, fullName: user.fullName, avatar:user.avatar
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

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
