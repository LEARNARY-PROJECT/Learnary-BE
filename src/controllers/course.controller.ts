import { Request, Response, NextFunction } from 'express';
import * as courseService from '../services/course.service';
import prisma from "../lib/client";
import { getInstructorByUserId, verifyInstructor } from '../services/instructor.service';
import { error } from 'console';


export const createDraft = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.jwtPayload?.id;
    if (!userId) {
      res.status(401).json({ message: 'Missing instructor_id' });
      return;
    }
    const newCourse = await courseService.createDraftCourse(
      userId,
      req.body,
    );
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('LỖI TẠI createDraft:', error);
    res
      .status(500)
      .json({ message: 'Tạo bản nháp thất bại', error: (error as Error).message });
  }
};


export const getAll = async (_: Request, res: Response): Promise<void> => {
  try {
    const courses = await courseService.getAllCourses();
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error("Error fetching admin courses:", error);
    res.status(500).json({
      message: 'Lấy danh sách khóa học thất bại',
      error: (error as Error).message
    });
  }
};
export const getCourseBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug;
    if (!slug) {
      res.status(500).json({ message: "Không thấy slug để truy vấn!" })
      return
    }
    const course = await courseService.getCourseBySlug(slug);
    if (!course) {
      res.status(404).json({ message: "Không thấy course với slug này!" })
      return
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Error in getById:", error);
    res.status(500).json({ message: 'Lỗi khi lấy course id từ slug!', error: (error as Error).message });
  }
}
export const getById = async (req: Request, res: Response): Promise<void> => {
  try {

    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      res.status(404).json({ message: 'Không tìm thấy khóa học' });
      return;
    }

    if (course.status === 'Published' || course.status === 'Archived') {
      res.json(course);
      return;
    }

    const user = req.jwtPayload;
    if (!user) {
      res.status(401).json({ message: 'Bạn cần đăng nhập để xem nội dung này' });
      return;
    }

    const isAdmin = user.role === 'ADMIN';
    const isOwner = course.instructor?.user_id === user.id;

    if (isAdmin || isOwner) {
      res.json(course);
      return;
    }

    res.status(403).json({ message: 'Bạn không có quyền truy cập khóa học này.' });

  } catch (error) {
    console.error("Error in getById:", error);
    res.status(500).json({ message: 'Lỗi máy chủ', error: (error as Error).message });
  }
};


export const updateDraft = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.jwtPayload?.id;
    if (!instructorId) {
      res.status(401).json({ message: 'Xác thực không hợp lệ' });
      return;
    }

    const updated = await courseService.updateDraftCourse(
      req.params.id,
      instructorId,
      req.body,
    );
    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Cập nhật nháp thất bại', error: (error as Error).message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.jwtPayload;
    const { id: courseId } = req.params;

    if (!user) {
      res.status(401).json({ message: 'Không thể xác thực admin.' });
      return;
    }

    const course = await courseService.getCourseById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Không tìm thấy khóa học' });
      return;
    }

    const isAdmin = user.role === 'ADMIN';

    if (!isAdmin/*  && !isOwner */) {
      res.status(403).json({ message: 'Bạn không có quyền xóa khóa học này.' });
      return;
    }

    await courseService.deleteCourse(courseId);
    res.status(200).json({ message: 'Delete successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: (error as Error).message });
  }
};

export const submitApproval = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.jwtPayload?.id;
    if (!userId) {
      res.status(401).json({ message: 'Xác thực không hợp lệ' });
      return;
    }
    const submittedCourse = await courseService.submitCourseForApproval(
      req.params.id,
      userId,
      req.body
    );
    res.json(submittedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Gửi phê duyệt thất bại', error: (error as Error).message });
  }
};

export const getMyCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorId = req.jwtPayload?.id;
    if (!instructorId) {
      res.status(401).json({ message: 'Xác thực không hợp lệ' });
      return;
    }
    const courses = await courseService.getCoursesByInstructorId(instructorId);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Lấy khóa học thất bại', error: (error as Error).message });
  }
};

export const getPending = async (_: Request, res: Response): Promise<void> => {
  try {
    const courses = await courseService.getPendingCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Lấy danh sách chờ duyệt thất bại', error: (error as Error).message });
  }
};

export const approve = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await courseService.approveCourse(req.params.id);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Duyệt khóa học thất bại', error: (error as Error).message });
  }
};

export const reject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reason } = req.body;
    if (!reason || reason.trim() === '') {
      res.status(400).json({ message: 'Vui lòng cung cấp lý do từ chối.' });
      return;
    }
    const course = await courseService.rejectCourse(req.params.id, reason);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Từ chối khóa học thất bại', error: (error as Error).message });
  }
};

export const updateThumbnail = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file selected" });
      return;
    }
    const user_id = req.jwtPayload?.id;
    const course_id = req.body.course_id;
    if (!user_id) {
      res.status(500).json({ message: "Không thể xác minh instructor" })
      return
    }
    const instructor_id = getInstructorByUserId(user_id)
    if (!instructor_id) {
      res.status(500).json({ message: "Bạn không phải là giảng viên"})
      return
    }
    if (!course_id|| !user_id || !req.file) {
      res.status(404).json({ message: 'Thiếu dữ liệu truyền vào cần thiết!' });
    }
    const course = await courseService.uploadNewThumbnailToS3(user_id, course_id, req.file);
    if (!course) {
      res.status(500).json({ message: 'Cập nhật khóa học thất bại' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Update thumbnail thất bại!', error: (error as Error).message });
  }
}