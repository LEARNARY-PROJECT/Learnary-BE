// src/routes/auth.route.ts
import express from 'express';
import passport from 'passport';
import { 
  register, 
  login, 
  handleGoogleCallback,
  handleRefreshToken, 
  handleLogout, 
  changePasswordC,
  forgotPassword,
  verifyOTP,
  resetPassword
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name: 
 *                type: string
 *                example: Nguyen Van A 
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: mysecurepassword
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', register);
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: mysecurepassword
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/login', login);
/**
 * @openapi
 * /api/auth/google:
 *   get:
 *     summary: Start Google OAuth flow
 *     tags: [Auth]
 *     description: Redirects the user to Google's authentication page.
 *     responses:
 *       302:
 *         description: Redirecting to Google.
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send OTP to email for password recovery
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Email is required
 *       500:
 *         description: Error sending OTP
 */
router.post('/forgot-password', forgotPassword);

/**
 * @openapi
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for password recovery
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post('/verify-otp', verifyOTP);

/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password after OTP verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               newPassword:
 *                 type: string
 *                 example: newsecurepassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Error resetting password
 */
router.post('/reset-password', resetPassword);

router.put(
  '/changePassword',
  authenticate,
  changePasswordC,
)
/**
 * @openapi
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     description: Google redirects back to this endpoint after authentication.
 *     responses:
 *       302:
 *         description: Redirecting to Frontend with token (on success) or to login page (on failure).
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`,
    session: false,
  }),
  handleGoogleCallback 
);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Auth]
 *     description: Uses the HttpOnly refresh_token cookie to get a new access token.
 *     responses:
 *       200:
 *         description: A new access token.
 *       401:
 *         description: No refresh token provided.
 *       403:
 *         description: Invalid or expired refresh token.
 */
router.post('/refresh', handleRefreshToken);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout the user
 *     tags: [Auth]
 *     description: Clears the HttpOnly refresh_token cookie.
 *     responses:
 *       200:
 *         description: Logged out successfully.
 */
router.post('/logout', handleLogout); 

export default router;