import { Request, Response } from 'express';
import { categoriesService } from './categories.service';
import { CreateCategorySchema, UpdateCategorySchema } from '@ecoflow/shared-validations';

export class CategoriesController {
  async getAll(req: Request, res: Response) {
    try {
      const categories = await categoriesService.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const category = await categoriesService.getCategoryById(req.params.id);
      if (!category) return res.status(404).json({ error: 'Category not found' });
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = CreateCategorySchema.parse(req.body);
      const performedBy = (req as any).user.id;
      const category = await categoriesService.createCategory(data, performedBy);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: 'Validation failed or category already exists' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = UpdateCategorySchema.parse(req.body);
      const performedBy = (req as any).user.id;
      const category = await categoriesService.updateCategory(req.params.id, data, performedBy);
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update category' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const performedBy = (req as any).user.id;
      await categoriesService.deleteCategory(req.params.id, performedBy);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete category' });
    }
  }
}

export const categoriesController = new CategoriesController();
