import bcryptjs from "bcryptjs";
import prisma from "../lib/client";
import { User, Learner } from "@prisma/client";
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
        role:"LEARNER",
      },
    });
    const learner = await tx.learner.create({
      data: {
        user_id: user.user_id,
      }
    })
    return {...user,learner}
  });
};

export const getAllUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();
  return users;
};

export const getUserById = async (id: string) : Promise<User|null> => {
  const user = await prisma.user.findUnique({
    where: {
      user_id:id,
    },
  });
  return user;
};

export const deleteUser = async (id: string):Promise<User> => {
  const user = await prisma.user.delete({
    where: {
      user_id:id,
    },
  });
  return user;
};
