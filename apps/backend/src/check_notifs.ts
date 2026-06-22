import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const notifs = await prisma.notification.findMany({
    orderBy: { created_at: 'desc' },
    take: 5,
    include: { user: { select: { role: { select: { role_name: true } } } } }
  });
  console.log(JSON.stringify(notifs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
