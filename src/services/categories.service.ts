import prisma from "../lib/client";
import { Category } from '../generated/prisma'
type UpdateCategoryData =  Partial<Omit<Category, 'category_id' | 'createdAt' | 'updatedAt'>>

const seedCategory = [
  { category_name: 'Lập trình web', slug: 'lap-trinh-web' },
  { category_name: 'Lập trình Mobile', slug: 'lap-trinh-mobile' },
  { category_name: 'Lập trình hướng đối tượng', slug: 'lap-trinh-huong-doi-tuong' },
  { category_name: 'DevOps', slug: 'devops' },
  { category_name: 'Tester', slug: 'tester' },
  { category_name: 'ORM', slug: 'orm' },
  { category_name: 'Database', slug: 'database' },
  { category_name: 'Typescript', slug: 'typescript' },
]
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

export const seedCategories = async () => {
  try {
    const existingCategories = await prisma.category.findMany();
    if (existingCategories.length > 0) {
      return { message: 'Categories already exist', count: existingCategories.length };
    }
    const createdCategories = await prisma.category.createMany({
      data: seedCategory,
      skipDuplicates: true,
    });
    console.log(`Seeded ${createdCategories.count} categories successfully`);
    return { message: 'Categories seeded successfully', count: createdCategories.count };
  } catch (error) {
    throw error;
  }
};
