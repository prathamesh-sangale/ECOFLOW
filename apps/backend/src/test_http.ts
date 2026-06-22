import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function main() {
  // 1. Get an Engineer
  const engineer = await prisma.user.findFirst({ where: { role: { role_name: 'Engineer' } } });
  if (!engineer) throw new Error('No engineer');

  // 2. Create token
  const token = jwt.sign(
    { id: engineer.id, role_id: engineer.role_id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '15m' }
  );

  // 3. Find a Draft ECO
  let eco = await prisma.eCO.findFirst({ where: { status: 'Draft' }, include: { changes: true } });
  if (!eco) {
    console.log('No Draft ECOs, creating one...');
    const product = await prisma.product.findFirst();
    const bom = await prisma.bOM.findFirst();
    eco = await prisma.eCO.create({
      data: {
        eco_number: 'HTTP-TEST-01',
        title: 'HTTP Test',
        product_id: product!.id,
        bom_id: bom!.id,
        submitted_by: engineer.id,
        status: 'Draft'
      },
      include: { changes: true }
    });
  }

  // 4. Ensure it has a change
  if (eco.changes.length === 0) {
    await prisma.eCOChange.create({
      data: {
        eco_id: eco.id,
        change_type: 'Test',
        field_name: 'Test',
        impact_type: 'Cost'
      }
    });
  }

  // 5. Send HTTP request
  try {
    const res = await axios.patch(`http://localhost:3000/api/ecos/${eco.id}/status`, 
      { status: 'Submitted' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Success!', res.data);
  } catch (err: any) {
    console.error('HTTP Error:', err.response?.data || err.message);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
