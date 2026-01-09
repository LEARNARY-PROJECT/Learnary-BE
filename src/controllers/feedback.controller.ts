import { Request, Response } from 'express';
import { createFeedback as create, getFeedbackByCourse as byCourse } from '../services/feedback.service';
import { failure } from '../utils/response';

export const createFeedback = async (req: Request, res: Response)  => {
    try {
        const user_id = req.jwtPayload?.id
        if(!user_id) return res.status(404).json(failure("Missing field requỉed"))
        const { course_id, rating, comment } = req.body;
        if (!course_id || !rating|| !comment) {
            res.status(400).json({ message: 'Missing field required in controller!' });
            return;
        }
        const feedback = await create({ user_id, course_id, rating, comment });
        res.status(201).json(feedback);
    } catch (error) {
        const e = error as Error;
        if (e.message === "You already feedback on this course") {
            res.status(409).json({ 
                success: false,
                message: 'Bạn đã đánh giá khóa học này rồi' 
            });
            return;
        }
        if (e.message === "User is not a learner") {
            res.status(403).json({ 
                success: false,
                message: 'Bạn phải là học viên để đánh giá khóa học' 
            });
            return;
        }
        if (e.message === "You must enroll in this course before giving feedback") {
            res.status(403).json({ 
                success: false,
                message: 'Bạn phải đăng ký khóa học trước khi đánh giá' 
            });
            return;
        }
        if (e.message.includes("You must complete at least 30%")) {
            res.status(403).json({ 
                success: false,
                message: e.message 
            });
            return;
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Feedback submission failed' 
        });
    }
};

export const getFeedbackByCourse = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params;
        const feedbacks = await byCourse(courseId);
        res.status(200).json({
            success: true,
            count: feedbacks.length,
            data: feedbacks
        });
    } catch (error) {
        const e = error as Error;
        console.error('Get feedback error:', e);
        res.status(500).json({ 
            success: false,
            message: 'Failed to get feedbacks' 
        });
    }
};
