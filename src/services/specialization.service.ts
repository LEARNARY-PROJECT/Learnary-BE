import prisma from "../lib/client";
import { Specialization } from "@prisma/client";

export const createSpecialization = async (data: Omit<Specialization, 'specialization_id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.specialization.create({ data });
};

export const getSpecializationById = async (specialization_id: string) => {
  return prisma.specialization.findUnique({ where: { specialization_id } });
};

export const getAllSpecializations = async () => {
  return prisma.specialization.findMany();
};

export const updateSpecialization = async (specialization_id: string, data: Partial<Specialization>) => {
  return prisma.specialization.update({ where: { specialization_id }, data });
};

export const deleteSpecialization = async (specialization_id: string) => {
  return prisma.specialization.delete({ where: { specialization_id } });
};
