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
var DuesScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuesScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma.service");
const email_service_1 = require("../email/email.service");
const client_1 = require("@prisma/client");
let DuesScheduler = DuesScheduler_1 = class DuesScheduler {
    prisma;
    emailService;
    logger = new common_1.Logger(DuesScheduler_1.name);
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async generateMonthlyDues() {
        this.logger.log('Running monthly due generation...');
        const now = new Date();
        const year = now.getFullYear();
        const dueDate = new Date(year, now.getMonth(), 28);
        const month = now.toLocaleString('default', { month: 'long' });
        const activeMembers = await this.prisma.member.findMany({
            where: {
                status: 'ACTIVE',
                user: { role: { not: client_1.UserRole.ADMIN } },
                monthlyAmount: { gt: 0 },
            },
        });
        let created = 0;
        for (const member of activeMembers) {
            const start = new Date(year, now.getMonth(), 1);
            const end = new Date(year, now.getMonth() + 1, 0);
            const existing = await this.prisma.dueRecord.findFirst({
                where: { memberId: member.id, dueDate: { gte: start, lte: end } },
            });
            if (!existing) {
                await this.prisma.dueRecord.create({
                    data: {
                        amount: member.monthlyAmount,
                        dueDate,
                        member: { connect: { id: member.id } },
                    },
                });
                created++;
                const memberWithUser = await this.prisma.member.findUnique({
                    where: { id: member.id },
                    include: { user: true },
                });
                if (memberWithUser?.user?.email) {
                    await this.emailService.sendMonthlyDueNotification({
                        to: memberWithUser.user.email,
                        memberName: member.fullName,
                        memberNumber: member.memberNumber,
                        dueAmount: Number(member.monthlyAmount),
                        dueDate: dueDate.toISOString(),
                        month,
                        year,
                    });
                }
            }
        }
        this.logger.log(`Monthly dues generated: ${created} records created`);
    }
};
exports.DuesScheduler = DuesScheduler;
__decorate([
    (0, schedule_1.Cron)('1 0 1 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DuesScheduler.prototype, "generateMonthlyDues", null);
exports.DuesScheduler = DuesScheduler = DuesScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], DuesScheduler);
//# sourceMappingURL=dues.scheduler.js.map