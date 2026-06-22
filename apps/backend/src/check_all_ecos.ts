import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const ecos = await prisma.eCO.findMany({
    select: { id: true, eco_number: true, title: true, status: true, submitted_by: true, created_at: true },
    orderBy: { created_at: 'desc' }
  });
  console.log(ecos);
}

main().catch(console.error).finally(() => prisma.$disconnect());
