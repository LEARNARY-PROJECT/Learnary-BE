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
