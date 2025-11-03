import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/client'; // 
import { User } from '@prisma/client';
import {
  loginUser, 
  registerUser,
  generateAccessToken,
  generateRefreshToken,
} from '../services/auth.service';

const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // 1 giờ (khớp với hạn token)
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body; 
    const user = await registerUser(email, password, fullName);
    
    res.status(201).json({ id: user.user_id, email: user.email });
  } catch (err) {
    res.status(409).json({ error: 'Email này đã được sử dụng.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    setRefreshTokenCookie(res, refreshToken);
    res.status(200).json({ accessToken });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const handleGoogleCallback = (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }

  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    setRefreshTokenCookie(res, refreshToken);

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth-callback?accessToken=${accessToken}`
    );
  } catch (err) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_failed`);
  }
};

export const handleRefreshToken = async (req: Request, res: Response) => {
  // Lấy token từ cookie
  const token = req.cookies.refresh_token;
  if (!token) return res.status(401).json({ error: 'Không có refresh token' });

  try {
    const secret = process.env.REFRESH_SECRET!;
    const payload = jwt.verify(token, secret) as { id: string };
    const user = await prisma.user.findUnique({ where: { user_id: payload.id } });

    if (!user) return res.status(401).json({ error: 'User không tồn tại' });

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    setRefreshTokenCookie(res, newRefreshToken); 
    res.status(200).json({ accessToken: newAccessToken }); 
  } catch (err) {
    res.clearCookie('refresh_token'); // Xóa cookie hỏng
    return res.status(403).json({ error: 'Refresh token không hợp lệ.' });
  }
};


export const handleLogout = (req: Request, res: Response) => {
  res.clearCookie('refresh_token'); 
  res.status(200).json({ message: 'Đã đăng xuất' });
};