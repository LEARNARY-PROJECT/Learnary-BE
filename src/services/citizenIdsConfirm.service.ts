import prisma from "../lib/client";
import { CitizenIdsConfirm } from '../generated/prisma'

export const createCitizenIdsConfirm = async (data: Omit<CitizenIdsConfirm, 'citizen_id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.citizenIdsConfirm.create({ data });
};

export const getCitizenIdsConfirmById = async (citizen_id: string) => {
  return prisma.citizenIdsConfirm.findUnique({ where: { citizen_id } });
};

export const getAllCitizenIdsConfirms = async () => {
  return prisma.citizenIdsConfirm.findMany();
};

export const updateCitizenIdsConfirm = async (citizen_id: string, data: Partial<CitizenIdsConfirm>) => {
  return prisma.citizenIdsConfirm.update({ where: { citizen_id }, data });
};

export const deleteCitizenIdsConfirm = async (citizen_id: string) => {
  return prisma.citizenIdsConfirm.delete({ where: { citizen_id } });
};
