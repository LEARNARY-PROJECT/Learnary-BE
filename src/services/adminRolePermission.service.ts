import prisma from "../lib/client";
import { AdminRolePermission } from '../generated/prisma'

export const createAdminRolePermission = async (data: Omit<AdminRolePermission, 'createdAt' | 'updatedAt'>) => {
  try {
    // Kiểm tra xem bản ghi đã tồn tại chưa
    const existing = await prisma.adminRolePermission.findUnique({
      where: {
        permission_id_admin_role_id: {
          permission_id: data.permission_id,
          admin_role_id: data.admin_role_id
        }
      }
    });
    if (existing) {
      return existing; 
    }
    return await prisma.adminRolePermission.create({
      data: {
        permission_id: data.permission_id,
        admin_role_id: data.admin_role_id
      }
    });
  } catch (error: any) {
    console.error("Error creating AdminRolePermission:", error);
    throw new Error(`Failed to create AdminRolePermission: ${error.message || 'Unknown error'}`);
  }
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
