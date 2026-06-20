import { PrismaClient } from '@prisma/client';
import {
  EngineerDashboard,
  ApproverDashboard,
  ProductionDashboard,
  AdminDashboard
} from '@ecoflow/shared-types';

const prisma = new PrismaClient();

export class AnalyticsService {
  async getEngineerDashboard(userId: string): Promise<EngineerDashboard> {
    const [
      totalProducts,
      totalBoms,
      draftEcos,
      pendingReviews,
      approvedEcos,
      rejectedEcos,
      recentProducts,
      recentActivities
    ] = await Promise.all([
      prisma.product.count({ where: { created_by: userId } }),
      prisma.bOM.count({ where: { created_by: userId } }),
      prisma.eCO.count({ where: { submitted_by: userId, status: 'Draft' } }),
      prisma.eCO.count({ where: { submitted_by: userId, status: { in: ['Submitted', 'Under Review'] } } }),
      prisma.eCO.count({ where: { submitted_by: userId, status: 'Approved' } }),
      prisma.eCO.count({ where: { submitted_by: userId, status: 'Rejected' } }),
      prisma.product.findMany({
        where: { created_by: userId },
        orderBy: { created_at: 'desc' },
        take: 5
      }),
      prisma.eCOActivity.findMany({
        where: { eco: { submitted_by: userId } },
        orderBy: { created_at: 'desc' },
        take: 10,
        include: { eco: { select: { eco_number: true, title: true } } }
      })
    ]);

    return {
      totalProducts,
      totalBoms,
      draftEcos,
      pendingReviews,
      approvedEcos,
      rejectedEcos,
      recentProducts: recentProducts as any,
      recentActivities: recentActivities as any
    };
  }

  async getApproverDashboard(userId: string): Promise<ApproverDashboard> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      pendingReviews,
      approvalsThisMonth,
      rejectionsThisMonth,
      highPriorityRequests,
      approvalQueue,
      recentReviews
    ] = await Promise.all([
      prisma.eCO.count({ where: { status: { in: ['Submitted', 'Under Review'] } } }),
      prisma.approval.count({ where: { reviewer_id: userId, decision: 'Approved', reviewed_at: { gte: startOfMonth } } }),
      prisma.approval.count({ where: { reviewer_id: userId, decision: 'Rejected', reviewed_at: { gte: startOfMonth } } }),
      prisma.eCO.count({ where: { status: { in: ['Submitted', 'Under Review'] }, priority: { in: ['High', 'Critical'] } } }),
      prisma.eCO.findMany({
        where: { status: { in: ['Submitted', 'Under Review'] } },
        orderBy: { updated_at: 'desc' },
        take: 10,
        include: { submitter: { select: { full_name: true } } }
      }),
      prisma.approval.findMany({
        where: { reviewer_id: userId },
        orderBy: { reviewed_at: 'desc' },
        take: 10,
        include: { eco: { select: { eco_number: true, title: true } } }
      })
    ]);

    // Calculate mock average review time since we don't track submission time explicitly yet
    const averageReviewTimeHours = 24; 

    return {
      pendingReviews,
      approvalsThisMonth,
      rejectionsThisMonth,
      averageReviewTimeHours,
      highPriorityRequests,
      approvalQueue: approvalQueue as any,
      recentReviews: recentReviews as any
    };
  }

  async getProductionDashboard(): Promise<ProductionDashboard> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      activeVersions,
      recentReleases,
      productsReleased,
      pendingReleases,
      versionChanges,
      releaseTimeline,
      activeProductVersions
    ] = await Promise.all([
      prisma.productVersion.count({ where: { is_active: true } }),
      prisma.versionRelease.count({ where: { release_date: { gte: startOfMonth } } }),
      prisma.product.count({ where: { versions: { some: { is_active: true } } } }),
      prisma.eCO.count({ where: { status: 'Approved' } }), // Mocking pending releases
      prisma.eCOChange.count({ where: { created_at: { gte: startOfMonth } } }),
      prisma.versionRelease.findMany({
        orderBy: { release_date: 'desc' },
        take: 10,
        include: { product_version: { select: { version_number: true } }, releaser: { select: { full_name: true } } }
      }),
      prisma.productVersion.findMany({
        where: { is_active: true },
        orderBy: { created_at: 'desc' },
        take: 10,
        include: { product: { select: { product_name: true, product_code: true } } }
      })
    ]);

    return {
      activeVersions,
      recentReleases,
      productsReleased,
      pendingReleases,
      versionChanges,
      releaseTimeline: releaseTimeline as any,
      activeProductVersions: activeProductVersions as any
    };
  }

  async getAdminDashboard(): Promise<AdminDashboard> {
    const [
      totalUsers,
      activeUsers,
      totalProducts,
      totalBoms,
      totalEcos,
      totalApprovals,
      totalVersions,
      totalAuditEvents,
      recentAuditEvents
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.product.count(),
      prisma.bOM.count(),
      prisma.eCO.count(),
      prisma.approval.count(),
      prisma.productVersion.count(),
      prisma.auditLog.count(),
      prisma.auditLog.findMany({
        orderBy: { performed_at: 'desc' },
        take: 15,
        include: { user: { select: { full_name: true } } }
      })
    ]);

    return {
      totalUsers,
      activeUsers,
      totalProducts,
      totalBoms,
      totalEcos,
      totalApprovals,
      totalVersions,
      totalAuditEvents,
      recentAuditEvents: recentAuditEvents as any
    };
  }
}

export const analyticsService = new AnalyticsService();
