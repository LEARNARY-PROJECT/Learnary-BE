import prisma from "../lib/client";
import { Note } from '../generated/prisma'
export const createNote = async (data: Omit<Note, 'note_id' | 'createAt' | 'updatedAt'>) => {
  return prisma.note.create({ data });
};

export const getNoteById = async (note_id: string) => {
  return prisma.note.findUnique({ where: { note_id } });
};

export const getAllNotes = async () => {
  return prisma.note.findMany();
};

export const updateNote = async (note_id: string, data: Partial<Note>) => {
  return prisma.note.update({ where: { note_id }, data });
};

export const deleteNote = async (note_id: string) => {
  return prisma.note.delete({ where: { note_id } });
};

// Lấy tất cả notes của một user
export const getNotesByUserId = async (user_id: string) => {
  return prisma.note.findMany({ 
    where: { user_id },
    include: {
      belongLesson: true, 
    },
    orderBy: {
      createAt: 'desc'
    }
  });
};

// Lấy tất cả notes của một user trong một lesson cụ thể
export const getNotesByUserAndLesson = async (user_id: string, lesson_id: string) => {
  return prisma.note.findMany({ 
    where: { 
      user_id,
      lesson_id 
    },
    include: {
      belongLesson: true,
    },
    orderBy: {
      createAt: 'desc'
    }
  });
};

// Lấy notes của user, nhóm theo lesson
export const getNotesByUserGroupedByLesson = async (user_id: string) => {
  return prisma.note.findMany({ 
    where: { user_id },
    include: {
      belongLesson: {
        select: {
          lesson_id: true,
          title: true, 
        }
      },
    },
    orderBy: [
      { lesson_id: 'asc' },
      { createAt: 'desc' }
    ]
  });
};
