import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/client'; // 
import { User } from '../generated/prisma'
import {
  loginUser,
  registerUser,
  generateAccessToken,
  generateRefreshToken,
  changePassword,
  getOtpRecovery,
  verifyTokenWhenRecoveryPassword,
  recoveryPassword,
} from '../services/auth.service';
import { AppError } from '../utils/custom-error';

const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000 * 3, // 3 giờ (khớp với hạn token)
  });
};
export const changePasswordC = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    const { oldPassword, newPassword } = req.body;
    if (!user_id || !oldPassword || !newPassword) {
      res.status(400).json({ 
        error: "Missing field required" 
      });
      return;
    }
    await changePassword(user_id, oldPassword, newPassword);
    res.status(200).json({ 
      message: "Password changed successfully" 
    });
  } catch (errors) {
    const error = errors as Error;
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ 
        error: error.message 
      });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ 
        error: "Internal server error" 
      });
    }
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }
    
    await getOtpRecovery(email);
    res.status(200).json({ 
      message: "OTP has been sent to your email" 
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({ error: "Email and OTP are required" });
      return;
    }
    await verifyTokenWhenRecoveryPassword(email, otp);
    res.status(200).json({ 
      message: "OTP verified successfully" 
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      res.status(400).json({ error: "Email and new password are required" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters long" });
      return;
    }
    
    await recoveryPassword(email, newPassword);
    res.status(200).json({ 
      message: "Password reset successfully" 
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName } = req.body;

    const user = await registerUser(email, password, fullName);

    res.status(201).json({ id: user.user_id, email: user.email });
  } catch (err) {
    const error = err as Error;
    console.error('Register error:', error.message);

    //các loại lỗi
    if (error.message === 'Email already registered') {
      res.status(409).json({ error: 'Email này đã được sử dụng.' });
      return;
    }

    if (error.message === 'Invalid email format') {
      res.status(400).json({ error: 'Email không hợp lệ.' });
      return;
    }

    if (error.message === 'Password must be at least 6 characters long') {
      res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự.' });
      return;
    }

    if (error.message === 'Email, password, and full name are required') {
      res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
      return;
    }

    res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    if (!user) {
      res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
      return;
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);
    
    // Decode token để kiểm tra payload
    const decoded = jwt.decode(accessToken) as any;
    
    res.status(200).json({ 
      accessToken,
      user: {
        id: user.user_id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive
      },
      decodedToken: decoded // Để debug
    });
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

    const userInfo = encodeURIComponent(JSON.stringify({
      id: user.user_id,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      role: user.role,
      isActive: user.isActive
    }));

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth-callback?accessToken=${accessToken}&user=${userInfo}`
    );
  } catch (err) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_failed`);
  }
};

export const handleRefreshToken = async (req: Request, res: Response): Promise<void> => {
  // Lấy token từ cookie
  const token = req.cookies.refresh_token;
  if (!token) {
    res.status(401).json({ error: 'Không có refresh token' });
    return;
  }

  try {
    const secret = process.env.REFRESH_SECRET!;
    const payload = jwt.verify(token, secret) as { id: string };
    const user = await prisma.user.findUnique({ where: { user_id: payload.id } });

    if (!user) {
      res.status(401).json({ error: 'User không tồn tại' });
      return;
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    setRefreshTokenCookie(res, newRefreshToken);
    res.status(200).json({ 
      accessToken: newAccessToken,
      user: {
        id: user.user_id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive
      },
    });
  } catch (err) {
    res.clearCookie('refresh_token'); // Xóa cookie hỏng
    res.status(403).json({ error: 'Refresh token không hợp lệ.' });
    return;
  }
};


export const handleLogout = (req: Request, res: Response) => {
  res.clearCookie('refresh_token');
  res.status(200).json({ message: 'Đã đăng xuất' });
};