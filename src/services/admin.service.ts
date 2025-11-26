import prisma from "../lib/client";
import { Admin } from'../generated/prisma'

export const createAdmin = async (data: Omit<Admin, 'admin_id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.admin.create({ data });
};

export const getAdminById = async (admin_id: string) => {
  return prisma.admin.findUnique({ where: { admin_id } });
};

export const getAllAdmins = async () => {
  return prisma.admin.findMany();
};

export const updateAdmin = async (admin_id: string, data: Partial<Admin>) => {
  return prisma.admin.update({ where: { admin_id }, data });
};

export const deleteAdmin = async (admin_id: string) => {
  return prisma.admin.delete({ where: { admin_id } });
};
