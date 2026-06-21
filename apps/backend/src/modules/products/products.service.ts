import prisma from '../../utils/prisma';
import { PrismaClient, Prisma } from '@prisma/client';
import { CreateProductInput, UpdateProductInput } from '@ecoflow/shared-validations';
import { auditService } from '../audit/audit.service';



export class ProductsService {
  async getProducts(query: any) {
    const { page = 1, limit = 10, search, category_id, status } = query;
    
    const where: Prisma.ProductWhereInput = {};
    if (search) {
      where.OR = [
        { product_name: { contains: search, mode: 'insensitive' } },
        { product_code: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category_id) {
      where.category_id = category_id;
    }
    if (status) {
      where.status = status;
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { category: true, creator: { select: { full_name: true } } },
        orderBy: { updated_at: 'desc' }
      })
    ]);

    return { total, page: Number(page), limit: Number(limit), products };
  }

  async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { 
        category: true, 
        creator: { select: { full_name: true } },
        attachments: { orderBy: { uploaded_at: 'desc' } },
        activities: { include: { user: { select: { full_name: true } } }, orderBy: { created_at: 'desc' } }
      }
    });
  }

  async createProduct(data: CreateProductInput, userId: string) {
    const product = await prisma.product.create({
      data: {
        product_code: data.product_code,
        product_name: data.product_name,
        category_id: data.category_id,
        description: data.description,
        image_url: data.image_url,
        status: data.status || 'Draft',
        created_by: userId,
      }
    });

    await prisma.productActivity.create({
      data: {
        product_id: product.id,
        action: 'Created',
        details: 'Product was created',
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'Product',
      entity_id: product.id,
      action: 'CREATED',
      new_value: product,
      performed_by: userId
    });

    return product;
  }

  async updateProduct(id: string, data: UpdateProductInput, userId: string) {
    const oldProduct = await prisma.product.findUnique({ where: { id } });
    if (!oldProduct) throw new Error('Product not found');

    const product = await prisma.product.update({
      where: { id },
      data
    });

    await prisma.productActivity.create({
      data: {
        product_id: product.id,
        action: 'Updated',
        details: 'Product information was updated',
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'Product',
      entity_id: product.id,
      action: 'UPDATED',
      old_value: oldProduct,
      new_value: product,
      performed_by: userId
    });

    return product;
  }

  async updateStatus(id: string, status: string, userId: string) {
    const oldProduct = await prisma.product.findUnique({ where: { id } });
    if (!oldProduct) throw new Error('Product not found');

    const product = await prisma.product.update({
      where: { id },
      data: { status }
    });

    await prisma.productActivity.create({
      data: {
        product_id: product.id,
        action: 'Status Changed',
        details: `Product status changed to ${status}`,
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'Product',
      entity_id: product.id,
      action: 'STATUS_CHANGED',
      old_value: { status: oldProduct.status },
      new_value: { status: product.status },
      performed_by: userId
    });

    return product;
  }

  async deleteProduct(id: string, userId: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (product?.status === 'Active') {
      throw new Error('Cannot delete an active product. Archive it instead.');
    }

    // Clean up relations that prevent deletion of simple products
    await prisma.productActivity.deleteMany({ where: { product_id: id } });
    await prisma.productAttachment.deleteMany({ where: { product_id: id } });

    await prisma.product.delete({
      where: { id }
    });

    await auditService.log({
      entity_type: 'Product',
      entity_id: id,
      action: 'DELETED',
      old_value: product,
      performed_by: userId
    });

    return true;
  }
}

export const productsService = new ProductsService();
