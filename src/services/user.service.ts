import bcryptjs from "bcryptjs";
import prisma from "../lib/client";
import { User, Learner } from "@prisma/client";
import type { Role } from "@prisma/client";


export const createDefaultUserIfNoneExists = async () => {
  const userCount = await prisma.user.count();
  const adminCount = await prisma.user.count({
    where: {
      role: "ADMIN",
    },
  });
  if (userCount === 0 || adminCount === 0) {
    const hashedPassword = await bcryptjs.hash("admin123", 10);
    await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        fullName: "Admin User",
        role: "ADMIN",
      },
    });
    console.log("Default admin user created");
    return;
  }
};

export const createUser = async (
  email: string,
  password: string,
  fullName: string
): Promise<User & { learner: Learner }> => {
  const hashedPassword = await bcryptjs.hash(password, 10);
  return await prisma.$transaction(async (tx) => {
    //2 query chạy trong cùng 1 transaction, hoặc là cả 2 thành công, hoặc là cả 2 đều không thành công và sẽ được rollback, tx là biến đại diện của 1 cụm chứa 2 query này. Vì vậy ngay bên dưới khai báo tx.table là đại diện cho các query có ở cùng 1 transaction
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: "LEARNER",
      },
    });
    const learner = await tx.learner.create({
      data: {
        user_id: user.user_id,
      }
    })
    return { ...user, learner }
  });
};

export const getAllUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();
  return users;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      user_id: id,
    },
  });
  return user;
};

export const deleteUser = async (id: string): Promise<User> => {
  const user = await prisma.user.delete({
    where: {
      user_id: id,
    },
  });
  return user;
};


export const updateUserRoleService = async (id: string, role: Role): Promise<User> => {
  const updatedUser = await prisma.user.update({
    where: { user_id: id },
    data: { role: role },
  });
  return updatedUser;
}

// các field user được phép tự update
export interface UpdateUserData {
  fullName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: Date | string;
  city?: string;
  nation?: string;
}

export const editUserInformation = async (id: string, data: UpdateUserData): Promise<User> => {
  const existingUser = await prisma.user.findUnique({
    where: { user_id: id },
  });

  if (!existingUser) {
    throw new Error('User not found');
  }

  const updateData: any = {};
  if (data.fullName !== undefined) updateData.fullName = data.fullName;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.city !== undefined) updateData.city = data.city;
  if (data.nation !== undefined) updateData.nation = data.nation;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.avatar !== undefined) updateData.avatar = data.avatar;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.dateOfBirth !== undefined) {
    updateData.dateOfBirth = typeof data.dateOfBirth === 'string' ? new Date(data.dateOfBirth) : data.dateOfBirth;
  }

  const updatedUser = await prisma.user.update({
    where: { user_id: id },
    data: updateData,
  });

  return updatedUser;
};


export const getRecentlyActiveUsers = async (daysAgo: number = 7): Promise<User[]> => {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - daysAgo);

  return await prisma.user.findMany({
    where: {
      last_login: {
        gte: dateThreshold,
      },
    },
    orderBy: {
      last_login: 'desc',
    },
  });
};


export const getInactiveUsers = async (daysAgo: number = 30): Promise<User[]> => {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - daysAgo);

  return await prisma.user.findMany({
    where: {
      OR: [
        { last_login: { lt: dateThreshold } },
        { last_login: null },
      ],
    },
    orderBy: {
      last_login: 'asc',
    },
  });
};