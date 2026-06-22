import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function wipe() {
  console.log('Wiping transactional data...');
  
  // Delete in order of dependencies to avoid foreign key constraints
  await prisma.auditLog.deleteMany();
  await prisma.versionRelease.deleteMany();
  await prisma.productVersion.deleteMany();
  await prisma.bOMVersion.deleteMany();
  
  await prisma.approval.deleteMany();
  await prisma.eCOComment.deleteMany();
  await prisma.eCOChange.deleteMany();
  await prisma.eCO.deleteMany();
  
  await prisma.bOMComponent.deleteMany();
  await prisma.bOMActivity.deleteMany();
  await prisma.bOM.deleteMany();
  
  await prisma.productActivity.deleteMany();
  await prisma.productAttachment.deleteMany();
  await prisma.product.deleteMany();

  console.log('Data wiped successfully. Only Users, Roles, and Categories remain.');
}

wipe().catch(console.error).finally(() => prisma.$disconnect());
