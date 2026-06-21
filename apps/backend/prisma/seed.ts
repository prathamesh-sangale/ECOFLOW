import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Roles
  const roles = ['Admin', 'Engineer', 'Approver', 'Production'];
  const roleMap: Record<string, string> = {};

  for (const roleName of roles) {
    const role = await prisma.role.upsert({
      where: { role_name: roleName },
      update: {},
      create: {
        role_name: roleName,
        description: `${roleName} Role`,
      },
    });
    roleMap[roleName] = role.id;
    console.log(`Created/Ensured role: ${roleName}`);
  }

  // 2. Create Users
  const users = [
    { email: 'admin@ecoflow.com', full_name: 'System Admin', role: 'Admin' },
    { email: 'engineer1@ecoflow.com', full_name: 'Lead Engineer', role: 'Engineer' },
    { email: 'engineer2@ecoflow.com', full_name: 'Design Engineer', role: 'Engineer' },
    { email: 'approver@ecoflow.com', full_name: 'QA Approver', role: 'Approver' },
    { email: 'production@ecoflow.com', full_name: 'Floor Manager', role: 'Production' },
  ];

  const password_hash = await bcrypt.hash('Password123!', 10);
  const userMap: Record<string, string> = {};

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { password_hash, status: 'ACTIVE', role_id: roleMap[u.role] },
      create: {
        email: u.email,
        full_name: u.full_name,
        password_hash,
        status: 'ACTIVE',
        role_id: roleMap[u.role],
      },
    });
    userMap[u.email] = user.id;
    console.log(`Created/Ensured user: ${u.email}`);
  }

  // 3. Create Categories
  const categories = ['Tables', 'Chairs', 'Wardrobes', 'Storage', 'Office Furniture'];
  const catMap: Record<string, string> = {};

  for (const catName of categories) {
    const cat = await prisma.productCategory.upsert({
      where: { name: catName },
      update: {},
      create: {
        name: catName,
        description: `${catName} Category`,
      },
    });
    catMap[catName] = cat.id;
    console.log(`Created/Ensured category: ${catName}`);
  }

  // 4. Create Products
  const products = [
    { code: 'TBL-001', name: 'Office Table', category: 'Tables' },
    { code: 'DSK-001', name: 'Executive Desk', category: 'Tables' },
    { code: 'STU-001', name: 'Study Table', category: 'Tables' },
    { code: 'WRD-001', name: 'Wardrobe', category: 'Wardrobes' },
    { code: 'BKS-001', name: 'Bookshelf', category: 'Storage' },
  ];
  
  const productMap: Record<string, string> = {};

  for (const p of products) {
    const prod = await prisma.product.upsert({
      where: { product_code: p.code },
      update: {},
      create: {
        product_code: p.code,
        product_name: p.name,
        category_id: catMap[p.category],
        status: 'Active',
        created_by: userMap['admin@ecoflow.com'],
        description: `High quality ${p.name}`,
      },
    });
    productMap[p.code] = prod.id;
    console.log(`Created/Ensured product: ${p.code}`);
  }

  // 5. Create BOMs & Components
  const officeTableId = productMap['TBL-001'];
  
  let bom = await prisma.bOM.findFirst({ where: { bom_code: 'BOM-TBL-001' } });
  
  if (!bom) {
    bom = await prisma.bOM.create({
      data: {
        product_id: officeTableId,
        bom_code: 'BOM-TBL-001',
        bom_name: 'Office Table Standard BOM',
        description: 'Standard material list for Office Table',
        status: 'Active',
        created_by: userMap['engineer1@ecoflow.com'],
      }
    });

    // Create components
    const components = [
      { name: 'Top Board', type: 'Wood', qty: 1, unit: 'pcs', cost: 50 },
      { name: 'Legs', type: 'Metal', qty: 4, unit: 'pcs', cost: 10 },
      { name: 'Screws', type: 'Hardware', qty: 16, unit: 'pcs', cost: 0.10 },
      { name: 'Laminate', type: 'Finish', qty: 2, unit: 'sqm', cost: 15 },
      { name: 'Edge Band', type: 'Finish', qty: 5, unit: 'm', cost: 2 },
    ];

    for (const c of components) {
      await prisma.bOMComponent.create({
        data: {
          bom_id: bom.id,
          component_name: c.name,
          material_type: c.type,
          quantity: c.qty,
          unit: c.unit,
          unit_cost: c.cost,
          total_cost: c.qty * c.cost,
        }
      });
    }
    console.log(`Created BOM & Components for Office Table`);
  }

  // 6. Create ECOs
  const ecos = [
    { eco_num: 'ECO-24-001', title: 'Update Edge Band Material', status: 'Draft' },
    { eco_num: 'ECO-24-002', title: 'Replace Leg Screws', status: 'Submitted' },
    { eco_num: 'ECO-24-003', title: 'Increase Laminate Thickness', status: 'Approved' },
    { eco_num: 'ECO-24-004', title: 'Change Top Board Wood Type', status: 'Changes Requested' },
  ];

  for (const eco of ecos) {
    const existing = await prisma.eCO.findUnique({ where: { eco_number: eco.eco_num } });
    if (!existing) {
      const createdEco = await prisma.eCO.create({
        data: {
          eco_number: eco.eco_num,
          title: eco.title,
          product_id: officeTableId,
          bom_id: bom.id,
          status: eco.status,
          submitted_by: userMap['engineer1@ecoflow.com'],
          priority: eco.status === 'Approved' ? 'High' : 'Medium',
          reason: 'Cost optimization and quality improvement',
        }
      });
      console.log(`Created ECO: ${eco.eco_num}`);
      
      // If Approved, create Approval record and Version
      if (eco.status === 'Approved') {
        await prisma.approval.create({
          data: {
            eco_id: createdEco.id,
            reviewer_id: userMap['approver@ecoflow.com'],
            decision: 'Approved',
            review_notes: 'Looks good to proceed.',
          }
        });
        
        await prisma.productVersion.create({
          data: {
            product_id: officeTableId,
            version_number: 'V2.0',
            eco_id: createdEco.id,
            created_by: userMap['engineer1@ecoflow.com'],
            release_notes: 'Increased laminate thickness',
            snapshot: {},
          }
        });
      }
    }
  }

  // 7. Generate Audit Logs
  await prisma.auditLog.create({
    data: {
      entity_type: 'BOM',
      entity_id: bom.id,
      action: 'CREATE',
      old_value: '{}',
      new_value: '{"status": "Active"}',
      performed_by: userMap['admin@ecoflow.com'],
    }
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
