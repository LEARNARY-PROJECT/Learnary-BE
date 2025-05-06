import { Request, Response } from 'express';
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse } from '../services/course.service';

export const create = async (req: Request, res: Response): Promise<Response | any> => {
    const { title, description, thumbnail, price } = req.body;
    const instructorId = req.user?.id;  // Lấy instructorId từ user đã xác thực

    console.log("instructorId", instructorId);  // Log instructorId để kiểm tra
    console.log("req.body", req.body);  // Log body của request để kiểm tra
    // Kiểm tra nếu instructorId không tồn tại
    if (!instructorId) {
        return res.status(400).json({ message: 'Instructor ID is required' });
    }

    try {
        // Gọi service để tạo khóa học
        const newCourse = await createCourse({
            title,
            description,
            thumbnail,
            price,
            instructorId,  // Gửi instructorId vào trong data
        });

        // Trả về khóa học vừa tạo
        return res.status(201).json(newCourse);
    } catch (error) {
        // Log lỗi chi tiết
        console.error('Error creating course in controller:', error);
        return res.status(500).json({ message: 'Failed to create course', error: (error as Error).message });
    }
};


export const getAll = async (_: Request, res: Response) => {
    const courses = await getAllCourses();
    res.json(courses);
};

export const getById = async (req: Request, res: Response): Promise<Response | any> => {
    const course = await getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
};

export const update = async (req: Request, res: Response) => {
    try {
        const updated = await updateCourse(req.params.id, req.body);
        res.json(updated);
    } catch {
        res.status(500).json({ message: 'Update failed' });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        await deleteCourse(req.params.id);
        res.status(201).json({ message: 'Delete successfully' });
    } catch {
        res.status(500).json({ message: 'Delete failed' });
    }
};
