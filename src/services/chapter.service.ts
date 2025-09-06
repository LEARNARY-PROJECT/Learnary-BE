import prisma from "../lib/client";
import { Chapter } from "@prisma/client";

export const createChapter = async (data: Omit<Chapter, 'chapter_id' | 'createAt' | 'updatedAt'>) => {
  return prisma.chapter.create({ data });
};

export const getChapterById = async (chapter_id: string) => {
  return prisma.chapter.findUnique({ where: { chapter_id } });
};

export const getAllChapters = async () => {
  return prisma.chapter.findMany();
};

export const updateChapter = async (chapter_id: string, data: Partial<Chapter>) => {
  return prisma.chapter.update({ where: { chapter_id }, data });
};

export const deleteChapter = async (chapter_id: string) => {
  return prisma.chapter.delete({ where: { chapter_id } });
};
