import prisma from '../../utils/prisma';
import { PrismaClient, Prisma } from '@prisma/client';
import { ReportFilterInput } from '@ecoflow/shared-validations';
import { Parser } from 'json2csv';



export class ReportsService {
  private buildDateFilter(startDate?: string, endDate?: string) {
    if (!startDate && !endDate) return undefined;
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);
    return dateFilter;
  }

  async getProductsReport(filters: ReportFilterInput) {
    const where: Prisma.ProductWhereInput = {};
    
    if (filters.status) where.status = filters.status;
    if (filters.userId) where.created_by = filters.userId;
    
    const dateFilter = this.buildDateFilter(filters.startDate, filters.endDate);
    if (dateFilter) where.created_at = dateFilter;

    return prisma.product.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        category: { select: { name: true } },
        creator: { select: { full_name: true } }
      }
    });
  }

  async getBomsReport(filters: ReportFilterInput) {
    const where: Prisma.BOMWhereInput = {};
    
    if (filters.status) where.status = filters.status;
    if (filters.userId) where.created_by = filters.userId;
    if (filters.productId) where.product_id = filters.productId;
    
    const dateFilter = this.buildDateFilter(filters.startDate, filters.endDate);
    if (dateFilter) where.created_at = dateFilter;

    return prisma.bOM.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        product: { select: { product_name: true, product_code: true } },
        creator: { select: { full_name: true } },
        components: true
      }
    });
  }

  async getEcosReport(filters: ReportFilterInput) {
    const where: Prisma.ECOWhereInput = {};
    
    if (filters.status) where.status = filters.status;
    if (filters.userId) where.submitted_by = filters.userId;
    if (filters.productId) where.product_id = filters.productId;
    if (filters.priority) where.priority = filters.priority;
    
    const dateFilter = this.buildDateFilter(filters.startDate, filters.endDate);
    if (dateFilter) where.created_at = dateFilter;

    return prisma.eCO.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        product: { select: { product_name: true, product_code: true } },
        submitter: { select: { full_name: true } },
        reviewer: { select: { full_name: true } }
      }
    });
  }

  async getApprovalsReport(filters: ReportFilterInput) {
    const where: Prisma.ApprovalWhereInput = {};
    
    if (filters.userId) where.reviewer_id = filters.userId;
    if (filters.status) where.decision = filters.status;
    
    const dateFilter = this.buildDateFilter(filters.startDate, filters.endDate);
    if (dateFilter) where.reviewed_at = dateFilter;

    return prisma.approval.findMany({
      where,
      orderBy: { reviewed_at: 'desc' },
      include: {
        eco: { select: { eco_number: true, title: true, priority: true } },
        reviewer: { select: { full_name: true } }
      }
    });
  }

  async getVersionsReport(filters: ReportFilterInput) {
    const where: Prisma.ProductVersionWhereInput = {};
    
    if (filters.userId) where.created_by = filters.userId;
    if (filters.productId) where.product_id = filters.productId;
    
    const dateFilter = this.buildDateFilter(filters.startDate, filters.endDate);
    if (dateFilter) where.created_at = dateFilter;

    return prisma.productVersion.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        product: { select: { product_name: true, product_code: true } },
        creator: { select: { full_name: true } },
        eco: { select: { eco_number: true } }
      }
    });
  }

  async getUsersReport(filters: ReportFilterInput) {
    const where: Prisma.UserWhereInput = {};
    
    if (filters.status) where.status = filters.status;
    
    const dateFilter = this.buildDateFilter(filters.startDate, filters.endDate);
    if (dateFilter) where.created_at = dateFilter;

    return prisma.user.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        role: { select: { role_name: true } }
      }
    });
  }

  async generateCSV(type: string, data: any[]) {
    if (!data || data.length === 0) {
      return '';
    }

    // Flatten nested objects for CSV
    const flattenedData = data.map(item => this.flattenObject(item));
    
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(flattenedData);
    return csv;
  }

  private flattenObject(ob: any): any {
    var toReturn: any = {};
    for (var i in ob) {
      if (!ob.hasOwnProperty(i)) continue;
      if ((typeof ob[i]) == 'object' && ob[i] !== null && !(ob[i] instanceof Date)) {
        var flatObject = this.flattenObject(ob[i]);
        for (var x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;
          toReturn[i + '_' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  }
}

export const reportsService = new ReportsService();
