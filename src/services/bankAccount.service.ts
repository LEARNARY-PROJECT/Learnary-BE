import prisma from "../lib/client";
import { BankAccount } from '../generated/prisma'

export const createBankAccount = async (
  data: Omit<BankAccount, 'bank_id' | 'created_at' | 'updated_at'>
): Promise<BankAccount> => {
  if (!data.account_holder_name || !data.account_number || !data.bank_name || !data.instructor_id) {
    throw new Error('Missing required fields: bank_name, account_number, account_holder_name, instructor_id');
  }
  return prisma.bankAccount.create({ data });
};

export const getBankAccount = async (bank_id: string) => {
    if(!bank_id) {
        throw new Error("Missing field required")
    }
    return prisma.bankAccount.findUnique({ where: { bank_id } });
};

export const getAllBankAccount = async () => {
  return prisma.bankAccount.findMany();
};

export const updateBankAccount = async (
  bank_id: string, 
  data: Omit<Partial<BankAccount>, 'bank_id' | 'instructor_id' | 'created_at' | 'updated_at'>
): Promise<BankAccount> => {
  if (!bank_id) {
    throw new Error("Missing field required: bank_id");
  }
  return prisma.bankAccount.update({ where: { bank_id }, data });
};

export const deleteBankAccount = async (bank_id: string) => {
    if(!bank_id) {
        throw new Error("Missing field required")
    }
  return prisma.bankAccount.delete({ where: { bank_id } });
};
export const getBankById = async (id: string): Promise<BankAccount | null> => {
  return prisma.bankAccount.findUnique({
    where: { bank_id: id },
  });
};

export const getBankByInstructorId = async (instructor_id: string): Promise<BankAccount | null> => {
  if (!instructor_id) {
    throw new Error("Missing field required: instructor_id");
  }
  return prisma.bankAccount.findUnique({
    where: { instructor_id },
  });
};

export const updateBankByInstructorId = async (
  instructor_id: string, 
  data: Omit<Partial<BankAccount>, 'bank_id' | 'instructor_id' | 'created_at' | 'updated_at'>
): Promise<BankAccount> => {
  if (!instructor_id) {
    throw new Error("Missing field required: instructor_id");
  }
  
  // Upsert: Nếu chưa có thì tạo mới, nếu có rồi thì cập nhật
  return prisma.bankAccount.upsert({
    where: { instructor_id },
    update: data,
    create: {
      instructor_id,
      bank_name: data.bank_name || '',
      account_number: data.account_number || '',
      account_holder_name: data.account_holder_name || ''
    }
  });
};
