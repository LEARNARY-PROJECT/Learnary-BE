import prisma from "../lib/client";
import { Instructor, Status } from '../generated/prisma'

export const createInstructor = async (
  data: Omit<Instructor, 'instructor_id' | 'createdAt' | 'updatedAt'>
): Promise<Instructor> => {
  if (!data.user_id) {
    throw new Error('user_id is required');
  }

  const user = await prisma.user.findUnique({
    where: { user_id: data.user_id }
  });

  if (!user) {
    throw new Error('User not found');
  }
  const accountSecurity = await prisma.accountSecurity.findUnique({
    where: { user_id: data.user_id }
  });
  if (!accountSecurity || !accountSecurity.email_verified) {
    throw new Error('Email chưa được xác thực. Vui lòng xác thực email trước khi đăng ký làm giảng viên');
  }
  const existingInstructor = await prisma.instructor.findUnique({
    where: { user_id: data.user_id }
  });

  if (existingInstructor) {
    throw new Error('User is already registered as an instructor');
  }

  return prisma.instructor.create({ 
    data: {
      ...data,
      isVerified: data.isVerified ?? false,
      status: data.status ?? 'Inactive',
    }
  });
};

export const getInstructorById = async (instructor_id: string): Promise<Instructor | null> => {
  if (!instructor_id) {
    throw new Error('instructor_id is required');
  }

  return prisma.instructor.findUnique({ 
    where: { instructor_id },
    include: {
      user: true,
      instructorSpecialization: true,
      citizen_id_confirms: true,
      instructor_qualifications: true,
      courses: true,
    }
  });
};

export const getAllInstructors = async (filters?: {
  status?: Status;
  isVerified?: boolean;
}): Promise<Instructor[]> => {
  return prisma.instructor.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.isVerified !== undefined && { isVerified: filters.isVerified }),
    },
    include: {
      user: {
        select: {
          email: true,
          fullName: true,
          avatar: true,
        }
      },
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const updateInstructor = async (
  instructor_id: string, 
  data: Partial<Omit<Instructor, 'instructor_id' | 'user_id' | 'createdAt' | 'updatedAt'>>
): Promise<Instructor> => {
  if (!instructor_id) {
    throw new Error('instructor_id is required');
  }

  const instructor = await prisma.instructor.findUnique({
    where: { instructor_id }
  });

  if (!instructor) {
    throw new Error('Instructor not found');
  }

  return prisma.instructor.update({ 
    where: { instructor_id }, 
    data 
  });
};

export const deleteInstructor = async (instructor_id: string): Promise<Instructor> => {
  if (!instructor_id) {
    throw new Error('instructor_id is required');
  }

  const instructor = await prisma.instructor.findUnique({
    where: { instructor_id }
  });

  if (!instructor) {
    throw new Error('Instructor not found');
  }

  const coursesCount = await prisma.course.count({
    where: { instructor_id }
  });

  if (coursesCount > 0) {
    throw new Error('Cannot delete instructor with active courses. Please remove or transfer courses first.');
  }

  return prisma.instructor.delete({ where: { instructor_id } });
};

export const verifyInstructor = async (instructor_id: string): Promise<Instructor> => {
  if (!instructor_id) {
    throw new Error('instructor_id is required');
  }

  return prisma.instructor.update({
    where: { instructor_id },
    data: {
      isVerified: true,
      status: 'Active'
    }
  });
};

export const getInstructorByUserId = async (user_id: string): Promise<Instructor | null> => {
  if (!user_id) {
    throw new Error('user_id is required');
  }

  return prisma.instructor.findUnique({
    where: { user_id },
    include: {
      user: true,
      courses: true,
    }
  });
};
