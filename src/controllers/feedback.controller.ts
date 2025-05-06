import { Request, Response } from 'express';
import { createFeedback as create, getFeedbackByCourse as byCourse } from '../services/feedback.service';

export const createFeedback = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const userId = req.user!.id;
        const { courseId, rating, comment } = req.body;

        if (!courseId || rating == null || !comment) {
            return res.status(400).json({ message: 'courseId, rating, and comment are required' });
        }

        const feedback = await create({ userId, courseId, rating, comment });
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Feedback submission failed' });
    }
};

export const getFeedbackByCourse = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const feedback = await byCourse(courseId);
    res.json(feedback);
};
