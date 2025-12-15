import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as messageController from '../controllers/message.controller';

const router = express.Router();

/**
 * @openapi
 * /api/conversations/{conversationId}/messages:
 *   get:
 *     summary: Get all messages in a conversation
 *     tags: [Messages]
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
 *         description: List of messages
 *       403:
 *         description: Not a participant of this conversation
 */
router.get('/conversations/:conversationId/messages', authenticate, messageController.getMessagesByConversation);

/**
 * @openapi
 * /api/conversations/{conversationId}/messages:
 *   post:
 *     summary: Send a message in a conversation
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
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
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 *       403:
 *         description: Not a participant of this conversation
 */
router.post('/conversations/:conversationId/messages', authenticate, messageController.sendMessage);

/**
 * @openapi
 * /api/messages/{messageId}/read:
 *   put:
 *     summary: Mark a message as read
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message marked as read
 *       403:
 *         description: Not authorized
 */
router.put('/messages/:messageId/read', authenticate, messageController.markAsRead);

/**
 * @openapi
 * /api/conversations/{conversationId}/read-all:
 *   put:
 *     summary: Mark all messages in a conversation as read
 *     tags: [Messages]
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
 *         description: All messages marked as read
 *       403:
 *         description: Not a participant of this conversation
 */
router.put('/conversations/:conversationId/read-all', authenticate, messageController.markAllAsRead);

/**
 * @openapi
 * /api/messages/unread-count:
 *   get:
 *     summary: Get count of unread messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread message count
 *       401:
 *         description: Unauthorized
 */
router.get('/messages/unread-count', authenticate, messageController.getUnreadCount);

/**
 * @openapi
 * /api/messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted
 *       403:
 *         description: Not authorized
 */
router.delete('/messages/:messageId', authenticate, messageController.deleteMessage);

export default router;
