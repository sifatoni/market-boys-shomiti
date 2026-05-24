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
exports.DepositsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const email_service_1 = require("../email/email.service");
const client_1 = require("@prisma/client");
let DepositsService = class DepositsService {
    prisma;
    emailService;
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async create(dto) {
        const member = await this.prisma.member.findUnique({ where: { id: dto.memberId } });
        if (!member) {
            throw new common_1.NotFoundException(`Member with ID ${dto.memberId} not found`);
        }
        const newDeposit = await this.prisma.deposit.create({
            data: {
                amount: new client_1.Prisma.Decimal(dto.amount),
                date: dto.date ? new Date(dto.date) : new Date(),
                description: dto.description,
                member: { connect: { id: dto.memberId } },
            },
            include: { member: true },
        });
        const depositWithMember = await this.prisma.deposit.findUnique({
            where: { id: newDeposit.id },
            include: { member: { include: { user: true } } },
        });
        if (depositWithMember?.member?.user?.email) {
            this.emailService.sendDepositConfirmation({
                to: depositWithMember.member.user.email,
                memberName: depositWithMember.member.fullName,
                memberNumber: depositWithMember.member.memberNumber,
                amount: Number(newDeposit.amount),
                date: newDeposit.date.toISOString(),
                description: newDeposit.description ?? undefined,
            });
        }
        return newDeposit;
    }
    async findAll(memberId) {
        return this.prisma.deposit.findMany({
            where: memberId ? { memberId } : undefined,
            include: { member: { select: { fullName: true, memberNumber: true } } },
            orderBy: { date: 'desc' },
        });
    }
    async findOne(id) {
        const deposit = await this.prisma.deposit.findUnique({
            where: { id },
            include: { member: { select: { fullName: true, memberNumber: true } } },
        });
        if (!deposit)
            throw new common_1.NotFoundException(`Deposit with ID ${id} not found`);
        return deposit;
    }
    async update(id, dto) {
        const deposit = await this.prisma.deposit.findUnique({ where: { id } });
        if (!deposit)
            throw new common_1.NotFoundException(`Deposit with ID ${id} not found`);
        return this.prisma.deposit.update({
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
            return await this.prisma.deposit.delete({ where: { id } });
        }
        catch {
            throw new common_1.NotFoundException(`Deposit with ID ${id} not found`);
        }
    }
    async getTotalDeposits() {
        const result = await this.prisma.deposit.aggregate({
            _sum: { amount: true },
            _count: true,
        });
        return {
            total: Number(result._sum.amount || 0),
            count: result._count,
        };
    }
};
exports.DepositsService = DepositsService;
exports.DepositsService = DepositsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], DepositsService);
//# sourceMappingURL=deposits.service.js.map