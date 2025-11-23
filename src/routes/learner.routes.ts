import express from 'express'
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware'
import { getAllLearnerNoUserData, getAllLearnerWithUserData, getLearnerByUserId, updateLearner, deleteLearner } from '../controllers/learner.controller'

const router = express.Router()

/**
 * @openapi
 * /api/learners:
 *   get:
 *     summary: Get all learners (no user details)
 *     tags: [Learner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of learners
 *       401:
 *         description: Unauthorized
 */
router.get('/learners', authenticate, authorizeRoles('ADMIN'), (req, res) => { void getAllLearnerNoUserData })

/**
 * @openapi
 * /api/learners/with-user:
 *   get:
 *     summary: Get all learners with user details
 *     tags: [Learner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of learners with user data
 *       401:
 *         description: Unauthorized
 */
router.get('/learners/with-user', authenticate, authorizeRoles('ADMIN'), (req, res) => { void getAllLearnerWithUserData(res) })

/**
 * @openapi
 * /api/learners/me:
 *   get:
 *     summary: Get current learner profile
 *     tags: [Learner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current learner
 *       401:
 *         description: Unauthorized
 */
router.get('/learners/me', authenticate, (req, res) => { void getLearnerByUserId(req, res) })

/**
 * @openapi
 * /api/learners/me:
 *   put:
 *     summary: Update current learner profile
 *     tags: [Learner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Learner updated
 *       401:
 *         description: Unauthorized
 */
router.put('/learners/me', authenticate, (req, res) => { void updateLearner(req, res) })

/**
 * @openapi
 * /api/learners/me:
 *   delete:
 *     summary: Delete current learner
 *     tags: [Learner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Learner deleted
 *       401:
 *         description: Unauthorized
 */
router.delete('/learners/me', authenticate, (req, res) => { void deleteLearner(req, res) })

export default router
