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
exports.WithdrawalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let WithdrawalsService = class WithdrawalsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const member = await this.prisma.member.findUnique({ where: { id: dto.memberId } });
        if (!member) {
            throw new common_1.NotFoundException(`Member with ID ${dto.memberId} not found`);
        }
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
            throw new common_1.BadRequestException(`Insufficient balance. Current balance: ${balance}`);
        }
        return this.prisma.withdrawal.create({
            data: {
                amount: new client_1.Prisma.Decimal(dto.amount),
                date: dto.date ? new Date(dto.date) : new Date(),
                description: dto.description,
                member: { connect: { id: dto.memberId } },
            },
            include: { member: true },
        });
    }
    async findAll(memberId) {
        return this.prisma.withdrawal.findMany({
            where: memberId ? { memberId } : undefined,
            include: { member: { select: { fullName: true, memberNumber: true } } },
            orderBy: { date: 'desc' },
        });
    }
    async findOne(id) {
        const w = await this.prisma.withdrawal.findUnique({
            where: { id },
            include: { member: { select: { fullName: true, memberNumber: true } } },
        });
        if (!w)
            throw new common_1.NotFoundException(`Withdrawal with ID ${id} not found`);
        return w;
    }
    async update(id, dto) {
        const withdrawal = await this.prisma.withdrawal.findUnique({ where: { id } });
        if (!withdrawal)
            throw new common_1.NotFoundException(`Withdrawal with ID ${id} not found`);
        if (dto.amount !== undefined) {
            const deposits = await this.prisma.deposit.aggregate({
                where: { memberId: withdrawal.memberId },
                _sum: { amount: true },
            });
            const withdrawals = await this.prisma.withdrawal.aggregate({
                where: { memberId: withdrawal.memberId },
                _sum: { amount: true },
            });
            const balanceExcludingThis = Number(deposits._sum.amount || 0) -
                Number(withdrawals._sum.amount || 0) +
                Number(withdrawal.amount);
            if (Number(dto.amount) > balanceExcludingThis) {
                throw new common_1.BadRequestException(`Insufficient balance. Available: ${balanceExcludingThis}`);
            }
        }
        return this.prisma.withdrawal.update({
            where: { id },
            data: {
                ...(dto.amount !== undefined && { amount: new client_1.Prisma.Decimal(dto.amount) }),
                ...(dto.date !== undefined && { date: new Date(dto.date) }),
                ...(dto.description !== undefined && { description: dto.description }),
            },
            include: { member: { select: { fullName: true, memberNumber: true } } },
        });
    }
    async remove(id) {
        try {
            return await this.prisma.withdrawal.delete({ where: { id } });
        }
        catch {
            throw new common_1.NotFoundException(`Withdrawal with ID ${id} not found`);
        }
    }
    async getTotalWithdrawals() {
        const result = await this.prisma.withdrawal.aggregate({
            _sum: { amount: true },
            _count: true,
        });
        return {
            total: Number(result._sum.amount || 0),
            count: result._count,
        };
    }
};
exports.WithdrawalsService = WithdrawalsService;
exports.WithdrawalsService = WithdrawalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WithdrawalsService);
//# sourceMappingURL=withdrawals.service.js.map