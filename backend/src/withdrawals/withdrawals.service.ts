import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto';
import { Withdrawal, Prisma } from '@prisma/client';

@Injectable()
export class WithdrawalsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateWithdrawalDto): Promise<Withdrawal> {
        const member = await this.prisma.member.findUnique({ where: { id: dto.memberId } });
        if (!member) {
            throw new NotFoundException(`Member with ID ${dto.memberId} not found`);
        }

        // Check sufficient balance
        const deposits = await this.prisma.deposit.aggregate({
            where: { memberId: dto.memberId },
            _sum: { amount: true },
        });
        const withdrawals = await this.prisma.withdrawal.aggregate({
            where: { memberId: dto.memberId },
            _sum: { amount: true },
        });
        const balance = Number(deposits._sum.amount || 0) - Number(withdrawals._sum.amount || 0);
        if (Number(dto.amount) > balance) {
            throw new BadRequestException(`Insufficient balance. Current balance: ${balance}`);
        }

        return this.prisma.withdrawal.create({
            data: {
                amount: new Prisma.Decimal(dto.amount),
                date: dto.date ? new Date(dto.date) : new Date(),
                description: dto.description,
                member: { connect: { id: dto.memberId } },
            },
            include: { member: true },
        });
    }

    async findAll(memberId?: string): Promise<Withdrawal[]> {
        return this.prisma.withdrawal.findMany({
            where: memberId ? { memberId } : undefined,
            include: { member: { select: { fullName: true, memberNumber: true } } },
            orderBy: { date: 'desc' },
        });
    }

    async findOne(id: string): Promise<Withdrawal> {
        const w = await this.prisma.withdrawal.findUnique({
            where: { id },
            include: { member: { select: { fullName: true, memberNumber: true } } },
        });
        if (!w) throw new NotFoundException(`Withdrawal with ID ${id} not found`);
        return w;
    }

    async update(id: string, dto: UpdateWithdrawalDto): Promise<Withdrawal> {
        const withdrawal = await this.prisma.withdrawal.findUnique({ where: { id } });
        if (!withdrawal) throw new NotFoundException(`Withdrawal with ID ${id} not found`);

        if (dto.amount !== undefined) {
            const deposits = await this.prisma.deposit.aggregate({
                where: { memberId: withdrawal.memberId },
                _sum: { amount: true },
            });
            const withdrawals = await this.prisma.withdrawal.aggregate({
                where: { memberId: withdrawal.memberId },
                _sum: { amount: true },
            });
            // Exclude current withdrawal from balance check, then check new amount fits
            const balanceExcludingThis =
                Number(deposits._sum.amount || 0) -
                Number(withdrawals._sum.amount || 0) +
                Number(withdrawal.amount);
            if (Number(dto.amount) > balanceExcludingThis) {
                throw new BadRequestException(
                    `Insufficient balance. Available: ${balanceExcludingThis}`,
                );
            }
        }

        return this.prisma.withdrawal.update({
            where: { id },
            data: {
                ...(dto.amount !== undefined && { amount: new Prisma.Decimal(dto.amount) }),
                ...(dto.date !== undefined && { date: new Date(dto.date) }),
                ...(dto.description !== undefined && { description: dto.description }),
            },
            include: { member: { select: { fullName: true, memberNumber: true } } },
        });
    }

    async remove(id: string): Promise<Withdrawal> {
        try {
            return await this.prisma.withdrawal.delete({ where: { id } });
        } catch {
            throw new NotFoundException(`Withdrawal with ID ${id} not found`);
        }
    }

    async getTotalWithdrawals(): Promise<{ total: number; count: number }> {
        const result = await this.prisma.withdrawal.aggregate({
            _sum: { amount: true },
            _count: true,
        });
        return {
            total: Number(result._sum.amount || 0),
            count: result._count,
        };
    }
}