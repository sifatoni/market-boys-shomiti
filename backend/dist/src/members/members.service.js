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
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let MembersService = class MembersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const { userId, ...memberData } = dto;
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
        return this.prisma.member.create({
            data: {
                ...memberData,
                user: { connect: { id: userId } },
            },
        });
    }
    async findAll() {
        return this.prisma.member.findMany({
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
        try {
            return await this.prisma.member.update({
                where: { id },
                data: dto,
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Member with ID ${id} not found`);
        }
    }
    async remove(id) {
        try {
            return await this.prisma.member.delete({
                where: { id },
            });
        }
        catch (error) {
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
exports.MembersService = MembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MembersService);
//# sourceMappingURL=members.service.js.map