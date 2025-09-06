import prisma from "../lib/client";
import { AccountSecurity } from "@prisma/client";

export const createAccountSecurity = async (data: Omit<AccountSecurity, 'account_security_id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.accountSecurity.create({ data });
};

export const getAccountSecurityById = async (account_security_id: string) => {
  return prisma.accountSecurity.findUnique({ where: { account_security_id } });
};

export const getAllAccountSecurities = async () => {
  return prisma.accountSecurity.findMany();
};

export const updateAccountSecurity = async (account_security_id: string, data: Partial<AccountSecurity>) => {
  return prisma.accountSecurity.update({ where: { account_security_id }, data });
};

export const deleteAccountSecurity = async (account_security_id: string) => {
  return prisma.accountSecurity.delete({ where: { account_security_id } });
};
