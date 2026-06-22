import { PrismaClient } from '@prisma/client';
import { ecosService } from './modules/ecos/ecos.service';
import { approvalsService } from './modules/approvals/approvals.service';
import { notificationsService } from './modules/notifications/notifications.service';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING FLOW TEST ---');

  // 1. Get an Engineer
  const engineerUser = await prisma.user.findFirst({
    where: { role: { role_name: 'Engineer' } }
  });

  // 2. Get an Approver
  const approverUser = await prisma.user.findFirst({
    where: { role: { role_name: 'Approver' } }
  });

  if (!engineerUser || !approverUser) throw new Error('Missing users');

  // 3. Create a Draft ECO
  const product = await prisma.product.findFirst();
  const bom = await prisma.bOM.findFirst();

  if (!product || !bom) throw new Error('Missing product or bom');

  const eco = await prisma.eCO.create({
    data: {
      eco_number: 'TEST-FLOW-01',
      title: 'Flow Test ECO',
      product_id: product.id,
      bom_id: bom.id,
      submitted_by: engineerUser.id,
      status: 'Draft'
    }
  });

  console.log('Created ECO:', eco.eco_number, eco.status);

  // 4. Add a change
  await prisma.eCOChange.create({
    data: {
      eco_id: eco.id,
      change_type: 'Material',
      field_name: 'Testing',
      impact_type: 'Cost'
    }
  });

  // 5. Submit ECO
  console.log('Submitting ECO...');
  await ecosService.updateStatus(eco.id, 'Submitted', engineerUser.id);

  const updatedEco = await prisma.eCO.findUnique({ where: { id: eco.id } });
  console.log('ECO Status after submit:', updatedEco?.status);

  // 6. Check Approver Dashboard
  console.log('Checking Approver Queue...');
  const queue = await approvalsService.getApprovals({ status: { in: ['Submitted', 'Under Review'] } });
  const foundInQueue = queue.ecos.some(e => e.id === eco.id);
  console.log('Is ECO in Approver Queue?', foundInQueue);

  // 7. Check Notifications
  console.log('Checking Approver Notifications...');
  const notifs = await notificationsService.getNotifications(approverUser.id, { limit: 10 });
  const hasNotif = notifs.notifications.some(n => n.link?.includes(eco.id));
  console.log('Did Approver get notification?', hasNotif);

  // Cleanup
  await prisma.eCO.delete({ where: { id: eco.id } });
  console.log('Cleanup done.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
