import { PrismaService } from './prisma.service';
export declare class AppController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHello(): string;
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
