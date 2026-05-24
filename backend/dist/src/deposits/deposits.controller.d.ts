import { DepositsService } from './deposits.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { MembersService } from '../members/members.service';
export declare class DepositsController {
    private readonly depositsService;
    private readonly membersService;
    constructor(depositsService: DepositsService, membersService: MembersService);
    create(dto: CreateDepositDto): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        memberId: string;
        date: Date;
    }>;
    findAll(memberId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        memberId: string;
        date: Date;
    }[]>;
    getSummary(): Promise<{
        total: number;
        count: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        memberId: string;
        date: Date;
    }>;
    update(id: string, dto: UpdateDepositDto): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        memberId: string;
        date: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        memberId: string;
        date: Date;
    }>;
}
