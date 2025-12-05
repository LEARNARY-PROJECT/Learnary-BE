import prisma from "../lib/client";
import { Admin, User } from '../generated/prisma'
import bcryptjs from "bcryptjs";
type createAdminProps = User & { admin_role_id: string }
export const createAdmin = async (
  email: string,
  password: string,
  fullName: string,
  admin_role_id_req: string,
): Promise<User & { admin: Admin }> => {
  const hashedPassword = await bcryptjs.hash(password, 10);
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: "ADMIN",
      }
    });
    const admin = await tx.admin.create({
      data: {
        user_id: user.user_id,
        admin_role_id: admin_role_id_req
      }
    })
    return { ...user, admin }
  })
};
export const getAdminIdByUserId = async (user_ids:string) => {
  if(!user_ids) {
    throw new Error("Missing user_id required")
  }
  return prisma.admin.findUnique({
    where: { user_id: user_ids },
    include: {
      user: {
        select: {
          user_id: true,
          email: true,
          fullName: true,
          avatar: true,
          role: true
        }
      },
      adminRole: {
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
      }
    }
  })
}
export const getAdminById = async (admin_id: string) => {
  return prisma.admin.findUnique({ 
    where: { admin_id },
    include: {
      user: {
        select: {
          user_id: true,
          email: true,
          fullName: true,
          avatar: true,
          phone: true,
          role: true,
          isActive: true
        }
      },
      adminRole: {
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
      }
    }
  });
};

export const getAllAdmins = async () => {
  return prisma.admin.findMany({
    include: {
      user: {
        select: {
          user_id: true,
          email: true,
          fullName: true,
          avatar: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      },
      adminRole: {
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
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const updateAdmin = async (admin_id: string, data: Partial<Admin>) => {
  return prisma.admin.update({ where: { admin_id }, data });
};

export const deleteAdmin = async (admin_id: string) => {
  return prisma.admin.delete({ where: { admin_id } });
};
