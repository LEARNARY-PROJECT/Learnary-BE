import prisma from "../lib/client";
import { Level } from '../generated/prisma'

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

export const seedLevels = async () => {
  const levels = [
    { level_name: "Cơ bản", order_index: 1 },
    { level_name: "Nâng cao", order_index: 2 }
  ];

  for (const level of levels) {
    const existing = await prisma.level.findUnique({
      where: { level_name: level.level_name }
    });

    if (!existing) {
      await prisma.level.create({ data: level });
      console.log(`✅ Created level: ${level.level_name}`);
    }
  }
};
