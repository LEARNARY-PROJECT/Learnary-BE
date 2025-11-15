import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Khai báo Payload của JWT
export interface JwtPayload {
    id: string;
    role: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
}

// Mở rộng interface của Express Request
declare global {
    namespace Express {
        interface Request {
            User?: JwtPayload;
        }
    }
} 

const JWT_SECRET = process.env.JWT_SECRET || "12736571242634823984126348239841";

// Middleware xác thực JWT
export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized Header' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.User = decoded; 
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

export function optionalAuthenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    // Nếu không có token, cứ cho qua (req.User sẽ là undefined)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next();
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.User = decoded; // Gán thông tin nếu token hợp lệ
        next();
    } catch (error) {
        // Nếu token lỗi/hết hạn, vẫn cho qua (coi như khách vãng lai)
        next();
    }
}

// Middleware phân quyền dựa vào role
export function authorizeRoles(...allowedRoles: JwtPayload['role'][]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.User;
        if (!user || !allowedRoles.includes(user.role)) {
            res.status(403).json({ message: 'Sorry: You are not allow with this role' });
            return;
        }
        next();
    };
}
