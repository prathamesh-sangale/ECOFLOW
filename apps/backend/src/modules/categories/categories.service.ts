import prisma from '../../utils/prisma';
import { PrismaClient } from '@prisma/client';
import { CreateCategoryInput, UpdateCategoryInput } from '@ecoflow/shared-validations';
import { auditService } from '../audit/audit.service';



export class CategoriesService {
  async getAllCategories() {
    return prisma.productCategory.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  async getCategoryById(id: string) {
    return prisma.productCategory.findUnique({
      where: { id }
    });
  }

  async createCategory(data: CreateCategoryInput, performedBy: string) {
    const category = await prisma.productCategory.create({
      data
    });

    await auditService.log({
      entity_type: 'Category',
      entity_id: category.id,
      action: 'CREATED',
      new_value: category,
      performed_by: performedBy
    });

    return category;
  }

  async updateCategory(id: string, data: UpdateCategoryInput, performedBy: string) {
    const oldCategory = await prisma.productCategory.findUnique({ where: { id } });
    if (!oldCategory) throw new Error('Category not found');

    const category = await prisma.productCategory.update({
      where: { id },
      data
    });

    await auditService.log({
      entity_type: 'Category',
      entity_id: category.id,
      action: 'UPDATED',
      old_value: oldCategory,
      new_value: category,
      performed_by: performedBy
    });

    return category;
  }

  async deleteCategory(id: string, performedBy: string) {
    const oldCategory = await prisma.productCategory.findUnique({ where: { id } });
    if (!oldCategory) throw new Error('Category not found');

    await prisma.productCategory.delete({
      where: { id }
    });

    await auditService.log({
      entity_type: 'Category',
      entity_id: id,
      action: 'DELETED',
      old_value: oldCategory,
      performed_by: performedBy
    });

    return true;
  }
}

export const categoriesService = new CategoriesService();
