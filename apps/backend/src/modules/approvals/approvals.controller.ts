import { Request, Response } from 'express';
import { approvalsService } from './approvals.service';
import { ApproveSchema, RejectSchema, RequestChangesSchema } from '@ecoflow/shared-validations';

export class ApprovalsController {
  async getDashboardMetrics(req: Request, res: Response) {
    try {
      const metrics = await approvalsService.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch metrics' });
    }
  }

  async getQueue(req: Request, res: Response) {
    try {
      const result = await approvalsService.getApprovals(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch approval queue' });
    }
  }

  async approve(req: Request, res: Response) {
    try {
      const data = ApproveSchema.parse(req.body);
      const approval = await approvalsService.approve(req.params.ecoId, data, (req as any).user.id);
      res.status(200).json(approval);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Validation failed' });
    }
  }

  async reject(req: Request, res: Response) {
    try {
      const data = RejectSchema.parse(req.body);
      const approval = await approvalsService.reject(req.params.ecoId, data, (req as any).user.id);
      res.status(200).json(approval);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Validation failed' });
    }
  }

  async requestChanges(req: Request, res: Response) {
    try {
      const data = RequestChangesSchema.parse(req.body);
      const approval = await approvalsService.requestChanges(req.params.ecoId, data, (req as any).user.id);
      res.status(200).json(approval);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Validation failed' });
    }
  }
}

export const approvalsController = new ApprovalsController();
