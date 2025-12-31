import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove, approve, reject, getByInstructor, getExpired, deleteImage, getByCurrentUser } from "../controllers/instructorQualifications.controller";
import upload from "../config/multer.config";

const router = express.Router();

/**
 * @openapi
 * /api/instructor-qualifications:
 *   post:
 *     summary: Create a new instructor qualification
 *     tags: [InstructorQualifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               instructor_id:
 *                 type: string
 *               specialization_id:
 *                 type: string
 *               specialization_name:
 *                 type: string
 *               title:
 *                 type: string
 *               issue_date:
 *                 type: string
 *                 format: date
 *               expire_date:
 *                 type: string
 *                 format: date
 *               type:
 *                 type: string
 *                 enum: [Degree, Certificate]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 6
 *     responses:
 *       201:
 *         description: InstructorQualifications created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/instructor-qualifications", authenticate, authorizeRoles("LEARNER"), upload.array('images', 6), create);/* upload.array là hàm có sẵn của thư viện multer - upload.array('tenfieldtrongform',soluonganhtoida) */

/**
 * @openapi
 * /api/instructor-qualifications/my-qualifications:
 *   get:
 *     summary: Get current user's qualifications (LEARNER)
 *     tags: [InstructorQualifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's qualifications fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/instructor-qualifications/my-qualifications", authenticate, authorizeRoles("LEARNER", "INSTRUCTOR","ADMIN"), getByCurrentUser);

/**
 * @openapi
 * /api/instructor-qualifications:
 *   get:
 *     summary: Get all instructor qualifications
 *     tags: [InstructorQualifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of instructor qualifications
 *       401:
 *         description: Unauthorized
 */
router.get("/instructor-qualifications", authenticate, authorizeRoles("ADMIN"), getAll);

/**
 * @openapi
 * /api/instructor-qualifications/{id}:
 *   get:
 *     summary: Get instructor qualification by ID
 *     tags: [InstructorQualifications]
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
 *         description: InstructorQualifications found
 *       404:
 *         description: InstructorQualifications not found
 *       401:
 *         description: Unauthorized
 */
router.get("/instructor-qualifications/:id", authenticate, authorizeRoles("ADMIN"), getById);

/**
 * @openapi
 * /api/instructor-qualifications/{id}:
 *   put:
 *     summary: Update instructor qualification by ID
 *     tags: [InstructorQualifications]
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
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: InstructorQualifications updated successfully
 *       404:
 *         description: InstructorQualifications not found
 *       401:
 *         description: Unauthorized
 */
router.put("/instructor-qualifications/:id", authenticate, authorizeRoles("ADMIN"), update);

/**
 * @openapi
 * /api/instructor-qualifications/{id}:
 *   delete:
 *     summary: Delete instructor qualification by ID
 *     tags: [InstructorQualifications]
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
 *         description: InstructorQualifications deleted successfully
 *       404:
 *         description: InstructorQualifications not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/instructor-qualifications/:id", authenticate, authorizeRoles("ADMIN"), remove);

/**
 * @openapi
 * /api/instructor-qualifications/{id}/approve:
 *   patch:
 *     summary: Approve qualification
 *     tags: [InstructorQualifications]
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
 *         description: Qualification approved successfully
 *       404:
 *         description: Qualification not found
 *       401:
 *         description: Unauthorized
 */
router.patch("/instructor-qualifications/:id/approve", authenticate, authorizeRoles("ADMIN"), approve);

/**
 * @openapi
 * /api/instructor-qualifications/{id}/reject:
 *   patch:
 *     summary: Reject qualification
 *     tags: [InstructorQualifications]
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
 *         description: Qualification rejected successfully
 *       404:
 *         description: Qualification not found
 *       401:
 *         description: Unauthorized
 */
router.patch("/instructor-qualifications/:id/reject", authenticate, authorizeRoles("ADMIN"), reject);

/**
 * @openapi
 * /api/instructor-qualifications/instructor/{instructorId}:
 *   get:
 *     summary: Get qualifications by instructor ID
 *     tags: [InstructorQualifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: instructorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Qualifications found
 *       401:
 *         description: Unauthorized
 */
router.get("/instructor-qualifications/instructor/:instructorId", authenticate, authorizeRoles("ADMIN", "INSTRUCTOR"), getByInstructor);

/**
 * @openapi
 * /api/instructor-qualifications/expired:
 *   get:
 *     summary: Get all expired qualifications
 *     tags: [InstructorQualifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expired qualifications fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/instructor-qualifications/expired", authenticate, authorizeRoles("ADMIN"), getExpired);

/**
 * @openapi
 * /api/instructor-qualifications/{id}/image:
 *   delete:
 *     summary: Delete a single image from qualification
 *     tags: [InstructorQualifications]
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Image not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/instructor-qualifications/:id/image", authenticate, authorizeRoles("INSTRUCTOR"), deleteImage);

export default router;
