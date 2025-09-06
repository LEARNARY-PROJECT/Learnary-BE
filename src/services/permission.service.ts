import prisma from "../lib/client";
import { Permission } from "@prisma/client";

export const createPermission = async (data: Omit<Permission, 'permission_id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.permission.create({ data });
};

export const getPermissionById = async (permission_id: string) => {
  return prisma.permission.findUnique({ where: { permission_id } });
};

export const getAllPermissions = async () => {
  return prisma.permission.findMany();
};

export const updatePermission = async (permission_id: string, data: Partial<Permission>) => {
  return prisma.permission.update({ where: { permission_id }, data });
};

export const deletePermission = async (permission_id: string) => {
  return prisma.permission.delete({ where: { permission_id } });
};
