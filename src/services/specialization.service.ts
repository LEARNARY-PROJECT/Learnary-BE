import prisma from "../lib/client";
import { Specialization } from '../generated/prisma'

export const createSpecialization = async (data: Omit<Specialization, 'specialization_id' | 'createdAt' | 'updatedAt'>):Promise<Specialization> => {
  if (!data.specialization_name || !data.instructor_id) {
    throw new Error('specialization_name and instructor_id are required');
  }
  const instructor = await prisma.instructor.findUnique({
    where: { instructor_id: data.instructor_id }
  });
  if (!instructor) {
    throw new Error('Instructor not found');
  }
  const existingSpec = await prisma.specialization.findUnique({
    where: { specialization_name: data.specialization_name }
  });
  if (existingSpec) {
    throw new Error('Specialization name already exists');
  }
  return prisma.specialization.create({ 
    data: {
      ...data,
      isVerified: data.isVerified ?? false,
    }
  });
};

export const getSpecializationById = async (id: string): Promise<Specialization | null> => {
  if (!id) {
    throw new Error('specialization_id is required');
  }
  return prisma.specialization.findUnique({ 
    where: { specialization_id: id },
    include: {
      specialization: true,
      instructorQualifications: true,
    }
  });
};

export const getAllSpecializations = async (filters?: {isVerified?: boolean;}): Promise<Specialization[]> => {
  return prisma.specialization.findMany({
    where: {
      ...(filters?.isVerified !== undefined && { isVerified: filters.isVerified }),
    },
    orderBy: {
      specialization_name: 'asc'
    }
  });
};

export const updateSpecialization = async (specialization_id: string, data: Partial<Omit<Specialization, 'specialization_id' | 'instructor_id' | 'createdAt' | 'updatedAt'>>): Promise<Specialization> => {
  if (!specialization_id) {
    throw new Error('specialization_id is required');
  }
  const specialization = await prisma.specialization.findUnique({
    where: { specialization_id }
  });
  if (!specialization) {
    throw new Error('Specialization not found');
  }
  if (data.specialization_name) {
    const existingSpec = await prisma.specialization.findFirst({
      where: {
        specialization_name: data.specialization_name,
        NOT: { specialization_id }
      }
    });
    if (existingSpec) {
      throw new Error('Specialization name already exists');
    }
  }

  return prisma.specialization.update({ 
    where: { specialization_id }, 
    data 
  });
};
export const deleteSpecialization = async (specialization_id: string): Promise<Specialization> => {
  if (!specialization_id) {
    throw new Error('Mising field required is required');
  }
  const specialization = await prisma.specialization.findUnique({
    where: { specialization_id }
  });

  if (!specialization) {
    throw new Error('Specialization not found');
  }

  const qualificationsCount = await prisma.instructorQualifications.count({
    where: { specialization_id }
  });

  if (qualificationsCount > 0) {
    throw new Error('Cannot delete specialization with existing qualifications');
  }

  return prisma.specialization.delete({ where: { specialization_id } });
};
export const verifySpecialization = async (specialization_id: string): Promise<Specialization> => {
  if (!specialization_id) {
    throw new Error('Mising field required is required');
  }

  return prisma.specialization.update({
    where: { specialization_id },
    data: { isVerified: true }
  });
};

export const getSpecializationsByInstructor = async (instructor_id: string): Promise<Specialization[]> => {
  if (!instructor_id) {
    throw new Error('instructor_id is required');
  }

  return prisma.specialization.findMany({
    where: { instructor_id }
  });
};
