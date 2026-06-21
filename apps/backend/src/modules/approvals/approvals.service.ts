import prisma from '../../utils/prisma';
import { PrismaClient, Prisma } from '@prisma/client';
import { ApproveInput, RejectInput, RequestChangesInput } from '@ecoflow/shared-validations';
import { versionsService } from '../versions/versions.service';
import { auditService } from '../audit/audit.service';
import { createNotification } from '../notifications/notifications.service';



export class ApprovalsService {
  async getApprovals(query: any) {
    const { page = 1, limit = 10, status, priority, search } = query;
    
    // An ECO goes into the Approval Queue when its status is 'Submitted' or 'Under Review'.
    // If the approver wants to see History, we can include other statuses.
    const where: Prisma.ECOWhereInput = {
      status: status ? status : { in: ['Submitted', 'Under Review'] }
    };

    if (search) {
      where.OR = [
        { eco_number: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (priority) where.priority = priority;

    const [total, ecos] = await Promise.all([
      prisma.eCO.count({ where }),
      prisma.eCO.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { product: true, submitter: { select: { full_name: true } } },
        orderBy: { updated_at: 'desc' }
      })
    ]);

    return { total, page: Number(page), limit: Number(limit), ecos };
  }

  async getDashboardMetrics() {
    const [pending, approvedThisMonth, rejected, highPriority] = await Promise.all([
      prisma.eCO.count({ where: { status: { in: ['Submitted', 'Under Review'] } } }),
      prisma.eCO.count({ where: { status: 'Approved', updated_at: { gte: new Date(new Date().setDate(1)) } } }),
      prisma.eCO.count({ where: { status: 'Rejected' } }),
      prisma.eCO.count({ where: { status: { in: ['Submitted', 'Under Review'] }, priority: { in: ['High', 'Critical'] } } })
    ]);
    return { pending, approvedThisMonth, rejected, highPriority };
  }

  async processApproval(ecoId: string, reviewerId: string, decision: 'Approved' | 'Rejected' | 'Changes Requested', notes: string) {
    const eco = await prisma.eCO.findUnique({ where: { id: ecoId } });
    if (!eco) throw new Error('ECO not found');
    
    // Only Submitted or Under Review ECOs can be processed
    if (!['Submitted', 'Under Review'].includes(eco.status)) {
      throw new Error(`Cannot process ECO with status ${eco.status}`);
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create the Approval Record
      const approval = await tx.approval.create({
        data: {
          eco_id: ecoId,
          reviewer_id: reviewerId,
          decision,
          review_notes: notes,
          reviewed_at: new Date()
        }
      });

      // Log the Activity
      await tx.approvalActivity.create({
        data: {
          approval_id: approval.id,
          action: decision,
          metadata: notes,
          performed_by: reviewerId
        }
      });

      // Update the ECO status
      await tx.eCO.update({
        where: { id: ecoId },
        data: { status: decision, reviewed_by: reviewerId }
      });

      // Update ECO Activity Log as well
      await tx.eCOActivity.create({
        data: {
          eco_id: ecoId,
          action: `Status Changed`,
          metadata: `ECO ${decision} by reviewer`,
          user_id: reviewerId
        }
      });

      return approval;
    });

    await auditService.log({
      entity_type: 'Approval',
      entity_id: result.id,
      action: 'CREATED',
      new_value: result,
      performed_by: reviewerId
    });

    await auditService.log({
      entity_type: 'ECO',
      entity_id: ecoId,
      action: 'STATUS_CHANGED',
      old_value: { status: eco.status },
      new_value: { status: decision },
      performed_by: reviewerId
    });

    // Notify the submitter
    try {
      const type = decision === 'Approved' ? 'success' : 'warning';
      await createNotification({
        user_id: eco.submitted_by,
        title: `ECO ${decision}`,
        message: `Your ECO-${eco.eco_number} was ${decision}.`,
        link: `/ecos/${eco.id}`,
        type
      });
    } catch (err) {
      console.error('Failed to send notification for approval decision:', err);
    }

    // Automatically generate versions if the decision was 'Approved'
    if (decision === 'Approved') {
      try {
        await versionsService.generateVersion(ecoId, reviewerId);
      } catch (err: any) {
        console.error('Failed to automatically generate versions after approval:', err);
        // Note: The approval transaction has already succeeded. We log the version generation error.
        // In a more robust system, we might use a job queue for reliability.
      }
    }

    return result;
  }

  async approve(ecoId: string, data: ApproveInput, reviewerId: string) {
    return this.processApproval(ecoId, reviewerId, 'Approved', data.review_notes);
  }

  async reject(ecoId: string, data: RejectInput, reviewerId: string) {
    return this.processApproval(ecoId, reviewerId, 'Rejected', data.review_notes);
  }

  async requestChanges(ecoId: string, data: RequestChangesInput, reviewerId: string) {
    return this.processApproval(ecoId, reviewerId, 'Changes Requested', data.review_notes);
  }
}

export const approvalsService = new ApprovalsService();
