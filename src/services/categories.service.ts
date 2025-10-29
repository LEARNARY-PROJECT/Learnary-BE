import prisma from "../lib/client";
import { Category } from "@prisma/client";
type UpdateCategoryData =  Partial<Omit<Category, 'category_id' | 'createdAt' | 'updatedAt'>>
export const createCategory = async (data: Omit<Category, 'category_id' | 'createdAt' | 'updatedAt'>) => {
  if (!data.category_name || !data.slug) {
    throw new Error("category_name and slug are required");
  }
  if (data.category_name.length < 2 || data.category_name.length > 255) {
    throw new Error("category_name must be between 2 and 255 characters");
  }
  if (data.slug.length < 2 || data.slug.length > 255) {
    throw new Error("slug must be between 2 and 255 characters");
  }
  return prisma.category.create({ data });
};

export const getCategoryById = async (category_id: string) => {
  return prisma.category.findUnique({ where: { category_id } });
};

export const getAllCategories = async () => {
  return prisma.category.findMany();
};

export const updateCategory = async (category_id: string, data: UpdateCategoryData) => {
  return prisma.category.update({ where: { category_id }, data });
};

export const deleteCategory = async (category_id: string) => {
  return prisma.category.delete({ where: { category_id } });
};
