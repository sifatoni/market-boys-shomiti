import { DuesService } from './dues.service';
import { CreateDueDto, UpdateDueStatusDto } from './dto/create-due.dto';
import { MembersService } from '../members/members.service';
export declare class DuesController {
    private readonly duesService;
    private readonly membersService;
    constructor(duesService: DuesService, membersService: MembersService);
    create(dto: CreateDueDto): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.DueStatus;
        amount: import("@prisma/client-runtime-utils").Decimal;
        memberId: string;
        dueDate: Date;
        paidDate: Date | null;
    }>;
    generateMonthly(body: {
        amount: string;
        month: number;
        year: number;
    }): Promise<{
        created: number;
    }>;
    findAll(memberId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.DueStatus;
        amount: import("@prisma/client-runtime-utils").Decimal;
        memberId: string;
        dueDate: Date;
        paidDate: Date | null;
    }[]>;
    findOverdue(): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.DueStatus;
        amount: import("@prisma/client-runtime-utils").Decimal;
        memberId: string;
        dueDate: Date;
        paidDate: Date | null;
    }[]>;
    getSummary(): Promise<{
        totalDue: number;
        totalPaid: number;
        totalPartial: number;
        overdueCount: number;
    }>;
    updateStatus(id: string, dto: UpdateDueStatusDto): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.DueStatus;
        amount: import("@prisma/client-runtime-utils").Decimal;
        memberId: string;
        dueDate: Date;
        paidDate: Date | null;
    }>;
}
