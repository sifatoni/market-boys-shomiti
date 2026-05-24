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
var MembersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
const email_service_1 = require("../email/email.service");
let MembersService = MembersService_1 = class MembersService {
    prisma;
    emailService;
    logger = new common_1.Logger(MembersService_1.name);
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async create(dto) {
        const { userId, monthlyAmount, plainPassword, ...memberData } = dto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { member: true }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        if (user.member) {
            throw new common_1.ConflictException('This user already has a member profile');
        }
        const createdMember = await this.prisma.member.create({
            data: {
                ...memberData,
                monthlyAmount: new client_1.Prisma.Decimal(monthlyAmount || '0'),
                user: { connect: { id: userId } },
            },
        });
        this.logger.log(`Attempting welcome email to: ${user.email}`);
        this.emailService.sendWelcomeEmail({
            to: user.email,
            memberName: dto.fullName,
            memberNumber: createdMember.memberNumber,
            email: user.email,
            password: plainPassword || 'আপনার নির্ধারিত পাসওয়ার্ড',
            loginUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
        }).catch(() => { });
        return createdMember;
    }
    async findAll() {
        return this.prisma.member.findMany({
            where: { user: { role: { not: client_1.UserRole.ADMIN } } },
            include: { user: true },
        });
    }
    async findOne(id) {
        const member = await this.prisma.member.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!member) {
            throw new common_1.NotFoundException(`Member with ID ${id} not found`);
        }
        return member;
    }
    async update(id, dto) {
        const { monthlyAmount, ...rest } = dto;
        try {
            return await this.prisma.member.update({
                where: { id },
                data: {
                    ...rest,
                    ...(monthlyAmount !== undefined && {
                        monthlyAmount: new client_1.Prisma.Decimal(monthlyAmount),
                    }),
                },
            });
        }
        catch {
            throw new common_1.NotFoundException(`Member with ID ${id} not found`);
        }
    }
    async remove(id) {
        try {
            return await this.prisma.member.delete({
                where: { id },
            });
        }
        catch {
            throw new common_1.NotFoundException(`Member with ID ${id} not found`);
        }
    }
    async calculateBalance(memberId) {
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
    async findByUserId(userId) {
        return this.prisma.member.findFirst({
            where: { userId },
            include: { user: true },
        });
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = MembersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], MembersService);
//# sourceMappingURL=members.service.js.map