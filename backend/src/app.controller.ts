import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { PrismaService } from './prisma.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) { }

  @Get()
  getHello(): string {
    return 'Market Boys Shomiti API is running!';
  }

  @Get('dashboard/summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get overall dashboard summary for admin' })
  async getDashboardSummary() {
    const [
      totalMembers,
      activeMembers,
      depositAgg,
      withdrawalAgg,
      paidDues,
      unpaidDues,
      overdueCount,
    ] = await Promise.all([
      this.prisma.member.count(),
      this.prisma.member.count({ where: { status: 'ACTIVE' } }),
      this.prisma.deposit.aggregate({ _sum: { amount: true }, _count: true }),
      this.prisma.withdrawal.aggregate({ _sum: { amount: true }, _count: true }),
      this.prisma.dueRecord.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
      this.prisma.dueRecord.aggregate({ where: { status: { in: ['UNPAID', 'PARTIAL'] } }, _sum: { amount: true } }),
      this.prisma.dueRecord.count({ where: { status: { in: ['UNPAID', 'PARTIAL'] }, dueDate: { lt: new Date() } } }),
    ]);

    const totalDeposits = Number(depositAgg._sum.amount || 0);
    const totalWithdrawals = Number(withdrawalAgg._sum.amount || 0);

    return {
      members: {
        total: totalMembers,
        active: activeMembers,
      },
      financials: {
        totalDeposits,
        totalWithdrawals,
        netBalance: totalDeposits - totalWithdrawals,
        totalTransactions: depositAgg._count + withdrawalAgg._count,
      },
      dues: {
        totalCollected: Number(paidDues._sum.amount || 0),
        totalPending: Number(unpaidDues._sum.amount || 0),
        overdueCount,
      },
    };
  }
}