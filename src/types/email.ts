import { Transaction, User, WithdrawRequest } from "../generated/prisma";

export interface OrderConfirmationData {
  orderCode: string;
  courseName: string;
  coursePrice: number;
  transactionDate: string;
  buyerEmail: string;
  buyerName: string;
}
export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface sendNoticeWithdrawProps {
  user:User;
  transaction: Transaction;
  request:WithdrawRequest
}

export interface CourseApprovedData {
  instructorName: string;
  instructorEmail: string;
  courseName: string;
  courseDescription?: string;
  coursePrice: number;
  approvedAt: Date;
}

export interface CourseRejectedData {
  instructorName: string;
  instructorEmail: string;
  courseName: string;
  courseDescription?: string;
  coursePrice: number;
  rejectionReason: string;
  rejectedAt: Date;
}
