import { Request, Response } from 'express';
import { loginUser, registerUser, generateJwtToken } from '../services/auth.service';
import { User } from '@prisma/client';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullname } = req.body;
    const user = await registerUser(email, password, fullname);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Email này đã được sử dụng.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.status(200).json({ token });
  } catch (err) {
    const error = err as Error;
    res.status(401).json({ error: error.message });
    // res.status(401).json({ error: 'Invalid credentials.' });
  }
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
  try {
    // Gọi hàm tạo token
    const token = generateJwtToken(user);

    //Chuyển hướng người dùng về Frontend KÈM THEO token
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth-callback?token=${token}`
    );
  } catch (err) {
    // Nếu tạo token lỗi
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_failed`);
  }
};