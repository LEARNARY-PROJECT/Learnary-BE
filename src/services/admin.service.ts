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

export const getAdminById = async (admin_id: string) => {
  return prisma.admin.findUnique({ where: { admin_id } });
};

export const getAllAdmins = async () => {
  return prisma.admin.findMany(
    {
      include: {
        user:true,
        adminRole:true,
      }
    }
  );
};

export const updateAdmin = async (admin_id: string, data: Partial<Admin>) => {
  return prisma.admin.update({ where: { admin_id }, data });
};

export const deleteAdmin = async (admin_id: string) => {
  return prisma.admin.delete({ where: { admin_id } });
};
