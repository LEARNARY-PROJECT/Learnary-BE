import prisma from "../lib/client";
import { Learner } from '../generated/prisma'
import { Request } from "express";
import * as LearnerService from "../services/learner.service";

/* Các helpers tổng quát */
export async function getRoleIdByUserId(user_id: string) {
  const user = await prisma.user.findUnique({
    where: { user_id },
    select: { role: true },
  });

  if (!user) return null;

  if (user.role === "LEARNER") {
    const learner = await prisma.learner.findUnique({ where: { user_id } });
    return { role: user.role, id: learner?.learner_id ?? null };
  }

  if (user.role === "INSTRUCTOR") {
    const instructor = await prisma.instructor.findUnique({
      where: { user_id },
    });
    return { role: user.role, id: instructor?.instructor_id ?? null };
  }

  if (user.role === "ADMIN") {
    const admin = await prisma.admin.findUnique({ where: { user_id } });
    return { role: user.role, id: admin?.admin_id ?? null };
  }

  return null;
}
//helper lấy ra id (string) của role theo user_id
export async function getOnlyRoleEntityId(
  user_id: string
): Promise<string | null> {
  const roleInfo = await getRoleIdByUserId(user_id);
  return roleInfo?.id ?? null;
}

/**
 * Confirm 1 entity (learner, instructor, admin) dựa vào role
 * @param req Express Request
 * @param expectedRole Role mong đợi ("LEARNER" | "INSTRUCTOR" | "ADMIN")
 * @returns Entity tương ứng hoặc null
 */
// export async function confirmEntity<T>(
//   req: Request,
//   expectedRole: "LEARNER" | "INSTRUCTOR" | "ADMIN"
// ): Promise<T | null> {
//   const user_id = req.user!.id;
//   const roleInfo = await getRoleIdByUserId(user_id);

//   if (!roleInfo || roleInfo.role !== expectedRole || !roleInfo.id) {
//     return null;
//   }
//   switch (expectedRole) {
//     case "LEARNER":
//       return (await prisma.learner.findUnique({ where: { learner_id: roleInfo.id } })) as T;
//     case "INSTRUCTOR":
//       return (await prisma.instructor.findUnique({ where: { instructor_id: roleInfo.id } })) as T;
//     case "ADMIN":
//       return (await prisma.admin.findUnique({ where: { admin_id: roleInfo.id } })) as T;
//     default:
//       return null;
//   }
// }