import { PrismaService } from '../prisma.service';
import { CreateDueDto, UpdateDueStatusDto } from './dto/create-due.dto';
import { DueRecord } from '@prisma/client';
export declare class DuesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateDueDto): Promise<DueRecord>;
    generateMonthlyDues(amount: string, month: number, year: number): Promise<{
        created: number;
    }>;
    findAll(memberId?: string): Promise<DueRecord[]>;
    findOverdue(): Promise<DueRecord[]>;
    updateStatus(id: string, dto: UpdateDueStatusDto): Promise<DueRecord>;
    getSummary(): Promise<{
        totalDue: number;
        totalPaid: number;
        totalPartial: number;
        overdueCount: number;
    }>;
}
