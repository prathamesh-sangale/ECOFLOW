import { PrismaClient, Prisma } from '@prisma/client';
import { CreateBOMInput, UpdateBOMInput, CreateComponentInput, UpdateComponentInput } from '@ecoflow/shared-validations';
import { auditService } from '../audit/audit.service';

const prisma = new PrismaClient();

export class BomsService {
  async getBoms(query: any) {
    const { page = 1, limit = 10, search, product_id, status } = query;
    
    const where: Prisma.BOMWhereInput = {};
    if (search) {
      where.OR = [
        { bom_name: { contains: search, mode: 'insensitive' } },
        { bom_code: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (product_id) {
      where.product_id = product_id;
    }
    if (status) {
      where.status = status;
    }

    const [total, boms] = await Promise.all([
      prisma.bOM.count({ where }),
      prisma.bOM.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { product: true, components: true },
        orderBy: { updated_at: 'desc' }
      })
    ]);

    const formattedBoms = boms.map(bom => {
      const totalCost = bom.components.reduce((sum, c) => sum + c.total_cost, 0);
      return { ...bom, totalCost, componentsCount: bom.components.length };
    });

    return { total, page: Number(page), limit: Number(limit), boms: formattedBoms };
  }

  async getBomById(id: string) {
    const bom = await prisma.bOM.findUnique({
      where: { id },
      include: {
        product: true,
        components: { orderBy: { created_at: 'asc' } },
        activities: { include: { user: { select: { full_name: true } } }, orderBy: { created_at: 'desc' } },
        creator: { select: { full_name: true } }
      }
    });

    if (!bom) return null;

    const totalMaterialCost = bom.components.reduce((sum, c) => sum + c.total_cost, 0);
    const totalComponents = bom.components.reduce((sum, c) => sum + c.quantity, 0);
    const averageComponentCost = bom.components.length > 0 ? totalMaterialCost / bom.components.length : 0;

    return {
      ...bom,
      costSummary: {
        totalMaterialCost,
        totalComponents,
        averageComponentCost
      }
    };
  }

  async createBom(data: CreateBOMInput, userId: string) {
    const product = await prisma.product.findUnique({ where: { id: data.product_id } });
    if (!product) throw new Error('Product not found');

    const bom = await prisma.bOM.create({
      data: {
        product_id: data.product_id,
        bom_code: data.bom_code,
        bom_name: data.bom_name,
        description: data.description,
        status: data.status || 'Draft',
        created_by: userId,
      }
    });

    await prisma.bOMActivity.create({
      data: {
        bom_id: bom.id,
        action: 'BOM Created',
        metadata: `Created ${bom.bom_name}`,
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'BOM',
      entity_id: bom.id,
      action: 'CREATED',
      new_value: bom,
      performed_by: userId
    });

    return bom;
  }

  async updateBom(id: string, data: UpdateBOMInput, userId: string) {
    const oldBom = await prisma.bOM.findUnique({ where: { id } });
    if (!oldBom) throw new Error('BOM not found');

    const bom = await prisma.bOM.update({
      where: { id },
      data
    });

    await prisma.bOMActivity.create({
      data: {
        bom_id: bom.id,
        action: 'BOM Updated',
        metadata: 'BOM information was updated',
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'BOM',
      entity_id: bom.id,
      action: 'UPDATED',
      old_value: oldBom,
      new_value: bom,
      performed_by: userId
    });

    return bom;
  }

  async updateStatus(id: string, status: string, userId: string) {
    const oldBom = await prisma.bOM.findUnique({ where: { id } });
    if (!oldBom) throw new Error('BOM not found');

    const bom = await prisma.bOM.update({
      where: { id },
      data: { status }
    });

    await prisma.bOMActivity.create({
      data: {
        bom_id: bom.id,
        action: 'Status Changed',
        metadata: `Status changed to ${status}`,
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'BOM',
      entity_id: bom.id,
      action: 'STATUS_CHANGED',
      old_value: { status: oldBom.status },
      new_value: { status: bom.status },
      performed_by: userId
    });

    return bom;
  }

  async deleteBom(id: string, userId: string) {
    const bom = await prisma.bOM.findUnique({ where: { id } });
    if (bom?.status === 'Active') throw new Error('Cannot delete active BOM');
    
    await prisma.bOM.delete({ where: { id } });

    await auditService.log({
      entity_type: 'BOM',
      entity_id: id,
      action: 'DELETED',
      old_value: bom,
      performed_by: userId
    });

    return true;
  }

  async addComponent(bomId: string, data: CreateComponentInput, userId: string) {
    const total_cost = data.quantity * data.unit_cost;

    const component = await prisma.bOMComponent.create({
      data: {
        bom_id: bomId,
        component_name: data.component_name,
        material_type: data.material_type,
        quantity: data.quantity,
        unit: data.unit,
        unit_cost: data.unit_cost,
        total_cost,
        notes: data.notes
      }
    });

    await prisma.bOMActivity.create({
      data: {
        bom_id: bomId,
        action: 'Component Added',
        metadata: `Added ${data.quantity} ${data.unit} of ${data.component_name}`,
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'Component',
      entity_id: component.id,
      action: 'CREATED',
      new_value: component,
      performed_by: userId
    });

    return component;
  }

  async updateComponent(id: string, data: UpdateComponentInput, userId: string) {
    const existing = await prisma.bOMComponent.findUnique({ where: { id } });
    if (!existing) throw new Error('Component not found');

    const quantity = data.quantity ?? existing.quantity;
    const unit_cost = data.unit_cost ?? existing.unit_cost;
    const total_cost = quantity * unit_cost;

    const component = await prisma.bOMComponent.update({
      where: { id },
      data: {
        ...data,
        total_cost
      }
    });

    await prisma.bOMActivity.create({
      data: {
        bom_id: existing.bom_id,
        action: 'Component Updated',
        metadata: `Updated component ${component.component_name}`,
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'Component',
      entity_id: component.id,
      action: 'UPDATED',
      old_value: existing,
      new_value: component,
      performed_by: userId
    });

    return component;
  }

  async removeComponent(id: string, userId: string) {
    const existing = await prisma.bOMComponent.findUnique({ where: { id } });
    if (!existing) throw new Error('Component not found');

    await prisma.bOMComponent.delete({ where: { id } });

    await prisma.bOMActivity.create({
      data: {
        bom_id: existing.bom_id,
        action: 'Component Removed',
        metadata: `Removed component ${existing.component_name}`,
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'Component',
      entity_id: id,
      action: 'DELETED',
      old_value: existing,
      performed_by: userId
    });

    return true;
  }
}

export const bomsService = new BomsService();
