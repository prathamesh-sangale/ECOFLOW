import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Indian Market Data...');

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

  // 2. Create Users with Indian Names
  const users = [
    { email: 'admin@ecoflow.com', full_name: 'Rajesh Kumar', role: 'Admin' },
    { email: 'engineer1@ecoflow.com', full_name: 'Priya Sharma', role: 'Engineer' },
    { email: 'engineer2@ecoflow.com', full_name: 'Vikram Singh', role: 'Engineer' },
    { email: 'approver@ecoflow.com', full_name: 'Amit Patel', role: 'Approver' },
    { email: 'production@ecoflow.com', full_name: 'Sanjay Reddy', role: 'Production' },
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
  const categories = ['Solid Wood Furniture', 'Modular Office Furniture', 'Upholstery', 'Metal Storage'];
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
    { code: 'DNT-SH-01', name: 'Sheesham Wood Dining Table', category: 'Solid Wood Furniture', desc: 'Premium 6-seater dining table crafted from authentic Indian Sheesham wood.' },
    { code: 'EXD-TK-02', name: 'Teak Wood Executive Desk', category: 'Solid Wood Furniture', desc: 'Handcrafted executive desk using premium CP Teak.' },
    { code: 'WRD-EW-03', name: 'Engineered Wood Wardrobe', category: 'Modular Office Furniture', desc: '3-door sliding wardrobe with Godrej Interio specified locks.' },
    { code: 'SF-UP-04', name: 'L-Shape Fabric Sofa', category: 'Upholstery', desc: 'Sectional sofa with high-density Sleepwell foam.' },
    { code: 'ALM-MS-05', name: 'Steel Almirah', category: 'Metal Storage', desc: 'Heavy duty 22-gauge steel almirah with digital safe.' },
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
        description: p.desc,
      },
    });
    productMap[p.code] = prod.id;
    console.log(`Created/Ensured product: ${p.code}`);
  }

  // 5. Create BOMs & Components for the Wardrobe
  const wardrobeId = productMap['WRD-EW-03'];
  
  let bom = await prisma.bOM.findFirst({ where: { bom_code: 'BOM-WRD-001' } });
  
  if (!bom) {
    bom = await prisma.bOM.create({
      data: {
        product_id: wardrobeId,
        bom_code: 'BOM-WRD-001',
        bom_name: 'Wardrobe Standard BOM',
        description: 'Material list for 3-door sliding wardrobe',
        status: 'Active',
        created_by: userMap['engineer1@ecoflow.com'],
      }
    });

    // Create components (Pricing in INR)
    const components = [
      { name: 'Marine Plywood (BWP Grade)', type: 'Wood', qty: 150, unit: 'sqft', cost: 120 }, // ₹18,000
      { name: 'Godrej SS Auto Hinges', type: 'Hardware', qty: 12, unit: 'pcs', cost: 150 }, // ₹1,800
      { name: 'Fevicol SH', type: 'Adhesive', qty: 5, unit: 'kg', cost: 250 }, // ₹1,250
      { name: 'Merino Laminate (1mm)', type: 'Finish', qty: 10, unit: 'sheet', cost: 1200 }, // ₹12,000
      { name: 'Edge Banding (PVC)', type: 'Finish', qty: 50, unit: 'm', cost: 15 }, // ₹750
      { name: 'Godrej Ultra Lock', type: 'Hardware', qty: 1, unit: 'pcs', cost: 2500 }, // ₹2,500
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
    console.log(`Created BOM & Components for Wardrobe`);
  }

  // 6. Create ECOs
  const ecos = [
    { eco_num: 'ECO-IN-001', title: 'Switch to BWP Plywood for Monsoon', status: 'Draft', reason: 'High moisture during Indian monsoon causes MR plywood to swell.' },
    { eco_num: 'ECO-IN-002', title: 'Upgrade to Godrej Locks', status: 'Submitted', reason: 'Customer feedback indicated generic locks were failing.' },
    { eco_num: 'ECO-IN-003', title: 'Localize Teak Sourcing to Nagpur', status: 'Approved', reason: 'Logistics cost optimization by sourcing CP Teak locally from Nagpur instead of importing.' },
    { eco_num: 'ECO-IN-004', title: 'Change Laminate to Merino Anti-Scratch', status: 'Approved', reason: 'Market trend demands highly durable laminates.' },
  ];

  for (const eco of ecos) {
    const existing = await prisma.eCO.findUnique({ where: { eco_number: eco.eco_num } });
    if (!existing) {
      const createdEco = await prisma.eCO.create({
        data: {
          eco_number: eco.eco_num,
          title: eco.title,
          product_id: wardrobeId,
          bom_id: bom.id,
          status: eco.status,
          submitted_by: userMap['engineer1@ecoflow.com'],
          priority: eco.status === 'Approved' ? 'High' : 'Medium',
          reason: eco.reason,
        }
      });
      console.log(`Created ECO: ${eco.eco_num}`);
      
      // If Approved, create Approval record and Version
      if (eco.status === 'Approved') {
        const approval = await prisma.approval.create({
          data: {
            eco_id: createdEco.id,
            reviewer_id: userMap['approver@ecoflow.com'],
            decision: 'Approved',
            review_notes: 'Cost benefit analysis looks solid. Approved for immediate production.',
          }
        });
        
        const prodVersion = await prisma.productVersion.create({
          data: {
            product_id: wardrobeId,
            version_number: createdEco.eco_number === 'ECO-IN-003' ? 'V1.1' : 'V2.0',
            eco_id: createdEco.id,
            created_by: userMap['engineer1@ecoflow.com'],
            release_notes: eco.title,
            snapshot: { approval_id: approval.id },
            is_active: createdEco.eco_number === 'ECO-IN-004', // Make the latest one active
          }
        });

        const bomVersion = await prisma.bOMVersion.create({
          data: {
            bom_id: bom.id,
            version_number: createdEco.eco_number === 'ECO-IN-003' ? 'V1.1' : 'V2.0',
            eco_id: createdEco.id,
            created_by: userMap['engineer1@ecoflow.com'],
            release_notes: eco.title,
            snapshot: { total_cost: 36300 }, // Simulated cost in INR
            is_active: createdEco.eco_number === 'ECO-IN-004',
          }
        });

        // Create Release
        await prisma.versionRelease.create({
          data: {
            product_version_id: prodVersion.id,
            bom_version_id: bomVersion.id,
            released_by: userMap['production@ecoflow.com'],
            notes: 'Successfully deployed to shop floor.'
          }
        });
      }
    }
  }

  // 7. Generate General Audit Logs to show system activity
  const activities = [
    { entity_type: 'Product', action: 'CREATE', details: 'Added new Sheesham dining table' },
    { entity_type: 'BOM', action: 'UPDATE', details: 'Updated plywood pricing from ₹115 to ₹120' },
    { entity_type: 'ECO', action: 'SUBMIT', details: 'Submitted ECO for Godrej locks upgrade' }
  ];

  for (const act of activities) {
    await prisma.auditLog.create({
      data: {
        entity_type: act.entity_type,
        entity_id: 'SYSTEM_GEN',
        action: act.action,
        new_value: { info: act.details },
        performed_by: userMap['admin@ecoflow.com'],
      }
    });
  }

  console.log('Indian Market Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
