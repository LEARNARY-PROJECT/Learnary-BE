import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Khai báo Payload của JWT
export interface JwtPayload {
    id: string;
    role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
}

// Mở rộng interface của Express Request
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || "12736571242634823984126348239841";

// Middleware xác thực JWT
export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        console.log('Decoded JWT:', decoded);  // Log thông tin đã giải mã
        req.user = decoded;  // Lưu thông tin người dùng vào req.user
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}


// Middleware phân quyền dựa vào role
export function authorizeRoles(...allowedRoles: JwtPayload['role'][]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user;

        if (!user || !allowedRoles.includes(user.role)) {
            res.status(403).json({ message: 'Forbidden: Insufficient role' });
            return;
        }

        next();
    };
}
