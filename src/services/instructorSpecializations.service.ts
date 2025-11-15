import prisma from "../lib/client";
import { InstructorSpecializations } from "@prisma/client";

export const createInstructorSpecializations = async (data: Omit<InstructorSpecializations, 'instructor_specialization_id' | 'createdAt' | 'updatedAt'>): Promise<InstructorSpecializations> => {
  if (!data.instructor_id || !data.specialization_id || !data.admin_id) {
    throw new Error('instructor_id, specialization_id, and admin_id are required');
  }

  const instructor = await prisma.instructor.findUnique({
    where: { instructor_id: data.instructor_id }
  });

  if (!instructor) {
    throw new Error('Instructor not found');
  }

  const specialization = await prisma.specialization.findUnique({
    where: { specialization_id: data.specialization_id }
  });

  if (!specialization) {
    throw new Error('Specialization not found');
  }

  const admin = await prisma.admin.findUnique({
    where: { admin_id: data.admin_id }
  });

  if (!admin) {
    throw new Error('Admin not found');
  }

  const existing = await prisma.instructorSpecializations.findFirst({ 
    where: {
      instructor_id: data.instructor_id,
      specialization_id: data.specialization_id
    }
  });

  if (existing) {
    throw new Error('This instructor-specialization relationship already exists');
  }

  return prisma.instructorSpecializations.create({ data });
};

export const getInstructorSpecializationsById = async (instructor_specialization_id: string):Promise<InstructorSpecializations | null> => {
  if (!instructor_specialization_id) {
    throw new Error('instructor_specialization_id is required');
  }

  return prisma.instructorSpecializations.findUnique({ 
    where: { instructor_specialization_id },
    include: {
      instructor: {
        include: {
          user: true
        }
      },
      specialization: true,
      admin: {
        include: {
          user: true
        }
      }
    }
  });
};

export const getAllInstructorSpecializations = async (): Promise<InstructorSpecializations[]> => {
  return prisma.instructorSpecializations.findMany({
    include: {
      instructor: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true
            }
          }
        }
      },
      specialization: true,
      admin: {
        include: {
          user: {
            select: {
              fullName: true
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

export const updateInstructorSpecializations = async (instructor_specialization_id: string, data: Partial<Omit<InstructorSpecializations, 'instructor_specialization_id' | 'instructor_id' | 'specialization_id' | 'createdAt' | 'updatedAt'>>): Promise<InstructorSpecializations> => {
  if (!instructor_specialization_id) {
    throw new Error('instructor_specialization_id is required');
  }

  const record = await prisma.instructorSpecializations.findUnique({
    where: { instructor_specialization_id }
  });

  if (!record) {
    throw new Error('Instructor specialization not found');
  }

  if (data.admin_id) {
    const admin = await prisma.admin.findUnique({
      where: { admin_id: data.admin_id }
    });

    if (!admin) {
      throw new Error('Admin not found');
    }
  }

  return prisma.instructorSpecializations.update({ 
    where: { instructor_specialization_id }, 
    data 
  });
};

export const deleteInstructorSpecializations = async (instructor_specialization_id: string): Promise<InstructorSpecializations> => {
  if (!instructor_specialization_id) {
    throw new Error('instructor_specialization_id is required');
  }

  const record = await prisma.instructorSpecializations.findUnique({
    where: { instructor_specialization_id }
  });

  if (!record) {
    throw new Error('Instructor specialization not found');
  }

  return prisma.instructorSpecializations.delete({ 
    where: { instructor_specialization_id } 
  });
};

export const getSpecializationsByInstructor = async (instructor_id: string): Promise<InstructorSpecializations[]> => {
  if (!instructor_id) {
    throw new Error('instructor_id is required');
  }

  return prisma.instructorSpecializations.findMany({
    where: { instructor_id },
    include: {
      specialization: true,
      admin: {
        include: {
          user: {
            select: {
              fullName: true
            }
          }
        }
      }
    }
  });
};
