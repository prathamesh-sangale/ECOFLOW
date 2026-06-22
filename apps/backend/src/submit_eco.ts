import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const eco = await prisma.eCO.update({
    where: { id: '115a6478-53c6-4f06-86d7-544347a9af71' }, // TV Stand
    data: { status: 'Submitted' }
  });
  console.log(`Updated ECO ${eco.eco_number} to Submitted.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
