import { Request, Response } from 'express';
import { reportsService } from './reports.service';
import { analyticsService } from '../analytics/analytics.service';
import { ReportFilterSchema } from '@ecoflow/shared-validations';

export class ReportsController {
  // Dashboards
  async getEngineerDashboard(req: Request, res: Response) {
    try {
      const data = await analyticsService.getEngineerDashboard((req as any).user.id);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch engineer dashboard' });
    }
  }

  async getApproverDashboard(req: Request, res: Response) {
    try {
      const timeframe = req.query.timeframe as string;
      const data = await analyticsService.getApproverDashboard((req as any).user.id, timeframe);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch approver dashboard' });
    }
  }

  async getProductionDashboard(req: Request, res: Response) {
    try {
      const data = await analyticsService.getProductionDashboard();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch production dashboard' });
    }
  }

  async getAdminDashboard(req: Request, res: Response) {
    try {
      const data = await analyticsService.getAdminDashboard();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch admin dashboard' });
    }
  }

  // Reports
  async getProductsReport(req: Request, res: Response) {
    try {
      const filters = ReportFilterSchema.parse(req.query);
      const data = await reportsService.getProductsReport(filters);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to fetch products report' });
    }
  }

  async getBomsReport(req: Request, res: Response) {
    try {
      const filters = ReportFilterSchema.parse(req.query);
      const data = await reportsService.getBomsReport(filters);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to fetch BOMs report' });
    }
  }

  async getEcosReport(req: Request, res: Response) {
    try {
      const filters = ReportFilterSchema.parse(req.query);
      const data = await reportsService.getEcosReport(filters);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to fetch ECOs report' });
    }
  }

  async getApprovalsReport(req: Request, res: Response) {
    try {
      const filters = ReportFilterSchema.parse(req.query);
      const data = await reportsService.getApprovalsReport(filters);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to fetch approvals report' });
    }
  }

  async getVersionsReport(req: Request, res: Response) {
    try {
      const filters = ReportFilterSchema.parse(req.query);
      const data = await reportsService.getVersionsReport(filters);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to fetch versions report' });
    }
  }

  async getUsersReport(req: Request, res: Response) {
    try {
      const filters = ReportFilterSchema.parse(req.query);
      const data = await reportsService.getUsersReport(filters);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to fetch users report' });
    }
  }

  // Export
  async exportReport(req: Request, res: Response) {
    try {
      const type = req.query.type as string;
      const filters = ReportFilterSchema.parse(req.query);
      let data: any[] = [];

      switch (type) {
        case 'products':
          data = await reportsService.getProductsReport(filters);
          break;
        case 'boms':
          data = await reportsService.getBomsReport(filters);
          break;
        case 'ecos':
          data = await reportsService.getEcosReport(filters);
          break;
        case 'approvals':
          data = await reportsService.getApprovalsReport(filters);
          break;
        case 'versions':
          data = await reportsService.getVersionsReport(filters);
          break;
        case 'users':
          data = await reportsService.getUsersReport(filters);
          break;
        default:
          return res.status(400).json({ error: 'Invalid report type for export' });
      }

      const csv = await reportsService.generateCSV(type, data);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}-report.csv"`);
      res.send(csv);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to export report' });
    }
  }
}

export const reportsController = new ReportsController();
