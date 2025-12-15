import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as conversationController from '../controllers/conversation.controller';

const router = express.Router();
/**
 * @openapi
 * /api/conversations:
 *   post:
 *     summary: Create or get conversation with another user
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otherUserId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Conversation created or retrieved
 *       401:
 *         description: Unauthorized
 */
router.post('/conversations', authenticate, conversationController.createConversation);

/**
 * @openapi
 * /api/conversations/with/{otherUserId}:
 *   get:
 *     summary: Get or create conversation with another user
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: otherUserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation details
 *       401:
 *         description: Unauthorized
 */
router.get('/conversations/with/:otherUserId', authenticate, conversationController.getOrCreateConversation);

/**
 * @openapi
 * /api/conversations:
 *   get:
 *     summary: Get all conversations for current user
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 *       401:
 *         description: Unauthorized
 */
router.get('/conversations', authenticate, conversationController.getUserConversations);

/**
 * @openapi
 * /api/conversations/{conversationId}:
 *   get:
 *     summary: Get conversation by ID
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation details
 *       404:
 *         description: Conversation not found
 */
router.get('/conversations/:conversationId', authenticate, conversationController.getConversationById);

/**
 * @openapi
 * /api/conversations/{conversationId}:
 *   delete:
 *     summary: Delete conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation deleted
 *       404:
 *         description: Conversation not found
 */
router.delete('/conversations/:conversationId', authenticate, conversationController.deleteConversation);

export default router;
