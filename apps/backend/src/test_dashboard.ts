import { PrismaClient } from '@prisma/client';
import { AnalyticsService } from './modules/analytics/analytics.service';

const prisma = new PrismaClient();
const analyticsService = new AnalyticsService();

async function main() {
  const users = await prisma.user.findMany({ where: { role: { role_name: 'Approver' } } });
  if (users.length === 0) {
    console.log('No Approver found');
    return;
  }
  const dashboard = await analyticsService.getApproverDashboard(users[0].id, 'this_month');
  console.log(JSON.stringify(dashboard, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
