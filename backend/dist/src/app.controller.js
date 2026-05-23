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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const roles_guard_1 = require("./auth/roles.guard");
const roles_decorator_1 = require("./auth/roles.decorator");
const prisma_service_1 = require("./prisma.service");
let AppController = class AppController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getHello() {
        return 'Market Boys Shomiti API is running!';
    }
    async getDashboardSummary() {
        const [totalMembers, activeMembers, depositAgg, withdrawalAgg, paidDues, unpaidDues, overdueCount,] = await Promise.all([
            this.prisma.member.count(),
            this.prisma.member.count({ where: { status: 'ACTIVE' } }),
            this.prisma.deposit.aggregate({ _sum: { amount: true }, _count: true }),
            this.prisma.withdrawal.aggregate({ _sum: { amount: true }, _count: true }),
            this.prisma.dueRecord.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
            this.prisma.dueRecord.aggregate({ where: { status: { in: ['UNPAID', 'PARTIAL'] } }, _sum: { amount: true } }),
            this.prisma.dueRecord.count({ where: { status: { in: ['UNPAID', 'PARTIAL'] }, dueDate: { lt: new Date() } } }),
        ]);
        const totalDeposits = Number(depositAgg._sum.amount || 0);
        const totalWithdrawals = Number(withdrawalAgg._sum.amount || 0);
        return {
            members: {
                total: totalMembers,
                active: activeMembers,
            },
            financials: {
                totalDeposits,
                totalWithdrawals,
                netBalance: totalDeposits - totalWithdrawals,
                totalTransactions: depositAgg._count + withdrawalAgg._count,
            },
            dues: {
                totalCollected: Number(paidDues._sum.amount || 0),
                totalPending: Number(unpaidDues._sum.amount || 0),
                overdueCount,
            },
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('dashboard/summary'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overall dashboard summary for admin' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getDashboardSummary", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppController);
//# sourceMappingURL=app.controller.js.map