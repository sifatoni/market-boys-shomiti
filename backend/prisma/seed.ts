import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@shomiti.local';
  const name = process.env.ADMIN_NAME ?? 'System Admin';
  const password = process.env.ADMIN_PASSWORD ?? 'Admin@1234';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, password: hashed, role: 'ADMIN' },
  });

  await prisma.member.create({
    data: {
      memberNumber: 'MBR-0001',
      fullName: name,
      userId: user.id,
    },
  });

  console.log(`Admin created: ${email}`);
  console.log(`Password: ${password}`);
  console.log('Change the password after first login!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
