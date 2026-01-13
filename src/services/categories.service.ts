import prisma from "../lib/client";
import { Category } from '../generated/prisma'
import { AppError } from "../utils/custom-error";
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
  return prisma.category.findMany({
    select:{
      category_id:true,
      category_name:true,
      slug:true,
      _count: {
        select: {
          courses:true
        }
      }
    }
  });
};

export const updateCategory = async (category_id: string, data: UpdateCategoryData) => {
  return prisma.category.update({ where: { category_id }, data });
};

export const deleteCategory = async (category_id: string) => {
  return prisma.category.delete({ where: { category_id } });
};
export const getCategoryBySlug = async (category_slug: string, page: number = 1, limit: number = 10) => {
  if(!category_slug) {
     throw new AppError("Can not found slug", 404)
  }
  const neededCat = await prisma.category.findFirst({
    where:{
      slug: category_slug
    },
  })
  if(!neededCat) {
    throw new AppError("Can not found category", 404)
  }
  const skip = (page - 1) * limit;
  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where:{
        category_id: neededCat.category_id
      },
      select:{
        course_id:true,
        hot:true,
        description:true,
        slug:true,
        title:true,
        instructor: {
          select: {
            user: {
              select: {
                fullName: true,
                avatar: true,
                user_id: true
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.course.count({
      where:{
        category_id: neededCat.category_id
      }
    })
  ]);

  return {
    data: courses,
    category:neededCat,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    }
  };
}
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
