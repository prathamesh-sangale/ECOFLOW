import { ecosService } from './modules/ecos/ecos.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const eco = await prisma.eCO.findFirst({
    where: { status: 'Draft' },
    include: { changes: true }
  });

  if (!eco) {
    console.log('No Draft ECOs found');
    return;
  }

  // Ensure it has changes
  if (eco.changes.length === 0) {
    await prisma.eCOChange.create({
      data: {
        eco_id: eco.id,
        change_type: 'Material Change',
        field_name: 'test',
        impact_type: 'Cost'
      }
    });
  }

  try {
    const res = await ecosService.updateStatus(eco.id, 'Submitted', eco.submitted_by);
    console.log('Update Status Result:', res);
  } catch (err) {
    console.error('Error during updateStatus:', err);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
