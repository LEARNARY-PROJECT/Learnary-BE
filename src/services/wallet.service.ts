import prisma from "../lib/client";
import { Wallet } from "@prisma/client";

export const createWallet = async (data: Omit<Wallet, 'wallet_id' | 'createAt' | 'updateAt'>) => {
  return prisma.wallet.create({ data });
};

export const getWalletById = async (wallet_id: string) => {
  return prisma.wallet.findUnique({ where: { wallet_id } });
};

export const getAllWallets = async () => {
  return prisma.wallet.findMany();
};

export const updateWallet = async (wallet_id: string, data: Partial<Wallet>) => {
  return prisma.wallet.update({ where: { wallet_id }, data });
};

export const deleteWallet = async (wallet_id: string) => {
  return prisma.wallet.delete({ where: { wallet_id } });
};
