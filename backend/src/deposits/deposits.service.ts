import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { Deposit, Prisma } from '@prisma/client';

@Injectable()
export class DepositsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateDepositDto): Promise<Deposit> {
        const member = await this.prisma.member.findUnique({ where: { id: dto.memberId } });
        if (!member) {
            throw new NotFoundException(`Member with ID ${dto.memberId} not found`);
        }

        return this.prisma.deposit.create({
            data: {
                amount: new Prisma.Decimal(dto.amount),
                date: dto.date ? new Date(dto.date) : new Date(),
                description: dto.description,
                member: { connect: { id: dto.memberId } },
            },
            include: { member: true },
        });
    }

    async findAll(memberId?: string): Promise<Deposit[]> {
        return this.prisma.deposit.findMany({
            where: memberId ? { memberId } : undefined,
            include: { member: { select: { fullName: true, memberNumber: true } } },
            orderBy: { date: 'desc' },
        });
    }

    async findOne(id: string): Promise<Deposit> {
        const deposit = await this.prisma.deposit.findUnique({
            where: { id },
            include: { member: { select: { fullName: true, memberNumber: true } } },
        });
        if (!deposit) throw new NotFoundException(`Deposit with ID ${id} not found`);
        return deposit;
    }

    async update(id: string, dto: UpdateDepositDto): Promise<Deposit> {
        const deposit = await this.prisma.deposit.findUnique({ where: { id } });
        if (!deposit) throw new NotFoundException(`Deposit with ID ${id} not found`);

        return this.prisma.deposit.update({
            where: { id },
            data: {
                ...(dto.amount !== undefined && { amount: new Prisma.Decimal(dto.amount) }),
                ...(dto.date !== undefined && { date: new Date(dto.date) }),
                ...(dto.description !== undefined && { description: dto.description }),
            },
            include: { member: { select: { fullName: true, memberNumber: true } } },
        });
    }

    async remove(id: string): Promise<Deposit> {
        try {
            return await this.prisma.deposit.delete({ where: { id } });
        } catch {
            throw new NotFoundException(`Deposit with ID ${id} not found`);
        }
    }

    async getTotalDeposits(): Promise<{ total: number; count: number }> {
        const result = await this.prisma.deposit.aggregate({
            _sum: { amount: true },
            _count: true,
        });
        return {
            total: Number(result._sum.amount || 0),
            count: result._count,
        };
    }
}