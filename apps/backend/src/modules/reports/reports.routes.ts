import { Router } from 'express';
import { reportsController } from './reports.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';

const dashboardRouter = Router();
const reportsRouter = Router();

dashboardRouter.use(authenticate);
reportsRouter.use(authenticate);

// Dashboards
dashboardRouter.get('/engineer', requireRole(['Admin', 'Engineer']), reportsController.getEngineerDashboard);
dashboardRouter.get('/approver', requireRole(['Admin', 'Approver']), reportsController.getApproverDashboard);
dashboardRouter.get('/production', requireRole(['Admin', 'Production Manager', 'Production']), reportsController.getProductionDashboard);
dashboardRouter.get('/admin', requireRole(['Admin']), reportsController.getAdminDashboard);

// Export
reportsRouter.get('/export', requireRole(['Admin', 'Approver', 'Production Manager', 'Production', 'Engineer']), reportsController.exportReport);

// Reports
reportsRouter.get('/products', requireRole(['Admin', 'Approver', 'Production Manager', 'Production', 'Engineer']), reportsController.getProductsReport);
reportsRouter.get('/boms', requireRole(['Admin', 'Approver', 'Production Manager', 'Production', 'Engineer']), reportsController.getBomsReport);
reportsRouter.get('/ecos', requireRole(['Admin', 'Approver', 'Production Manager', 'Production', 'Engineer']), reportsController.getEcosReport);
reportsRouter.get('/approvals', requireRole(['Admin', 'Approver', 'Production Manager', 'Production', 'Engineer']), reportsController.getApprovalsReport);
reportsRouter.get('/versions', requireRole(['Admin', 'Approver', 'Production Manager', 'Production', 'Engineer']), reportsController.getVersionsReport);
reportsRouter.get('/users', requireRole(['Admin']), reportsController.getUsersReport);

export { dashboardRouter, reportsRouter };
