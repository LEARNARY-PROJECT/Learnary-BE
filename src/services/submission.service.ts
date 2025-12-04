import prisma from "../lib/client";
import { Prisma } from '../generated/prisma'
import { CreateSubmissionDTO, SubmissionResponse } from "../types/course";

export const createSubmission = async (input: CreateSubmissionDTO): Promise<SubmissionResponse> => {
  try {
    if (!input.quiz_id?.trim()) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Quiz ID is required',
        },
      };
    }

    if (!input.user_id?.trim()) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'User ID is required',
        },
      };
    }

    if (!input.answers || input.answers.length === 0) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Answers are required',
        },
      };
    }

    if (input.duration && input.duration.length > 100) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Duration must not exceed 100 characters',
        },
      };
    }

    const quiz = await prisma.quiz.findUnique({
      where: { quiz_id: input.quiz_id },
      select: { quiz_id: true, chapter_id: true },
    });

    if (!quiz) {
      return {
        success: false,
        error: {
          code: 'QUIZ_NOT_FOUND',
          message: 'Quiz does not exist',
          details: `Quiz with ID ${input.quiz_id} was not found`,
        },
      };
    }

    const user = await prisma.user.findUnique({
      where: { user_id: input.user_id },
      select: { user_id: true, isActive: true },
    });

    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User does not exist',
          details: `User with ID ${input.user_id} was not found`,
        },
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        error: {
          code: 'USER_INACTIVE',
          message: 'User account is inactive',
        },
      };
    }

    const existingSubmission = await prisma.submission.findUnique({
      where: {
        quiz_id_user_id: {
          quiz_id: input.quiz_id,
          user_id: input.user_id,
        },
      },
      select: { submission_id: true },
    });

    if (existingSubmission) {
      return {
        success: false,
        error: {
          code: 'DUPLICATE_SUBMISSION',
          message: 'Người dùng đã nộp bài quiz này rồi',
          details: `Submission ID: ${existingSubmission.submission_id}`,
        },
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      const submission = await tx.submission.create({
        data: {
          quiz_id: input.quiz_id,
          user_id: input.user_id,
          duration: input.duration || '00:00:00',
          is_completed: input.is_completed ?? false,
        },
      });

      const answersWithCorrectness = await Promise.all(
        input.answers.map(async (ans) => {
          const option = await tx.options.findUnique({
            where: { option_id: ans.option_id },
            select: { is_correct: true },
          });
          return {
            submission_id: submission.submission_id,
            question_id: ans.question_id,
            option_id: ans.option_id,
            is_correct: option?.is_correct ?? false,
          };
        })
      );

      await tx.answer.createMany({
        data: answersWithCorrectness,
      });

      const createdAnswers = await tx.answer.findMany({
        where: { submission_id: submission.submission_id },
        select: {
          answer_id: true,
          question_id: true,
          option_id: true,
          is_correct: true,
        },
      });

      return {
        submission_id: submission.submission_id,
        quiz_id: submission.quiz_id,
        user_id: submission.user_id,
        is_completed: submission.is_completed,
        duration: submission.duration,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
        submittedAt: submission.submittedAt,
        right_answer_count: createdAnswers.filter(a => a.is_correct).length,
        answers: createdAnswers,
      };
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: Lỗi trùng lặp dữ liệu
      if (error.code === 'P2002') {
        return {
          success: false,
          error: {
            code: 'DUPLICATE_SUBMISSION',
            message: 'Người dùng đã nộp bài quiz này rồi',
            details: 'Vi phạm ràng buộc duy nhất trên quiz_id và user_id',
          },
        };
      }

      // P2003: Lỗi ràng buộc khóa ngoại
      if (error.code === 'P2003') {
        const field = error.meta?.field_name as string;
        return {
          success: false,
          error: {
            code: 'FOREIGN_KEY_VIOLATION',
            message: 'Tham chiếu không hợp lệ',
            details: `Ràng buộc khóa ngoại thất bại ở trường: ${field}`,
          },
        };
      }

      // P2025: Không tìm thấy bản ghi
      if (error.code === 'P2025') {
        return {
          success: false,
          error: {
            code: 'RECORD_NOT_FOUND',
            message: 'Không tìm thấy bản ghi yêu cầu',
            details: error.meta?.cause as string,
          },
        };
      }
    }

    // Lỗi validation của Prisma
    if (error instanceof Prisma.PrismaClientValidationError) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dữ liệu không hợp lệ',
          details: 'Vui lòng kiểm tra lại dữ liệu đầu vào',
        },
      };
    }

    // Lỗi khác
    console.error('Lỗi khi tạo submission:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Đã xảy ra lỗi không mong muốn khi tạo submission',
        details: error instanceof Error ? error.message : 'Lỗi không xác định',
      },
    };
  }
};

export const getSubmissionById = async (submission_id: string, opts?: { include?: Prisma.SubmissionInclude }) => {
  return prisma.submission.findUnique({
    where: { submission_id },
    ...(opts ?? {})
  });
};

export const getAllSubmissions = async (opts?: { include?: Prisma.SubmissionInclude }) => {
  return prisma.submission.findMany({ ...(opts ?? {}) });
};

export const updateSubmission = async (submission_id: string, data: Prisma.SubmissionUpdateInput) => {
  return prisma.submission.update({ where: { submission_id }, data });
};

export const deleteSubmission = async (submission_id: string) => {
  return prisma.submission.delete({ where: { submission_id } });
};