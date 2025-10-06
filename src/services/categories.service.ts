import prisma from "../lib/client";
import { Categories } from "@prisma/client";

export const createCategory = async (data: Omit<Categories, 'category_id' | 'createdAt' | 'updatedAt'>) => {
  // Validation
  if (!data.category_name || !data.slug) {
    throw new Error("category_name and slug are required");
  }
  if (data.category_name.length < 2 || data.category_name.length > 255) {
    throw new Error("category_name must be between 2 and 255 characters");
  }
  if (data.slug.length < 2 || data.slug.length > 255) {
    throw new Error("slug must be between 2 and 255 characters");
  }
  return prisma.categories.create({ data });
};

export const getCategoryById = async (category_id: string) => {
  return prisma.categories.findUnique({ where: { category_id } });
};

export const getAllCategories = async () => {
  return prisma.categories.findMany();
};

export const updateCategory = async (category_id: string, data: Partial<Categories>) => {
  return prisma.categories.update({ where: { category_id }, data });
};

export const deleteCategory = async (category_id: string) => {
  return prisma.categories.delete({ where: { category_id } });
};
