import { Request, Response } from 'express';
import * as messageService from '../services/message.service';
import * as conversationService from '../services/conversation.service';
import { emitToConversation, emitToUser } from '../socket';

export const getMessagesByConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.jwtPayload?.id;
    const { conversationId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const conversation = await conversationService.getConversationById(conversationId);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    if (conversation.user1_id !== userId && conversation.user2_id !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const messages = await messageService.getMessagesByConversation(conversationId, limit);
    res.status(200).json({
      success: true,
      data: messages.reverse() 
    });
  } catch (error) {
    const err = error as Error;
    console.error('Get messages error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.jwtPayload?.id;
    const { conversationId } = req.params;
    const { message_text } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!message_text || message_text.trim() === '') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }
    const conversation = await conversationService.getConversationById(conversationId);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    if (conversation.user1_id !== userId && conversation.user2_id !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const receiverId = conversation.user1_id === userId ? conversation.user2_id : conversation.user1_id;

    const message = await messageService.createMessage({
      conversation_id: conversationId,
      sender_id: userId,
      receiver_id: receiverId,
      message_text: message_text.trim()
    });

    emitToConversation(conversationId, 'message:new', message);
    emitToUser(receiverId, 'message:received', message);

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    const err = error as Error;
    console.error('Send message error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.jwtPayload?.id;
    const { messageId } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await messageService.markMessageAsRead(messageId);
    const message = await messageService.getMessageById(messageId);
    if (message) {
      emitToConversation(message.conversation_id, 'message:read', { messageId });
    }
    
    res.status(200).json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    const err = error as Error;
    console.error('Mark as read error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.jwtPayload?.id;
    const { conversationId } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await messageService.markAllMessagesAsRead(conversationId, userId);
    
    emitToConversation(conversationId, 'messages:read_all', { conversationId, userId });
    
    res.status(200).json({
      success: true,
      message: `${result.count} messages marked as read`
    });
  } catch (error) {
    const err = error as Error;
    console.error('Mark all as read error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.jwtPayload?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const count = await messageService.getUnreadCount(userId);
    res.status(200).json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    const err = error as Error;
    console.error('Get unread count error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.jwtPayload?.id;
    const { messageId } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const message = await messageService.getMessageById(messageId);
    
    await messageService.deleteMessage(messageId);
    
    if (message) {
      emitToConversation(message.conversation_id, 'message:deleted', { messageId });
    }
    
    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    const err = error as Error;
    console.error('Delete message error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
