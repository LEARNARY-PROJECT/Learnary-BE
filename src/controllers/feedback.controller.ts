import { Request, Response } from 'express';
import { createFeedback as create, getFeedbackByCourse as byCourse } from '../services/feedback.service';

export const createFeedback = async (req: Request, res: Response)  => {
    try {
        const { course_id, rating, comment, user_id } = req.body;
        if (!course_id || !rating|| !comment) {
            res.status(400).json({ message: 'Missing field required in controller!' });
        }
        const feedback = await create({ user_id, course_id, rating, comment });
        res.status(201).json(feedback);
    } catch (error) {
        const e = error as Error;
        console.error('Create feedback error:', e);
        res.status(500).json({ message: 'Feedback submission failed' });
    }
};

export const getFeedbackByCourse = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const feedback = await byCourse(courseId);
    res.json(feedback);
};
