import { PrismaClient, Prisma } from '@prisma/client';
import { CreateECOInput, UpdateECOInput, CreateChangeInput, CreateCommentInput } from '@ecoflow/shared-validations';
import { auditService } from '../audit/audit.service';

const prisma = new PrismaClient();

export class EcosService {
  async getEcos(query: any) {
    const { page = 1, limit = 10, search, product_id, status, priority } = query;
    
    const where: Prisma.ECOWhereInput = {};
    if (search) {
      where.OR = [
        { eco_number: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (product_id) where.product_id = product_id;
    if (status) where.status = status;
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

  async getEcoById(id: string) {
    return prisma.eCO.findUnique({
      where: { id },
      include: {
        product: true,
        bom: true,
        changes: { orderBy: { created_at: 'asc' } },
        comments: { include: { user: { select: { full_name: true } } }, orderBy: { created_at: 'asc' } },
        attachments: { include: { uploader: { select: { full_name: true } } }, orderBy: { uploaded_at: 'desc' } },
        activities: { include: { user: { select: { full_name: true } } }, orderBy: { created_at: 'desc' } },
        submitter: { select: { full_name: true } },
        reviewer: { select: { full_name: true } }
      }
    });
  }

  async createEco(data: CreateECOInput, userId: string) {
    const product = await prisma.product.findUnique({ where: { id: data.product_id } });
    if (!product) throw new Error('Product not found');

    const bom = await prisma.bOM.findUnique({ where: { id: data.bom_id } });
    if (!bom) throw new Error('BOM not found');

    const eco = await prisma.eCO.create({
      data: {
        eco_number: data.eco_number,
        product_id: data.product_id,
        bom_id: data.bom_id,
        title: data.title,
        description: data.description,
        reason: data.reason,
        priority: data.priority || 'Low',
        status: 'Draft',
        submitted_by: userId,
      }
    });

    await prisma.eCOActivity.create({
      data: {
        eco_id: eco.id,
        action: 'ECO Created',
        metadata: `Created Draft ECO ${eco.eco_number}`,
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'ECO',
      entity_id: eco.id,
      action: 'CREATED',
      new_value: eco,
      performed_by: userId
    });

    return eco;
  }

  async updateEco(id: string, data: UpdateECOInput, userId: string) {
    const existing = await prisma.eCO.findUnique({ where: { id } });
    if (!existing) throw new Error('ECO not found');
    if (existing.status !== 'Draft') throw new Error('Can only edit Draft ECOs');

    const eco = await prisma.eCO.update({
      where: { id },
      data
    });

    await prisma.eCOActivity.create({
      data: {
        eco_id: eco.id,
        action: 'ECO Updated',
        metadata: 'Updated ECO details',
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'ECO',
      entity_id: eco.id,
      action: 'UPDATED',
      old_value: existing,
      new_value: eco,
      performed_by: userId
    });

    return eco;
  }

  async updateStatus(id: string, status: string, userId: string) {
    const existing = await prisma.eCO.findUnique({ where: { id }, include: { changes: true } });
    if (!existing) throw new Error('ECO not found');

    if (status === 'Submitted') {
      if (existing.changes.length === 0) {
        throw new Error('ECO must have at least one change record before submitting.');
      }
    }

    const eco = await prisma.eCO.update({
      where: { id },
      data: { status }
    });

    await prisma.eCOActivity.create({
      data: {
        eco_id: eco.id,
        action: 'Status Changed',
        metadata: `Status changed to ${status}`,
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'ECO',
      entity_id: eco.id,
      action: 'STATUS_CHANGED',
      old_value: { status: existing.status },
      new_value: { status: eco.status },
      performed_by: userId
    });

    return eco;
  }

  async deleteEco(id: string, userId: string) {
    const eco = await prisma.eCO.findUnique({ where: { id } });
    if (!eco) throw new Error('ECO not found');
    if (eco.status !== 'Draft') throw new Error('Can only delete Draft ECOs. Cancel them instead.');
    
    await prisma.eCO.delete({ where: { id } });

    await auditService.log({
      entity_type: 'ECO',
      entity_id: id,
      action: 'DELETED',
      old_value: eco,
      performed_by: userId
    });

    return true;
  }

  async addChange(ecoId: string, data: CreateChangeInput, userId: string) {
    const eco = await prisma.eCO.findUnique({ where: { id: ecoId } });
    if (eco?.status !== 'Draft') throw new Error('Changes can only be added to Draft ECOs');

    const change = await prisma.eCOChange.create({
      data: {
        eco_id: ecoId,
        change_type: data.change_type,
        field_name: data.field_name,
        old_value: data.old_value,
        new_value: data.new_value,
        impact_type: data.impact_type
      }
    });

    await prisma.eCOActivity.create({
      data: {
        eco_id: ecoId,
        action: 'Change Added',
        metadata: `Added ${data.change_type} for ${data.field_name}`,
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'ECO_Change',
      entity_id: change.id,
      action: 'CREATED',
      new_value: change,
      performed_by: userId
    });

    return change;
  }

  async removeChange(id: string, userId: string) {
    const change = await prisma.eCOChange.findUnique({ where: { id }, include: { eco: true } });
    if (!change) throw new Error('Change not found');
    if (change.eco.status !== 'Draft') throw new Error('Changes can only be removed from Draft ECOs');

    await prisma.eCOChange.delete({ where: { id } });

    await prisma.eCOActivity.create({
      data: {
        eco_id: change.eco_id,
        action: 'Change Removed',
        metadata: `Removed ${change.change_type} for ${change.field_name}`,
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'ECO_Change',
      entity_id: id,
      action: 'DELETED',
      old_value: change,
      performed_by: userId
    });

    return true;
  }

  async addComment(ecoId: string, data: CreateCommentInput, userId: string) {
    const comment = await prisma.eCOComment.create({
      data: {
        eco_id: ecoId,
        user_id: userId,
        comment: data.comment
      },
      include: { user: { select: { full_name: true } } }
    });

    await prisma.eCOActivity.create({
      data: {
        eco_id: ecoId,
        action: 'Comment Added',
        metadata: `Commented by user`,
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'ECO_Comment',
      entity_id: comment.id,
      action: 'CREATED',
      new_value: comment,
      performed_by: userId
    });

    return comment;
  }

  async removeComment(id: string, userId: string) {
    const comment = await prisma.eCOComment.findUnique({ where: { id } });
    if (!comment) throw new Error('Comment not found');
    if (comment.user_id !== userId) throw new Error('Cannot delete someone else\'s comment');

    await prisma.eCOComment.delete({ where: { id } });

    await auditService.log({
      entity_type: 'ECO_Comment',
      entity_id: id,
      action: 'DELETED',
      old_value: comment,
      performed_by: userId
    });

    return true;
  }
}

export const ecosService = new EcosService();
