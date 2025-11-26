import prisma from "../lib/client";
import { AdminRolePermission } from '../generated/prisma'

export const createAdminRolePermission = async (data: Omit<AdminRolePermission, 'permission_id' | 'admin_role_id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.adminRolePermission.create({ data });
};

export const getAdminRolePermissionById = async (permission_id: string, admin_role_id: string) => {
  return prisma.adminRolePermission.findUnique({ where: { permission_id_admin_role_id: { permission_id, admin_role_id } } });
};

export const getAllAdminRolePermissions = async () => {
  return prisma.adminRolePermission.findMany();
};

export const updateAdminRolePermission = async (permission_id: string, admin_role_id: string, data: Partial<AdminRolePermission>) => {
  return prisma.adminRolePermission.update({ where: { permission_id_admin_role_id: { permission_id, admin_role_id } }, data });
};

export const deleteAdminRolePermission = async (permission_id: string, admin_role_id: string) => {
  return prisma.adminRolePermission.delete({ where: { permission_id_admin_role_id: { permission_id, admin_role_id } } });
};
