import prisma from '../lib/client';

export const getMessagesByConversation = async (conversationId: string, limit: number = 50) => {
  return await prisma.message.findMany({
    where: { conversation_id: conversationId },
    include: {
      sender: {
        select: {
          user_id: true,
          fullName: true,
          avatar: true
        }
      },
      receiver: {
        select: {
          user_id: true,
          fullName: true,
          avatar: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
};

export const createMessage = async (data: { conversation_id: string; sender_id: string; receiver_id: string;message_text: string;
}) => {
  return await prisma.$transaction(async (tx) => {
    const message = await tx.message.create({
      data: {
        conversation_id: data.conversation_id,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        message_text: data.message_text
      },
      include: {
        sender: {
          select: {
            user_id: true,
            fullName: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            user_id: true,
            fullName: true,
            avatar: true
          }
        }
      }
    });
    await tx.conversation.update({
      where: { conversation_id: data.conversation_id },
      data: { last_message_at: new Date() }
    });

    return message;
  });
};

export const markMessageAsRead = async (messageId: string) => {
  return await prisma.message.update({
    where: { message_id: messageId },
    data: {
      is_read: true,
      read_at: new Date()
    }
  });
};

export const markAllMessagesAsRead = async (conversationId: string, userId: string) => {
  return await prisma.message.updateMany({
    where: {
      conversation_id: conversationId,
      receiver_id: userId,
      is_read: false
    },
    data: {
      is_read: true,
      read_at: new Date()
    }
  });
};

export const deleteMessage = async (messageId: string) => {
  return await prisma.message.delete({
    where: { message_id: messageId }
  });
};

export const getUnreadCount = async (userId: string) => {
  return await prisma.message.count({
    where: {
      receiver_id: userId,
      is_read: false
    }
  });
};

export const getMessageById = async (messageId: string) => {
  return await prisma.message.findUnique({
    where: { message_id: messageId },
    include: {
      sender: {
        select: {
          user_id: true,
          fullName: true,
          avatar: true
        }
      },
      receiver: {
        select: {
          user_id: true,
          fullName: true,
          avatar: true
        }
      }
    }
  });
};
