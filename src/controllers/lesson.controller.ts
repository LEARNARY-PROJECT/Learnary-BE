import { create } from './user.controller';
import { Request, Response } from 'express';
import { createLesson, deleteLesson, getLessonById, getLessonsByCourseId, updateLesson, } from '../services/lesson.service';


// POST /api/course/:courseId/lessons
export const createLessonController = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { title, videoUrl, thumbnail, content, courseId } = req.body;

        // Gọi service để tạo lesson
        const newLesson = await createLesson({
            title,
            courseId,
            videoUrl,
            thumbnail,
            content,
        });

        res.status(201).json(newLesson);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create lesson';
        res.status(500).json({ message: errorMessage });
    }
};
export const createLessonByCourseId = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { title, videoUrl, thumbnail, content } = req.body;
        const courseId = req.params.courseId;


        // Gọi service để tạo lesson
        const newLesson = await createLesson({
            title,
            courseId,
            videoUrl,
            thumbnail,
            content,
        });

        res.status(201).json(newLesson);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create lesson';
        res.status(500).json({ message: errorMessage });
    }
};
export const getLessonsByCourse = async (req: Request, res: Response): Promise<Response | any> => {
    const lessons = await getLessonsByCourseId(req.params.courseId);
    res.json(lessons);
};

export const getById = async (req: Request, res: Response): Promise<Response | any> => {
    const lesson = await getLessonById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
};

export const updateLessonController = async (req: Request, res: Response) => {
    try {
        const updated = await updateLesson(req.params.id, req.body);
        res.json(updated);
    } catch {
        res.status(500).json({ message: 'Update failed' });
    }
};

export const deleteLessonController = async (req: Request, res: Response) => {
    try {
        await deleteLesson(req.params.id);
        res.status(201).json({ message: 'Delete successfully' });
    } catch {
        res.status(500).json({ message: 'Delete failed' });
    }
}