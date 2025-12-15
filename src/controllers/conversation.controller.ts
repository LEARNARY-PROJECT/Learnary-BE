import { Request, Response } from 'express';
import * as conversationService from '../services/conversation.service';
import { emitToUsers } from '../socket';

export const getUserConversations = async (req: Request, res: Response) => {
  try {

    const userId = req.jwtPayload?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const conversations = await conversationService.getUserConversations(userId);  
    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    const err = error as Error;
    console.error('❌ Get conversations error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const createConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.jwtPayload?.id;
    const { otherUserId } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!otherUserId) {
      res.status(400).json({ error: 'Other user ID is required' });
      return;
    }

    if (userId === otherUserId) {
      res.status(400).json({ error: 'Cannot create conversation with yourself' });
      return;
    }

    const conversation = await conversationService.getOrCreateConversation(userId, otherUserId);
    
    emitToUsers([userId, otherUserId], 'conversation:created', conversation);
    
    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    const err = error as Error;
    console.error('Create conversation error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const getOrCreateConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.jwtPayload?.id;
    const { otherUserId } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!otherUserId) {
      res.status(400).json({ error: 'Other user ID is required' });
      return;
    }

    if (userId === otherUserId) {
      res.status(400).json({ error: 'Cannot create conversation with yourself' });
      return;
    }

    const conversation = await conversationService.getOrCreateConversation(userId, otherUserId);
    
    emitToUsers([userId, otherUserId], 'conversation:created', conversation);
    
    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    const err = error as Error;
    console.error('Get/Create conversation error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const getConversationById = async (req: Request, res: Response) => {
  try {
    const userId = req.jwtPayload?.id;
    const { conversationId } = req.params;

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

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    const err = error as Error;
    console.error('Get conversation error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.jwtPayload?.id;
    const { conversationId } = req.params;

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

    await conversationService.deleteConversation(conversationId);
    const otherUserId = conversation.user1_id === userId ? conversation.user2_id : conversation.user1_id;
    emitToUsers([userId, otherUserId], 'conversation:deleted', { conversationId });
    
    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    const err = error as Error;
    console.error('Delete conversation error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
