import { Request, Response } from 'express';
import { productsService } from './products.service';
import { CreateProductSchema, UpdateProductSchema, ProductStatusSchema } from '@ecoflow/shared-validations';

export class ProductsController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await productsService.getProducts(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const product = await productsService.getProductById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = CreateProductSchema.parse(req.body);
      const product = await productsService.createProduct(data, (req as any).user.id);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Validation failed or product already exists' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = UpdateProductSchema.parse(req.body);
      const product = await productsService.updateProduct(req.params.id, data, (req as any).user.id);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update product' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const status = ProductStatusSchema.parse(req.body.status);
      const product = await productsService.updateStatus(req.params.id, status, (req as any).user.id);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update status' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const performedBy = (req as any).user.id;
      await productsService.deleteProduct(req.params.id, performedBy);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete product' });
    }
  }
}

export const productsController = new ProductsController();
