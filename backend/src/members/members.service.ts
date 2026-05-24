import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Member, Prisma, UserRole } from '@prisma/client';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class MembersService {
  private readonly logger = new Logger(MembersService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) { }

  async create(dto: CreateMemberDto): Promise<Member> {
    const { userId, monthlyAmount, plainPassword, ...memberData } = dto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { member: true }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.member) {
      throw new ConflictException('This user already has a member profile');
    }

    const createdMember = await this.prisma.member.create({
      data: {
        ...memberData,
        monthlyAmount: new Prisma.Decimal(monthlyAmount || '0'),
        user: { connect: { id: userId } },
      },
    });

    // Fire-and-forget welcome email
    this.logger.log(`Attempting welcome email to: ${user.email}`);
    this.emailService.sendWelcomeEmail({
      to: user.email,
      memberName: dto.fullName,
      memberNumber: createdMember.memberNumber,
      email: user.email,
      password: plainPassword || 'আপনার নির্ধারিত পাসওয়ার্ড',
      loginUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    }).catch(() => {}); // non-blocking

    return createdMember;
  }

  async findAll(): Promise<Member[]> {
    return this.prisma.member.findMany({
      where: { user: { role: { not: UserRole.ADMIN } } },
      include: { user: true },
    });
  }

  async findOne(id: string): Promise<Member> {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async update(id: string, dto: UpdateMemberDto): Promise<Member> {
    const { monthlyAmount, ...rest } = dto;
    try {
      return await this.prisma.member.update({
        where: { id },
        data: {
          ...rest,
          ...(monthlyAmount !== undefined && {
            monthlyAmount: new Prisma.Decimal(monthlyAmount),
          }),
        },
      });
    } catch {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<Member> {
    try {
      return await this.prisma.member.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
  }

  async calculateBalance(memberId: string): Promise<{
    totalDeposits: number;
    totalWithdrawals: number;
    netBalance: number;
  }> {
    const deposits = await this.prisma.deposit.aggregate({
      where: { memberId },
      _sum: { amount: true },
    });

    const withdrawals = await this.prisma.withdrawal.aggregate({
      where: { memberId },
      _sum: { amount: true },
    });

    const totalDeposits = Number(deposits._sum.amount || 0);
    const totalWithdrawals = Number(withdrawals._sum.amount || 0);

    return {
      totalDeposits,
      totalWithdrawals,
      netBalance: totalDeposits - totalWithdrawals,
    };
  }

  async findByUserId(userId: string): Promise<Member | null> {
    return this.prisma.member.findFirst({
      where: { userId },
      include: { user: true },
    });
  }
}
