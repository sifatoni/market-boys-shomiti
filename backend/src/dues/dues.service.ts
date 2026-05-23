import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDueDto, UpdateDueStatusDto } from './dto/create-due.dto';
import { DueRecord, Prisma } from '@prisma/client';

@Injectable()
export class DuesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateDueDto): Promise<DueRecord> {
        const member = await this.prisma.member.findUnique({ where: { id: dto.memberId } });
        if (!member) throw new NotFoundException(`Member with ID ${dto.memberId} not found`);

        return this.prisma.dueRecord.create({
            data: {
                amount: new Prisma.Decimal(dto.amount),
                dueDate: new Date(dto.dueDate),
                member: { connect: { id: dto.memberId } },
            },
        });
    }

    async generateMonthlyDues(amount: string, month: number, year: number): Promise<{ created: number }> {
        const activeMembers = await this.prisma.member.findMany({
            where: { status: 'ACTIVE' },
        });

        const dueDate = new Date(year, month - 1, 28);
        let created = 0;

        for (const member of activeMembers) {
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0);
            const existing = await this.prisma.dueRecord.findFirst({
                where: {
                    memberId: member.id,
                    dueDate: { gte: start, lte: end },
                },
            });

            if (!existing) {
                await this.prisma.dueRecord.create({
                    data: {
                        amount: new Prisma.Decimal(amount),
                        dueDate,
                        member: { connect: { id: member.id } },
                    },
                });
                created++;
            }
        }
        return { created };
    }

    async findAll(memberId?: string): Promise<DueRecord[]> {
        return this.prisma.dueRecord.findMany({
            where: memberId ? { memberId } : undefined,
            include: { member: { select: { fullName: true, memberNumber: true } } },
            orderBy: { dueDate: 'desc' },
        });
    }

    async findOverdue(): Promise<DueRecord[]> {
        return this.prisma.dueRecord.findMany({
            where: {
                status: { in: ['UNPAID', 'PARTIAL'] },
                dueDate: { lt: new Date() },
            },
            include: { member: { select: { fullName: true, memberNumber: true } } },
            orderBy: { dueDate: 'asc' },
        });
    }

    async updateStatus(id: string, dto: UpdateDueStatusDto): Promise<DueRecord> {
        const due = await this.prisma.dueRecord.findUnique({ where: { id } });
        if (!due) throw new NotFoundException(`Due record with ID ${id} not found`);

        return this.prisma.dueRecord.update({
            where: { id },
            data: {
                status: dto.status,
                paidDate: dto.paidDate ? new Date(dto.paidDate) : (dto.status === 'PAID' ? new Date() : null),
            },
        });
    }

    async getSummary() {
        const [unpaid, paid, partial, overdue] = await Promise.all([
            this.prisma.dueRecord.aggregate({ where: { status: 'UNPAID' }, _sum: { amount: true }, _count: true }),
            this.prisma.dueRecord.aggregate({ where: { status: 'PAID' }, _sum: { amount: true }, _count: true }),
            this.prisma.dueRecord.aggregate({ where: { status: 'PARTIAL' }, _sum: { amount: true }, _count: true }),
            this.prisma.dueRecord.count({ where: { status: { in: ['UNPAID', 'PARTIAL'] }, dueDate: { lt: new Date() } } }),
        ]);
        return {
            totalDue: Number(unpaid._sum.amount || 0),
            totalPaid: Number(paid._sum.amount || 0),
            totalPartial: Number(partial._sum.amount || 0),
            overdueCount: overdue,
        };
    }
}