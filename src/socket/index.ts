import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export let io: SocketIOServer;

export const initializeSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://learnary.site"
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    socket.on('join:conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('leave:conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('typing:start', ({ conversationId }: { conversationId: string }) => {
      socket.to(`conversation:${conversationId}`).emit('user:typing', {
        userId: socket.userId,
        conversationId,
      });
    });

    socket.on('typing:stop', ({ conversationId }: { conversationId: string }) => {
      socket.to(`conversation:${conversationId}`).emit('user:stopped_typing', {
        userId: socket.userId,
        conversationId,
      });
    });

    socket.on('disconnect', () => {
    });
  });

  return io;
};

//các hàm đẩy sự kiện của socket.io
export const emitToUser = (userId: string, event: string, data: any) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export const emitToConversation = (conversationId: string, event: string, data: any) => {
  if (io) {
    io.to(`conversation:${conversationId}`).emit(event, data);
  }
};

export const emitToUsers = (userIds: string[], event: string, data: any) => {
  if (io) {
    userIds.forEach(userId => {
      io.to(`user:${userId}`).emit(event, data);
    });
  }
};
