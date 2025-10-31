// src/routes/auth.route.ts
import express from 'express';
import passport from 'passport';
import { register, login, handleGoogleCallback } from '../controllers/auth.controller';

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
 * get:
 * summary: Start Google OAuth flow
 * tags: [Auth]
 * description: Redirects the user to Google's authentication page.
 * responses:
 * 302:
 * description: Redirecting to Google.
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
 * /api/auth/google/callback:
 * get:
 * summary: Google OAuth callback
 * tags: [Auth]
 * description: Google redirects back to this endpoint after authentication.
 * responses:
 * 302:
 * description: Redirecting to Frontend with token (on success) or to login page (on failure).
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`,
    session: false,
  }),
  // Nếu thành công, gọi controller
  handleGoogleCallback 
);
export default router;
