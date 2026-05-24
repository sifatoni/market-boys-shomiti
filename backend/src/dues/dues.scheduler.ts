import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class DuesScheduler {
  private readonly logger = new Logger(DuesScheduler.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  @Cron('1 0 1 * *')
  async generateMonthlyDues() {
    this.logger.log('Running monthly due generation...');
    const now = new Date();
    const year = now.getFullYear();
    const dueDate = new Date(year, now.getMonth(), 28);
    const month = now.toLocaleString('default', { month: 'long' });

    const activeMembers = await this.prisma.member.findMany({
      where: {
        status: 'ACTIVE',
        user: { role: { not: UserRole.ADMIN } },
        monthlyAmount: { gt: 0 },
      },
    });

    let created = 0;
    for (const member of activeMembers) {
      const start = new Date(year, now.getMonth(), 1);
      const end = new Date(year, now.getMonth() + 1, 0);
      const existing = await this.prisma.dueRecord.findFirst({
        where: { memberId: member.id, dueDate: { gte: start, lte: end } },
      });
      if (!existing) {
        await this.prisma.dueRecord.create({
          data: {
            amount: member.monthlyAmount,
            dueDate,
            member: { connect: { id: member.id } },
          },
        });
        created++;

        // Fetch member with user email and send notification
        const memberWithUser = await this.prisma.member.findUnique({
          where: { id: member.id },
          include: { user: true },
        });
        if (memberWithUser?.user?.email) {
          await this.emailService.sendMonthlyDueNotification({
            to: memberWithUser.user.email,
            memberName: member.fullName,
            memberNumber: member.memberNumber,
            dueAmount: Number(member.monthlyAmount),
            dueDate: dueDate.toISOString(),
            month,
            year,
          });
        }
      }
    }
    this.logger.log(`Monthly dues generated: ${created} records created`);
  }
}
