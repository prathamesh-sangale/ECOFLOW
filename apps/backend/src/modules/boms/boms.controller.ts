import { Request, Response } from 'express';
import { bomsService } from './boms.service';
import { 
  CreateBOMSchema, 
  UpdateBOMSchema, 
  CreateComponentSchema, 
  UpdateComponentSchema,
  BOMStatusSchema 
} from '@ecoflow/shared-validations';

export class BomsController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await bomsService.getBoms(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch BOMs' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const bom = await bomsService.getBomById(req.params.id);
      if (!bom) return res.status(404).json({ error: 'BOM not found' });
      res.json(bom);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch BOM' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = CreateBOMSchema.parse(req.body);
      const bom = await bomsService.createBom(data, (req as any).user.id);
      res.status(201).json(bom);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Validation failed' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = UpdateBOMSchema.parse(req.body);
      const bom = await bomsService.updateBom(req.params.id, data, (req as any).user.id);
      res.json(bom);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update BOM' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const status = BOMStatusSchema.parse(req.body.status);
      const bom = await bomsService.updateStatus(req.params.id, status, (req as any).user.id);
      res.json(bom);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update status' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const performedBy = (req as any).user.id;
      await bomsService.deleteBom(req.params.id, performedBy);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete BOM' });
    }
  }

  async addComponent(req: Request, res: Response) {
    try {
      const data = CreateComponentSchema.parse(req.body);
      const component = await bomsService.addComponent(req.params.id, data, (req as any).user.id);
      res.status(201).json(component);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Validation failed' });
    }
  }

  async updateComponent(req: Request, res: Response) {
    try {
      const data = UpdateComponentSchema.parse(req.body);
      const component = await bomsService.updateComponent(req.params.id, data, (req as any).user.id);
      res.json(component);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update component' });
    }
  }

  async removeComponent(req: Request, res: Response) {
    try {
      await bomsService.removeComponent(req.params.id, (req as any).user.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to remove component' });
    }
  }
}

export const bomsController = new BomsController();
