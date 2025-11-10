import prisma from "../lib/client";
import { InstructorQualifications, QualificationType, ApprovalStatus } from "@prisma/client";
import { uploadQualificationImages, deleteQualificationImages, deleteSingleQualificationImage } from "./qualificationImage.service";
import { validateQualificationDates, toStartOfDay, getTodayStartOfDay } from "../utils/dateUtils";

export const createInstructorQualifications = async (
  data: Omit<InstructorQualifications, 'instructor_qualification_id' | 'createdAt' | 'updateAt' | 'qualification_images' | 'instructor_id'> & { 
    specialization_name?: string;
    user_id: string; 
  },
  files?: Express.Multer.File[]
): Promise<InstructorQualifications> => {
  if (!data.title || !data.issue_date) {
    throw new Error('Missing required fields');
  }

  if (!data.specialization_id && !data.specialization_name) {
    throw new Error('Either specialization_id or specialization_name is required');
  }
  if (!data.user_id) {
    throw new Error('user_id is required');
  }

  const user = await prisma.user.findUnique({
    where: { user_id: data.user_id }
  });

  if (!user) {
    throw new Error('User not found');
  }

  let instructor = await prisma.instructor.findUnique({
    where: { user_id: data.user_id }
  });

  if (!instructor) {
    // Tạo instructor record mới (chưa verify) - LẦN ĐẦU SUBMIT QUALIFICATION
    instructor = await prisma.instructor.create({
      data: {
        user_id: data.user_id,
        isVerified: false
      }
    });
  }

  const instructorId = instructor.instructor_id;

  let specializationId = data.specialization_id;

  if (data.specialization_name && !data.specialization_id) {
    const existingSpec = await prisma.specialization.findUnique({
      where: { specialization_name: data.specialization_name }
    });

    if (existingSpec) {
      specializationId = existingSpec.specialization_id;
    } else {
      const newSpec = await prisma.specialization.create({
        data: {
          specialization_name: data.specialization_name,
          instructor_id: instructorId!,
          isVerified: false
        }
      });
      specializationId = newSpec.specialization_id;
    }
  }

  if (!specializationId) {
    throw new Error('Unable to determine specialization_id');
  }

  validateQualificationDates(data.issue_date, data.expire_date ?? undefined);
  const issueDate = toStartOfDay(data.issue_date);
  const expireDate = data.expire_date ? toStartOfDay(data.expire_date) : undefined;

  const qualification = await prisma.instructorQualifications.create({ 
    data: {
      instructor_id: instructorId!,
      specialization_id: specializationId,
      title: data.title,
      issue_date: issueDate, 
      expire_date: expireDate,
      type: data.type ?? 'Certificate',
      status: data.status ?? 'Pending',
      isVerified: data.isVerified ?? false,
      qualification_images: [],
    }
  });

  if (files && files.length > 0) {
    const imageUrls = await uploadQualificationImages(qualification.instructor_qualification_id, files);
    
    return prisma.instructorQualifications.update({
      where: { instructor_qualification_id: qualification.instructor_qualification_id },
      data: { qualification_images: imageUrls }
    });
  }

  return qualification;
};

export const getInstructorQualificationsById = async (instructor_qualification_id: string): Promise<InstructorQualifications | null> => {
  if (!instructor_qualification_id) {
    throw new Error('instructor_qualification_id is required');
  }

  return prisma.instructorQualifications.findUnique({ 
    where: { instructor_qualification_id },
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
      specialization: true
    }
  });
};

export const getAllInstructorQualifications = async (filters?: {
  instructor_id?: string;
  specialization_id?: string;
  status?: ApprovalStatus;
  isVerified?: boolean;
  type?: QualificationType;
}): Promise<InstructorQualifications[]> => {
  return prisma.instructorQualifications.findMany({
    where: {
      ...(filters?.instructor_id && { instructor_id: filters.instructor_id }),
      ...(filters?.specialization_id && { specialization_id: filters.specialization_id }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.isVerified !== undefined && { isVerified: filters.isVerified }),
      ...(filters?.type && { type: filters.type }),
    },
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
      specialization: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const updateInstructorQualifications = async ( instructor_qualification_id: string, data: Partial<Omit<InstructorQualifications, 'instructor_qualification_id' | 'instructor_id' | 'specialization_id' | 'createdAt' | 'updateAt'>>): Promise<InstructorQualifications> => {
  if (!instructor_qualification_id) {
    throw new Error('instructor_qualification_id is required');
  }

  const qualification = await prisma.instructorQualifications.findUnique({
    where: { instructor_qualification_id }
  });
  if (!qualification) {
    throw new Error('Instructor qualification not found');
  }

  // Validate dates if being updated
  if (data.issue_date || data.expire_date) {
    const issueDate = data.issue_date ?? qualification.issue_date;
    const expireDate = data.expire_date ?? qualification.expire_date;

    validateQualificationDates(issueDate, expireDate);
  }

  return prisma.instructorQualifications.update({ 
    where: { instructor_qualification_id }, 
    data 
  });
};

export const deleteInstructorQualifications = async (instructor_qualification_id: string): Promise<InstructorQualifications> => {
  if (!instructor_qualification_id) {
    throw new Error('instructor_qualification_id is required');
  }

  const qualification = await prisma.instructorQualifications.findUnique({
    where: { instructor_qualification_id }
  });

  if (!qualification) {
    throw new Error('Instructor qualification not found');
  }

  if (qualification.qualification_images && qualification.qualification_images.length > 0) {
    await deleteQualificationImages(qualification.qualification_images);
  }

  return prisma.instructorQualifications.delete({ 
    where: { instructor_qualification_id } 
  });
};

export const approveQualification = async (instructor_qualification_id: string, admin_id: string): Promise<InstructorQualifications> => {
  if (!instructor_qualification_id) {
    throw new Error('instructor_qualification_id is required');
  }

  if (!admin_id) {
    throw new Error('admin_id is required');
  }

  const qualification = await prisma.instructorQualifications.findUnique({
    where: { instructor_qualification_id: instructor_qualification_id },
    include: {
      specialization: true,
      instructor: true // Include instructor để lấy user_id
    }
  });

  if (!qualification) {
    throw new Error('Qualification not found');
  }

  const admin = await prisma.admin.findUnique({
    where: { admin_id }
  });

  if (!admin) {
    throw new Error('Admin not found');
  }

  return prisma.$transaction(async (tx) => {
    // duyệt qualification
    const updatedQualification = await tx.instructorQualifications.update({
      where: { instructor_qualification_id },
      data: {
        status: 'Approved',
        isVerified: true
      }
    });

    // duyệt instructor
    if (!qualification.instructor.isVerified) {
      await tx.instructor.update({
        where: { instructor_id: qualification.instructor_id },
        data: { isVerified: true }
      });
    }

    // Đổi role user 
    await tx.user.update({
      where: { user_id: qualification.instructor.user_id },
      data: { role: 'INSTRUCTOR' }
    });

    // 4. duyệt specialization
    if (!qualification.specialization.isVerified) {
      await tx.specialization.update({
        where: { specialization_id: qualification.specialization_id },
        data: { isVerified: true }
      });
    }

    // tạo relationship
    const existingLink = await tx.instructorSpecializations.findFirst({
      where: {
        instructor_id: qualification.instructor_id,
        specialization_id: qualification.specialization_id
      }
    });

    if (!existingLink) {
      await tx.instructorSpecializations.create({
        data: {
          instructor_id: qualification.instructor_id,
          specialization_id: qualification.specialization_id,
          admin_id: admin_id
        }
      });
    }

    return updatedQualification;
  });
};

export const rejectQualification = async (instructor_qualification_id: string): Promise<InstructorQualifications> => {
  if (!instructor_qualification_id) {
    throw new Error('instructor_qualification_id is required');
  }
  const qualification = await prisma.instructorQualifications.findUnique({
    where: { instructor_qualification_id },
    include: {
      specialization: true
    }
  });
  if (!qualification) {
    throw new Error('Qualification not found');
  }
  return prisma.$transaction(async (tx) => {
    const rejectedQualification = await tx.instructorQualifications.update({
      where: { instructor_qualification_id },
      data: {
        status: 'Rejected',
        isVerified: false
      }
    });

    if (qualification.qualification_images && qualification.qualification_images.length > 0) {
      await deleteQualificationImages(qualification.qualification_images);
      
      await tx.instructorQualifications.update({
        where: { instructor_qualification_id },
        data: { qualification_images: [] }
      });
    }

    if (!qualification.specialization.isVerified) {
      const otherQualifications = await tx.instructorQualifications.count({
        where: {
          specialization_id: qualification.specialization_id,
          instructor_qualification_id: {
            not: instructor_qualification_id /* không đếm id đang có trong hàm */
          }
        }
      });
      if (otherQualifications === 0) {
        await tx.specialization.delete({
          where: { specialization_id: qualification.specialization_id }
        });
      }
    }
    return rejectedQualification;
  });
};

export const getQualificationsByInstructor = async (instructor_id: string): Promise<InstructorQualifications[]> => {
  if (!instructor_id) {
    throw new Error('instructor_id is required');
  }

  return prisma.instructorQualifications.findMany({
    where: { instructor_id },
    include: {
      specialization: true
    },
    orderBy: {
      issue_date: 'desc'
    }
  });
};

export const getQualificationsByUserId = async (user_id: string): Promise<InstructorQualifications[]> => {
  if (!user_id) {
    throw new Error('user_id is required');
  }
  const instructor = await prisma.instructor.findUnique({
    where: { user_id }
  });

  if (!instructor) {
    return [];
  }

  return prisma.instructorQualifications.findMany({
    where: { instructor_id: instructor.instructor_id },
    include: {
      specialization: true,
      instructor: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true
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

export const checkExpiredQualifications = async (): Promise<InstructorQualifications[]> => {
  const today = getTodayStartOfDay();
  
  return prisma.instructorQualifications.findMany({
    where: {
      expire_date: {
        lt: today
      },
      status: 'Approved'
    },
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
      }
    }
  });
};

export const deleteSingleImage = async (instructor_qualification_id: string, imageUrl: string): Promise<InstructorQualifications> => {
  if (!instructor_qualification_id || !imageUrl) {
    throw new Error('instructor_qualification_id and imageUrl are required');
  }

  const qualification = await prisma.instructorQualifications.findUnique({
    where: { instructor_qualification_id }
  });

  if (!qualification) {
    throw new Error('Qualification not found');
  }

  if (!qualification.qualification_images.includes(imageUrl)) {
    throw new Error('Image not found in qualification');
  }

  await deleteSingleQualificationImage(imageUrl);

  const updatedImages = qualification.qualification_images.filter(url => url !== imageUrl);

  return prisma.instructorQualifications.update({
    where: { instructor_qualification_id },
    data: { qualification_images: updatedImages }
  });
};
