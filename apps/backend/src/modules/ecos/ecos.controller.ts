import { Request, Response } from 'express';
import { ecosService } from './ecos.service';
import { 
  CreateECOSchema, 
  UpdateECOSchema, 
  CreateChangeSchema, 
  CreateCommentSchema,
  ECOStatusSchema 
} from '@ecoflow/shared-validations';

export class EcosController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await ecosService.getEcos(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ECOs' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const eco = await ecosService.getEcoById(req.params.id);
      if (!eco) return res.status(404).json({ error: 'ECO not found' });
      res.json(eco);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ECO' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = CreateECOSchema.parse(req.body);
      const eco = await ecosService.createEco(data, (req as any).user.id);
      res.status(201).json(eco);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Validation failed' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = UpdateECOSchema.parse(req.body);
      const eco = await ecosService.updateEco(req.params.id, data, (req as any).user.id);
      res.json(eco);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update ECO' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const status = ECOStatusSchema.parse(req.body.status);
      const eco = await ecosService.updateStatus(req.params.id, status, (req as any).user.id);
      res.json(eco);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update status' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await ecosService.deleteEco(req.params.id, (req as any).user.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete ECO' });
    }
  }

  async addChange(req: Request, res: Response) {
    try {
      const data = CreateChangeSchema.parse(req.body);
      const change = await ecosService.addChange(req.params.id, data, (req as any).user.id);
      res.status(201).json(change);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Validation failed' });
    }
  }

  async removeChange(req: Request, res: Response) {
    try {
      await ecosService.removeChange(req.params.id, (req as any).user.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to remove change' });
    }
  }

  async addComment(req: Request, res: Response) {
    try {
      const data = CreateCommentSchema.parse(req.body);
      const comment = await ecosService.addComment(req.params.id, data, (req as any).user.id);
      res.status(201).json(comment);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Validation failed' });
    }
  }

  async removeComment(req: Request, res: Response) {
    try {
      await ecosService.removeComment(req.params.id, (req as any).user.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to remove comment' });
    }
  }
}

export const ecosController = new EcosController();
