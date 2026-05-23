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
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        description: string | null;
        memberId: string;
        createdAt: Date;
    }>;
    findAll(memberId: string, req: any): Promise<{
        id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        description: string | null;
        memberId: string;
        createdAt: Date;
    }[]>;
    getSummary(): Promise<{
        total: number;
        count: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        description: string | null;
        memberId: string;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateDepositDto): Promise<{
        id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        description: string | null;
        memberId: string;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        description: string | null;
        memberId: string;
        createdAt: Date;
    }>;
}
