import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayLoad {
    id: string;
    role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
}

declare global {
    namespace Express {
        interface Request {
            jwtPayload?: JwtPayLoad;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || "12736571242634823984126348239841";

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized Header' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayLoad;
        req.jwtPayload = decoded; 
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
}

export function authorizeRoles(...allowedRoles: JwtPayLoad['role'][]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const jwtPayload = req.jwtPayload;
        if (!jwtPayload || !allowedRoles.includes(jwtPayload.role)) {
            res.status(403).json({ message: 'Sorry: You are not allow with this role' });
            return;
        }
        next();
    };
}
