import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove, deleteVideo } from "../controllers/lesson.controller";
import { videoUpload } from "../config/multer.config";

/*  videoUpload.single('video') nghĩa là middleware của multer chỉ cho phép upload 1 file duy nhất với field name là video */
const router = express.Router();

/**
 * @openapi
 * /api/lessons:
 *   post:
 *     summary: Create a new lesson with optional video upload
 *     tags: [Lesson]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file (MP4, WEBM, MOV - max 500MB)
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/lessons", authenticate, authorizeRoles("INSTRUCTOR","ADMIN"), videoUpload.single('video'), create);

/**
 * @openapi
 * /api/lessons:
 *   get:
 *     summary: Get all lessons
 *     tags: [Lesson]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of lessons
 *       401:
 *         description: Unauthorized
 */
router.get("/lessons", authenticate, getAll);

/**
 * @openapi
 * /api/lessons/{id}:
 *   get:
 *     summary: Get lesson by ID
 *     tags: [Lesson]
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
 *         description: Lesson found
 *       404:
 *         description: Lesson not found
 *       401:
 *         description: Unauthorized
 */
router.get("/lessons/:id", authenticate, getById);

/**
 * @openapi
 * /api/lessons/{id}:
 *   put:
 *     summary: Update lesson with optional video replacement
 *     tags: [Lesson]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file (MP4, WEBM, MOV - max 500MB)
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       404:
 *         description: Lesson not found
 *       401:
 *         description: Unauthorized
 */
router.put("/lessons/:id", authenticate, authorizeRoles("INSTRUCTOR","ADMIN"), videoUpload.single('video'), update);

/**
 * @openapi
 * /api/lessons/{id}:
 *   delete:
 *     summary: Delete lesson and its video
 *     tags: [Lesson]
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
 *         description: Lesson deleted successfully
 *       404:
 *         description: Lesson not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/lessons/:id", authenticate, authorizeRoles("INSTRUCTOR","ADMIN"), remove);

/**
 * @openapi
 * /api/lessons/{id}/video:
 *   delete:
 *     summary: Delete only the video from a lesson
 *     tags: [Lesson]
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
 *         description: Video deleted successfully
 *       404:
 *         description: Lesson not found or has no video
 *       401:
 *         description: Unauthorized
 */
router.delete("/lessons/:id/video", authenticate, authorizeRoles("INSTRUCTOR","ADMIN"), deleteVideo);

export default router;
