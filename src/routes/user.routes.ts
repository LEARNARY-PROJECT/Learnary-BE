import express from 'express';
import { 
    create, 
    getAll, 
    getById, 
    deleteUserByID,
    updateUserRole,
    getMyProfile,
    updateUserInformation,
    getRecentlyActive,
    getInactive,
    uploadAvatar,
    getUserDetailForAdmin,
    getInstructorDetailForAdmin,
    getUserExceptAdmin
} from '../controllers/user.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import upload from "../config/multer.config"
const router = express.Router();

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyen Van A
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/users/create', authenticate, authorizeRoles('ADMIN'), create);
router.patch('/users/update-role/:id', authenticate, authorizeRoles('ADMIN'), updateUserRole);

/**
 * @openapi
 * /api/users/upload-avatar/{userId}:
 *   post:
 *     summary: Upload user avatar
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: No file selected or invalid user ID
 *       404:
 *         description: User not found
 */
router.post('/users/upload-avatar/:userId', upload.single('avatar'), uploadAvatar);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update user information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nguyen Van A
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *               address:
 *                 type: string
 *                 example: "123 Main St, Hanoi"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *               bio:
 *                 type: string
 *                 example: "Software developer"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *     responses:
 *       200:
 *         description: User information updated successfully
 *       403:
 *         description: Forbidden - can only update own information
 *       404:
 *         description: User not found
 */
router.patch('/users/update-info/:id', authenticate, updateUserInformation);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 */
router.get('/users', authenticate, authorizeRoles('ADMIN', 'INSTRUCTOR'), getAll);
router.get('/users/getUserExceptAdmin', authenticate, authorizeRoles('ADMIN'), getUserExceptAdmin);


/**
 * @openapi
 * /api/users/recently-active:
 *   get:
 *     summary: Get recently active users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days to look back
 *     responses:
 *       200:
 *         description: List of recently active users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/users/recently-active', authenticate, authorizeRoles('ADMIN'), getRecentlyActive);

/**
 * @openapi
 * /api/users/inactive:
 *   get:
 *     summary: Get inactive users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Minimum days of inactivity
 *     responses:
 *       200:
 *         description: List of inactive users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/users/inactive', authenticate, authorizeRoles('ADMIN'), getInactive);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/users/:id',authenticate,authorizeRoles('ADMIN'),deleteUserByID);
router.get('/users/getMyProfile/:id', authenticate, getMyProfile);

/**
 * @openapi
 * /api/users/{id}/detail:
 *   get:
 *     summary: Get full user details (Learner info, Wallet, Transactions) for Admin
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden (Not Admin)
 */
router.get(
    '/users/:id/detail', 
    authenticate, 
    authorizeRoles('ADMIN'), 
    getUserDetailForAdmin
);

/**
 * @openapi
 * /api/users/{id}/instructor-detail:
 *   get:
 *     summary: Get full user details (Qualifications, Instructor-Info, Courses, Wallet, Transactions) for Admin
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Instructor details fetched successfully
 *         content:
 *           application/json:
*             schema:
 *               type: object
 *               properties:
 *                  success:
 *                     type: boolean
 *                     example: true
 *       404:
 *         description: Instructor not found
 *       403:
 *         description: Forbidden (Not Admin)
 */
router.get(
    '/users/:id/instructor-detail', 
    authenticate, authorizeRoles('ADMIN'), 
    getInstructorDetailForAdmin
);
 
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 */
router.get(
    '/users/:id',
    authenticate,
    authorizeRoles('ADMIN', 'INSTRUCTOR'), 
    getById
);
export default router;
