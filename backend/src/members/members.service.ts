import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Member, Prisma } from '@prisma/client';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateMemberDto): Promise<Member> {
    const { userId, ...memberData } = dto;

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

    return this.prisma.member.create({
      data: {
        ...memberData,
        user: { connect: { id: userId } },
      },
    });
  }

  async findAll(): Promise<Member[]> {
    return this.prisma.member.findMany({
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
    try {
      return await this.prisma.member.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<Member> {
    try {
      return await this.prisma.member.delete({
        where: { id },
      });
    } catch (error) {
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