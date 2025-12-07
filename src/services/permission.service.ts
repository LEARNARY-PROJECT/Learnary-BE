import prisma from "../lib/client";
import { Permission } from '../generated/prisma'

export const createPermission = async (data: Omit<Permission, 'permission_id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.permission.create({ 
    data,
    include: {
      resources: {
        include: {
          resource: true
        }
      }
    }
  });
};

export const getPermissionById = async (permission_id: string) => {
  return prisma.permission.findUnique({ 
    where: { permission_id },
    include: {
      resources: {
        include: {
          resource: true
        }
      },
      adminRoles: {
        include: {
          roleToPermission: {
            select: {
              admin_role_id: true,
              role_name: true,
              level: true
            }
          }
        }
      }
    }
  });
};

export const getAllPermissions = async () => {
  return prisma.permission.findMany({
    include: {
      resources: {
        include: {
          resource: true
        }
      }
    },
    orderBy: {
      permission_name: 'asc'
    }
  });
};

export const updatePermission = async (permission_id: string, data: Partial<Permission>) => {
  return prisma.permission.update({ 
    where: { permission_id }, 
    data,
    include: {
      resources: {
        include: {
          resource: true
        }
      }
    }
  });
};

export const deletePermission = async (permission_id: string) => {
  return prisma.permission.delete({ where: { permission_id } });
};
