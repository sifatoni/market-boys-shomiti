"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let DuesService = class DuesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const member = await this.prisma.member.findUnique({ where: { id: dto.memberId } });
        if (!member)
            throw new common_1.NotFoundException(`Member with ID ${dto.memberId} not found`);
        return this.prisma.dueRecord.create({
            data: {
                amount: new client_1.Prisma.Decimal(dto.amount),
                dueDate: new Date(dto.dueDate),
                member: { connect: { id: dto.memberId } },
            },
        });
    }
    async generateMonthlyDues(amount, month, year) {
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
                        amount: new client_1.Prisma.Decimal(amount),
                        dueDate,
                        member: { connect: { id: member.id } },
                    },
                });
                created++;
            }
        }
        return { created };
    }
    async findAll(memberId) {
        return this.prisma.dueRecord.findMany({
            where: memberId ? { memberId } : undefined,
            include: { member: { select: { fullName: true, memberNumber: true } } },
            orderBy: { dueDate: 'desc' },
        });
    }
    async findOverdue() {
        return this.prisma.dueRecord.findMany({
            where: {
                status: { in: ['UNPAID', 'PARTIAL'] },
                dueDate: { lt: new Date() },
            },
            include: { member: { select: { fullName: true, memberNumber: true } } },
            orderBy: { dueDate: 'asc' },
        });
    }
    async updateStatus(id, dto) {
        const due = await this.prisma.dueRecord.findUnique({ where: { id } });
        if (!due)
            throw new common_1.NotFoundException(`Due record with ID ${id} not found`);
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
};
exports.DuesService = DuesService;
exports.DuesService = DuesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DuesService);
//# sourceMappingURL=dues.service.js.map