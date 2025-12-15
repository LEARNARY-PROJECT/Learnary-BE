import prisma from '../lib/client';

export const getUserConversations = async (userId: string) => {
  return await prisma.conversation.findMany({
    where: {
      OR: [ //user hiện tại có thể ở vị trí user1 hoặc user2 bất kỳ, nên phải tìm thỏa mãn userId đó ở vị trí 1 hoặc 2 để tìm thấy tất cả đoạn hội thoại của user.
        { user1_id: userId },
        { user2_id: userId }
      ]
    },
    include: {
      user1: {
        select: {
          user_id: true,
          fullName: true,
          avatar: true
        }
      },
      user2: {
        select: {
          user_id: true,
          fullName: true,
          avatar: true
        }
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          message_text: true,
          createdAt: true,
          is_read: true
        }
      }
    },
    orderBy: {
      last_message_at: 'desc'
    }
  });
};

export const getOrCreateConversation = async (user1Id: string, user2Id: string) => {
    //sort chỗ này sẽ để ràng buộc trường hợp a nhắn b, sau đó b nhắn a -> tạo ra 2 conversation có 2 user như nhau.
  const [sortedUser1, sortedUser2] = [user1Id, user2Id].sort();
  const existing = await prisma.conversation.findUnique({
    where: {
      unique_conversation: {
        user1_id: sortedUser1,
        user2_id: sortedUser2
      }
    },
    include: {
      user1: {
        select: {
          user_id: true,
          fullName: true,
          avatar: true
        }
      },
      user2: {
        select: {
          user_id: true,
          fullName: true,
          avatar: true
        }
      }
    }
  });

  if (existing) return existing;

  return await prisma.conversation.create({
    data: {
      user1_id: sortedUser1,
      user2_id: sortedUser2
    },
    include: {
      user1: {
        select: {
          user_id: true,
          fullName: true,
          avatar: true
        }
      },
      user2: {
        select: {
          user_id: true,
          fullName: true,
          avatar: true
        }
      }
    }
  });
};

export const getConversationById = async (conversationId: string) => {
  return await prisma.conversation.findUnique({
    where: { conversation_id: conversationId },
    include: {
      user1: {
        select: {
          user_id: true,
          fullName: true,
          avatar: true
        }
      },
      user2: {
        select: {
          user_id: true,
          fullName: true,
          avatar: true
        }
      }
    }
  });
};

export const deleteConversation = async (conversationId: string) => {
  return await prisma.conversation.delete({
    where: { conversation_id: conversationId }
  });
};
