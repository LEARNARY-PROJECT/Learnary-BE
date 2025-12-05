import prisma from "../lib/client";
import { AdminRole } from '../generated/prisma'

export const createAdminRole = async (data: Omit<AdminRole, 'admin_role_id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.adminRole.create({ 
    data,
    include: {
      permissions: {
        include: {
          permission: {
            include: {
              resources: {
                include: {
                  resource: true
                }
              }
            }
          }
        }
      }
    }
  });
};

export const getAdminRoleById = async (admin_role_id: string) => {
  return prisma.adminRole.findUnique({ 
    where: { admin_role_id },
    include: {
      permissions: {
        include: {
          permission: {
            include: {
              resources: {
                include: {
                  resource: true
                }
              }
            }
          }
        }
      },
      admins: {
        include: {
          user: {
            select: {
              user_id: true,
              email: true,
              fullName: true,
              avatar: true
            }
          }
        }
      }
    }
  });
};

export const getAllAdminRoles = async () => {
  return prisma.adminRole.findMany({
    include: {
      permissions: {
        include: {
          permission: {
            include: {
              resources: {
                include: {
                  resource: true
                }
              }
            }
          }
        }
      },
      admins: {
        include: {
          user: {
            select: {
              user_id: true,
              email: true,
              fullName: true,
              avatar: true,
              role: true
            }
          }
        }
      }
    },
    orderBy: {
      level: 'asc'
    }
  });
};

export const updateAdminRole = async (admin_role_id: string, data: Partial<AdminRole>) => {
  return prisma.adminRole.update({ where: { admin_role_id }, data });
};

export const deleteAdminRole = async (admin_role_id: string) => {
  return prisma.adminRole.delete({ where: { admin_role_id } });
};
