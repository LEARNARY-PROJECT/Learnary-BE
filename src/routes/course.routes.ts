import express from 'express';
import { authenticate, authorizeRoles, optionalAuthenticate } from '../middlewares/auth.middleware';
import * as ControllerCourse from '../controllers/course.controller';

const router = express.Router();
/**
 * @openapi
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         course_id:
 *           type: string
 *           example: d1f3a488-3c9e-4fa2-9c01-187f304edf5d
 *         title:
 *           type: string
 *           example: Introduction to AI
 *         description:
 *           type: string
 *           example: A beginner's course on Artificial Intelligence.
 *         thumbnail:
 *           type: string
 *           example: https://example.com/image.jpg
 *         price:
 *           type: number
 *           example: 49.99
 *         status:
 *           type: string
 *           example: Draft
 *         instructor_id:
 *           type: string
 *           example: 8c58f8f5-f91a-4bd6-9d34-4567867ecf89
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * tags:
 *   - name: Course
 *     description: Các API liên quan đến khóa học
 *   - name: Course (Instructor)
 *     description: Các API cho Giảng viên quản lý khóa học
 *   - name: Course (Admin)
 *     description: Các API cho Admin duyệt khóa học
 */

/**
 * @openapi
 * /api/courses:
 *   get:
 *     summary: Lấy tất cả khóa học (Đã xuất bản)
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: Danh sách các khóa học đã xuất bản
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/courses', ControllerCourse.getAll);

// --- CÁC ROUTE CẦN XÁC THỰC ---

/**
 * @openapi
 * /api/courses/instructor/my-courses:
 *   get:
 *     summary: (Giảng viên) Lấy tất cả khóa học của tôi
 *     tags: [Course (Instructor)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách các khóa học của giảng viên
 */
router.get(
  '/courses/instructor/my-courses',
  authenticate,
  authorizeRoles('INSTRUCTOR','ADMIN'),
  ControllerCourse.getMyCourses,
);

/**
 * @openapi
 * /api/courses/admin/pending:
 *   get:
 *     summary: (Admin) Lấy tất cả khóa học đang chờ duyệt
 *     tags: [Course (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách khóa học Pending
 */
router.get(
  '/courses/admin/pending',
  authenticate,
  authorizeRoles('ADMIN'),
  ControllerCourse.getPending,
);

/**
 * @openapi
 * /api/courses/{id}:
 *   get:
 *     summary: Lấy chi tiết 1 khóa học (Có kiểm tra bảo mật)
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của khóa học
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết khóa học
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy khóa học
 */
router.get('/courses/:id',optionalAuthenticate, ControllerCourse.getById);
router.use(authenticate);

/**
 * @openapi
 * /api/courses:
 *   post:
 *     summary: (Giảng viên) Tạo một bản nháp khóa học mới
 *     tags: [Course (Instructor)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               chapters:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     chapter_title:
 *                       type: string
 *             required:
 *               - title
 *               - chapters
 *     responses:
 *       201:
 *         description: Tạo bản nháp thành công
 *       400:
 *         description: Lỗi khi tạo khóa học
 */
router.post(
  '/courses',
  authorizeRoles('INSTRUCTOR','ADMIN'),
  ControllerCourse.createDraft,
);

/**
 * @openapi
 * /api/courses/draft/{id}:
 *   put:
 *     summary: (Giảng viên) Cập nhật/Lưu một bản nháp
 *     tags: [Course (Instructor)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của khóa học nháp
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Toàn bộ dữ liệu khóa học (không chứa video_url)
 *     responses:
 *       200:
 *         description: Lưu nháp thành công
 *       400:
 *         description: Lỗi lưu nháp
 *       404:
 *         description: Không tìm thấy khóa học
 */
router.put(
  '/courses/draft/:id',
  authorizeRoles('INSTRUCTOR'),
  ControllerCourse.updateDraft,
);

/**
 * @openapi
 * /api/courses/submit/{id}:
 *   post:
 *     summary: (Giảng viên) Gửi bản nháp để chờ phê duyệt
 *     tags: [Course (Instructor)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gửi thành công
 *       400:
 *         description: Khóa học chưa đủ điều kiện gửi duyệt
 */
router.post(
  '/courses/submit/:id',
  authorizeRoles('INSTRUCTOR'),
  ControllerCourse.submitApproval,
);


/**
 * @openapi
 * /api/courses/admin/approve/{id}:
 *   post:
 *     summary: (Admin) Duyệt một khóa học
 *     tags: [Course (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Duyệt thành công
 */
router.post(
  '/courses/admin/approve/:id',
  authorizeRoles('ADMIN'),
  ControllerCourse.approve,
);

/**
 * @openapi
 * /api/courses/admin/reject/{id}:
 *   post:
 *     summary: (Admin) Từ chối một khóa học
 *     tags: [Course (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Từ chối thành công
 */
router.post(
  '/courses/admin/reject/:id',
  authorizeRoles('ADMIN'),
  ControllerCourse.reject,
);

/**
 * @openapi
 * /api/courses/{id}:
 *   delete:
 *     summary: Xóa một khóa học (Admin hoặc chủ sở hữu)
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy khóa học
 */
router.delete(
  '/courses/:id',
  authorizeRoles('INSTRUCTOR', 'ADMIN'),
  ControllerCourse.remove,
);

export default router;
