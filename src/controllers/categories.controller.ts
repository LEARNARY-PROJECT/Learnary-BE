import { Request, Response } from "express";
import * as CategoriesService from "../services/categories.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const category = await CategoriesService.createCategory(req.body);
    res.status(201).json(success(category, "Category created successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to create category", e.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const category = await CategoriesService.getCategoryById(req.params.id);
    if (!category) {
      res.status(404).json(failure("Category not found"));
      return;
    }
    res.json(success(category, "Category fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch category", e.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const categories = await CategoriesService.getAllCategories();
    res.json(success(categories, "All categories fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch categories", e.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await CategoriesService.updateCategory(req.params.id, req.body);
    res.json(success(updated, "Category updated successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to update category", e.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await CategoriesService.deleteCategory(req.params.id);
    res.json(success(null, "Category deleted successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to delete category", e.message));
  }
};

export const getBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await CategoriesService.getCategoryBySlug(slug, page, limit);
    res.json(success(result, "Courses fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch courses by category slug", e.message));
  }
};
