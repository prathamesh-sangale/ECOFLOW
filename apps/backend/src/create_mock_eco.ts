import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function createMockECO(engineer: any, approver: any, token: string, product: any, bom: any, index: number) {
  const ecoNumber = `ECO-MOCK-BATCH-${Math.floor(Math.random() * 10000)}`;

  const titles = [
    'Design Specification Update',
    'Safety Compliance Adjustment'
  ];
  
  const descriptions = [
    'Updating the dimensions of the core frame to improve structural integrity and reduce wobble.',
    'Adjusting the finishing materials to comply with new international fire safety regulations.'
  ];

  const eco = await prisma.eCO.create({
    data: {
      eco_number: ecoNumber,
      title: titles[index],
      description: descriptions[index],
      reason: 'Required for Q3 release cycle.',
      product_id: product.id,
      bom_id: bom.id,
      submitted_by: engineer.id,
      priority: index === 0 ? 'Medium' : 'Critical',
      status: 'Draft'
    }
  });

  console.log(`[Example ${index + 1}] Created Draft ECO: ${eco.eco_number}`);

  await prisma.eCOChange.create({
    data: {
      eco_id: eco.id,
      change_type: index === 0 ? 'Dimension' : 'Material',
      field_name: index === 0 ? 'Frame Width' : 'Coating',
      old_value: index === 0 ? '45mm' : 'Standard Varnish',
      new_value: index === 0 ? '50mm' : 'Fire-Retardant Varnish',
      impact_type: index === 0 ? 'Manufacturing' : 'Quality'
    }
  });
  console.log(`[Example ${index + 1}] Added Change Record`);

  try {
    await axios.patch(`http://localhost:3000/api/ecos/${eco.id}/status`, 
      { status: 'Submitted' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`[Example ${index + 1}] ✅ Successfully Submitted! It's now in the Approver Queue.`);
  } catch (err: any) {
    console.error(`[Example ${index + 1}] HTTP Error:`, err.response?.data || err.message);
  }
}

async function main() {
  console.log('--- Generating 2 Mock Submitted ECOs ---');

  const engineer = await prisma.user.findFirst({ where: { role: { role_name: 'Engineer' } } });
  const approver = await prisma.user.findFirst({ where: { role: { role_name: 'Approver' } } });
  
  if (!engineer || !approver) throw new Error('Missing Engineer or Approver in DB');

  const token = jwt.sign(
    { id: engineer.id, role_id: engineer.role_id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '15m' }
  );

  const product = await prisma.product.findFirst();
  const bom = await prisma.bOM.findFirst();
  
  if (!product || !bom) throw new Error('No Product/BOM');

  for (let i = 0; i < 2; i++) {
    await createMockECO(engineer, approver, token, product, bom, i);
    console.log('----------------------------------------------------');
  }
  
  console.log(`Log in as: ${approver.email} (or select Approver in Dev Mode) to see them!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
