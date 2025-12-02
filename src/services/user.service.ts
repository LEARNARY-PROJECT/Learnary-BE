import bcryptjs from "bcryptjs";
import prisma from "../lib/client";
import { User, Learner } from '../generated/prisma'
import type { Role, Wallet } from '../generated/prisma'
import { S3_BUCKET_NAME, s3Client } from '../config/s3.config';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { sliceHalfUserId } from "../utils/commons";
import type { JsonValue } from "../types/common";
export const createDefaultUserIfNoneExists = async () => {
  // Kiểm tra xem admin đã tồn tại chưa
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@example.com" }
  });

  if (existingAdmin) {
    console.log("Default admin user already exists");
    return;
  }

  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" }
  });

  if (adminCount === 0) {
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
  }
};

export const createUser = async (
  email: string,
  password: string,
  fullName: string
): Promise<User & { learner: Learner } & { wallet: Wallet}> => {
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
    const wallet = await tx.wallet.create({
      data: {
        user_id: user.user_id,
        balance: 0
      }
    })
    return { ...user, learner, wallet }
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
  country?:string;
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
  const updateData: Partial<UpdateUserData> = {...data};
  if(updateData.dateOfBirth) {
    const date = new Date(updateData.dateOfBirth);
    if(!isNaN(date.getTime())) {
      updateData.dateOfBirth=date.toISOString();
    } else {
      delete updateData.dateOfBirth;
    }
  }
  const updatedUser = await prisma.user.update({
    where: { user_id: id },
    data: updateData,
  });
  return updatedUser;
};

export const updateAvatar = async (userId: string, url: string): Promise<User> => {
  if (typeof userId !== "string" || typeof url !== "string") {
    throw new Error("Error: User Id and Url must be strings.");
  }
  
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("Error: This user does not exist!");
  }
  
  const updatedUser = await prisma.user.update({
    where: { user_id: userId },
    data: { avatar: url }
  });
  
  return updatedUser;
};

export const uploadAvatarToS3 = async (userId: string, file: Express.Multer.File): Promise<User> => {
  if (!userId) {
    throw new Error("User ID is required")
  }
  if (!file) {
    throw new Error("File is required")
  }
  const user = await getUserById(userId)
  if (!user) {
    throw new Error("User not found")
  }
  const halfUserId = sliceHalfUserId(userId)
  // 1 user = 1 link url avatar 
  const fileExtension = path.extname(file.originalname)
  const fileName = `${halfUserId}${fileExtension}`
  const s3Key = `avatar/${fileName}`
  try {
    if(user.avatar) {
      const oldAvatarUrl = user.avatar;
      const oldS3Key = oldAvatarUrl.replace(`https://${S3_BUCKET_NAME}.s3.amazonaws.com/`,'');
      if(oldS3Key !== s3Key) {
        try {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: oldS3Key
          }));
        } catch (deleteError) {
          console.warn('Warning: Failed to delete old avatar:', deleteError);
        }
      }
    }
  } catch (error) {
    throw new Error("Error while compare URL avatar")
  }
  const uploadParams = {
    Bucket: S3_BUCKET_NAME,
    Key: s3Key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams))
    const avatarUrl = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`
    
    const updatedUser = await updateAvatar(userId, avatarUrl)
    return updatedUser
  } catch (error) {
    console.error('Error uploading to S3:', error)
    throw new Error('Failed to upload avatar to S3')
  }
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

export const getFullUserProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: { user_id: userId },
    include: {
      wallet: true,
      transactions: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      },
      learner: {
        include: {
          learner_courses: {
            include: {
              course: {
                select: {
                  title: true,
                  thumbnail: true,
                  slug: true,
                  price: true
                }
              }
            }
          }
        }
      },
      instructor: {
        include: {
          instructor_qualifications: {
            where: { status: 'Approved' }
          },
          instructorSpecialization: {
            include: {
              specialization: true
            }
          },
          courses: {
            select: {
              course_id: true,
              title: true,
              thumbnail: true,
              status: true,
              price: true,
              createdAt: true,
              _count: {
                select: { learnerCourses: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  });
};