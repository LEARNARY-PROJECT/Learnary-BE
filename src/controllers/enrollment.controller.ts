import { Request, Response } from 'express';
import { createEnrollment as create, getAllEnrollments as all, getEnrollmentsByUser as byUser } from '../services/enrollment.service';

export const createEnrollment = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const userId = req.user!.id;
        const { courseId } = req.body;

        if (!courseId) return res.status(400).json({ message: 'courseId is required' });

        const enrollment = await create(userId, courseId);
        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: 'Enrollment failed' });
    }
};

export const getAllEnrollments = async (req: Request, res: Response) => {
    const data = await all();
    res.json(data);
};

export const getEnrollmentsByUser = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = await byUser(userId);
    res.json(data);
};
