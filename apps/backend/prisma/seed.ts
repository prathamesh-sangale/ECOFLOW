import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // auth.controller uses bcryptjs

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
    {
      email: 'admin@ecoflow.com',
      full_name: 'System Admin',
      role: 'Admin',
    },
    {
      email: 'engineer@ecoflow.com',
      full_name: 'Lead Engineer',
      role: 'Engineer',
    },
    {
      email: 'approver@ecoflow.com',
      full_name: 'QA Approver',
      role: 'Approver',
    },
    {
      email: 'production@ecoflow.com',
      full_name: 'Floor Manager',
      role: 'Production',
    },
  ];

  const password_hash = await bcrypt.hash('Password123!', 10);

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        password_hash,
        status: 'ACTIVE',
        role_id: roleMap[u.role],
      },
      create: {
        email: u.email,
        full_name: u.full_name,
        password_hash,
        status: 'ACTIVE',
        role_id: roleMap[u.role],
      },
    });
    console.log(`Created/Ensured user: ${u.email}`);
  }

  // 3. Create Categories
  const categories = ['Seating', 'Tables', 'Storage'];
  const catMap: Record<string, string> = {};

  for (const catName of categories) {
    const cat = await prisma.productCategory.upsert({
      where: { name: catName },
      update: {},
      create: {
        name: catName,
        description: `${catName} Furniture`,
      },
    });
    catMap[catName] = cat.id;
    console.log(`Created/Ensured category: ${catName}`);
  }

  // 4. Create Sample Products
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@ecoflow.com' } });

  if (adminUser) {
    const products = [
      {
        product_code: 'CHR-001',
        product_name: 'Ergonomic Office Chair',
        category_id: catMap['Seating'],
        status: 'Active',
      },
      {
        product_code: 'TBL-001',
        product_name: 'Standing Desk',
        category_id: catMap['Tables'],
        status: 'Draft',
      },
    ];

    for (const p of products) {
      await prisma.product.upsert({
        where: { product_code: p.product_code },
        update: {},
        create: {
          ...p,
          created_by: adminUser.id,
        },
      });
      console.log(`Created/Ensured product: ${p.product_code}`);
    }
  }

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
