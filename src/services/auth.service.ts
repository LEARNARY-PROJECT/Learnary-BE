import prisma from '../lib/client';
import { User } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { profile } from 'node:console';
import { Profile } from 'passport-google-oauth20';

export const generateJwtToken = (user: User): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined'); 
  }
  
  const payload = {
    id: user.user_id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  };
  
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  return token;
};

export const registerUser = async (email: string, password: string, fullName: string) => {
  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
    },
  });
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
  return generateJwtToken(user);
};  

export const findOrCreateGoogleUser = async (profile: Profile): Promise<User> => {
  const googleId = profile.id;
  const email = profile.emails?.[0].value;
  const fullName = profile.displayName;
  const avatar = profile.photos?.[0].value;

  if(!email) {
    throw new Error('Không thể lấy email từ hồ sơ Google.');
  }
  let user = await prisma.user.findUnique({
    where: { googleId },
  });
  if(user) {
    return user;
  }
  user = await prisma.user.findUnique({
    where: { email },
  });
  if(user) {
    user = await prisma.user.update({
      where: { email: user.email },
      data: { googleId, avatar: user.avatar || avatar },
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
    },
  });
  return user;
};
