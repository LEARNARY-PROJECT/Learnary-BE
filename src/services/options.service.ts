import prisma from "../lib/client";
import { Prisma } from "@prisma/client";

export const createOption = async (data: Prisma.OptionsCreateInput) => {
  return prisma.options.create({ data });
};

export const getOptionById = async (
  option_id: string,
  opts?: { include?: Prisma.OptionsInclude }
) => {
  return prisma.options.findUnique({ 
    where: { option_id }, 
    ...(opts ?? {}) 
  });
};

export const getAllOptions = async (opts?: { include?: Prisma.OptionsInclude }) => {
  return prisma.options.findMany({ ...(opts ?? {}) });
};

export const updateOption = async (
  option_id: string,
  data: Prisma.OptionsUpdateInput
) => {
  return prisma.options.update({ where: { option_id }, data });
};

export const deleteOption = async (option_id: string) => {
  return prisma.options.delete({ where: { option_id } });
};