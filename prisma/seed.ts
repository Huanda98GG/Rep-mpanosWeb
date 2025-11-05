import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);
  const existing = await prisma.user.findUnique({ where: { email: 'admin@juansao.com' } });
  if (!existing) {
    const user = await prisma.user.create({
      data: {
        email: 'admin@juansao.com',
        name: 'Juan Sao Ville',
        password,
        role: Role.ADMIN,
      },
    });
    console.log('Created admin user:', user.email);
  } else {
    console.log('Admin user already exists:', existing.email);
  }
  // Seed some example rewards for convenience
  const rewardsCount = await prisma.reward.count();
  if (rewardsCount === 0) {
    await prisma.reward.createMany({ data: [
      { title: 'Golden USB' },
      { title: 'Coffee Voucher' },
      { title: 'Extra Vacation Day' }
    ]});
    console.log('Seeded example rewards');
  } else {
    console.log('Rewards already present:', rewardsCount);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
