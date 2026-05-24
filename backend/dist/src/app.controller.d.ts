import { PrismaService } from './prisma.service';
import { EmailService } from './email/email.service';
export declare class AppController {
    private readonly prisma;
    private readonly emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    getHello(): string;
    testEmail(): Promise<{
        message: string;
    }>;
    getDashboardSummary(): Promise<{
        members: {
            total: number;
            active: number;
        };
        financials: {
            totalDeposits: number;
            totalWithdrawals: number;
            netBalance: number;
            totalTransactions: number;
        };
        dues: {
            totalCollected: number;
            totalPending: number;
            overdueCount: number;
        };
    }>;
}
