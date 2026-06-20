import { PrismaClient } from '@prisma/client';
import { Parser } from 'json2csv';

const prisma = new PrismaClient();

export class AuditService {
  /**
   * Core logging method to be called after every mutation.
   */
  async log(data: {
    entity_type: string;
    entity_id: string;
    action: string;
    old_value?: any;
    new_value?: any;
    performed_by: string;
    ip_address?: string;
    user_agent?: string;
  }) {
    try {
      await prisma.auditLog.create({
        data: {
          entity_type: data.entity_type,
          entity_id: data.entity_id,
          action: data.action,
          old_value: data.old_value || null,
          new_value: data.new_value || null,
          performed_by: data.performed_by,
          ip_address: data.ip_address,
          user_agent: data.user_agent,
        }
      });
    } catch (e) {
      console.error('Failed to write audit log:', e);
      // In production, might want to alert/fail if auditing is strictly required.
    }
  }

  async logLogin(data: {
    user_id: string;
    action: string;
    ip_address?: string;
    device?: string;
  }) {
    try {
      await prisma.loginAudit.create({
        data: {
          user_id: data.user_id,
          action: data.action,
          ip_address: data.ip_address,
          device: data.device
        }
      });
    } catch (e) {
      console.error('Failed to write login audit log:', e);
    }
  }

  async getLogs(filters?: { entity_type?: string, action?: string, performed_by?: string }) {
    const where: any = {};
    if (filters?.entity_type) where.entity_type = filters.entity_type;
    if (filters?.action) where.action = filters.action;
    if (filters?.performed_by) where.performed_by = filters.performed_by;

    return prisma.auditLog.findMany({
      where,
      orderBy: { performed_at: 'desc' },
      include: { user: { select: { full_name: true } } }
    });
  }

  async exportLogsCSV() {
    const logs = await prisma.auditLog.findMany({
      orderBy: { performed_at: 'desc' },
      include: { user: { select: { full_name: true } } }
    });

    const formattedData = logs.map(log => ({
      Timestamp: log.performed_at.toISOString(),
      User: log.user?.full_name || 'System',
      Entity: log.entity_type,
      EntityID: log.entity_id,
      Action: log.action,
      IPAddress: log.ip_address || '',
      UserAgent: log.user_agent || '',
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(formattedData);
    return csv;
  }
}

export const auditService = new AuditService();
