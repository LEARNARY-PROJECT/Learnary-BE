import prisma from "../lib/client";
import { AdminRole } from "@prisma/client";

export const createAdminRole = async (data: Omit<AdminRole, 'admin_role_id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.adminRole.create({ data });
};

export const getAdminRoleById = async (admin_role_id: string) => {
  return prisma.adminRole.findUnique({ where: { admin_role_id } });
};

export const getAllAdminRoles = async () => {
  return prisma.adminRole.findMany();
};

export const updateAdminRole = async (admin_role_id: string, data: Partial<AdminRole>) => {
  return prisma.adminRole.update({ where: { admin_role_id }, data });
};

export const deleteAdminRole = async (admin_role_id: string) => {
  return prisma.adminRole.delete({ where: { admin_role_id } });
};
