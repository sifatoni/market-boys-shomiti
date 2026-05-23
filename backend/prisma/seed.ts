import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

async function main() {
  const connectionString = process.env.DATABASE_URL ?? 'postgresql://user:password@localhost:5433/samity_db';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as any);

  const email = 'admin@shomiti.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin already exists:', email);
    await prisma.$disconnect();
    await pool.end();
    return;
  }

  const hashed = await bcrypt.hash('Admin@1234', 10);
  const user = await prisma.user.create({
    data: { email, name: 'System Admin', password: hashed, role: 'ADMIN' },
  });

  await prisma.member.create({
    data: { memberNumber: 'MBR-0001', fullName: 'System Admin', userId: user.id },
  });

  console.log('✅ Admin created!');
  console.log('Email: admin@shomiti.com');
  console.log('Password: Admin@1234');

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
