import { Request, Response } from 'express';
import { auditService } from './audit.service';

export class AuditController {
  async getLogs(req: Request, res: Response) {
    try {
      const filters = {
        entity_type: req.query.entity_type as string,
        action: req.query.action as string,
        performed_by: req.query.performed_by as string,
      };
      const logs = await auditService.getLogs(filters);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
  }

  async exportLogsCSV(req: Request, res: Response) {
    try {
      const csv = await auditService.exportLogsCSV();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
      res.status(200).send(csv);
    } catch (error) {
      res.status(500).json({ error: 'Failed to export audit logs' });
    }
  }
}

export const auditController = new AuditController();
