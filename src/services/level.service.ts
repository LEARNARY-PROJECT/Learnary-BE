import prisma from "../lib/client";
import { Level } from "@prisma/client";

export const createLevel = async (data: Omit<Level, 'level_id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.level.create({ data });
};

export const getLevelById = async (level_id: string) => {
  return prisma.level.findUnique({ where: { level_id } });
};

export const getAllLevels = async () => {
  return prisma.level.findMany();
};

export const updateLevel = async (level_id: string, data: Partial<Level>) => {
  return prisma.level.update({ where: { level_id }, data });
};

export const deleteLevel = async (level_id: string) => {
  return prisma.level.delete({ where: { level_id } });
};
