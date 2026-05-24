import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto';
import { MembersService } from '../members/members.service';
export declare class WithdrawalsController {
    private readonly withdrawalsService;
    private readonly membersService;
    constructor(withdrawalsService: WithdrawalsService, membersService: MembersService);
    create(dto: CreateWithdrawalDto): Promise<{
        id: string;
        createdAt: Date;
        memberId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        description: string | null;
        date: Date;
    }>;
    findAll(memberId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        memberId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        description: string | null;
        date: Date;
    }[]>;
    getSummary(): Promise<{
        total: number;
        count: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        memberId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        description: string | null;
        date: Date;
    }>;
    update(id: string, dto: UpdateWithdrawalDto): Promise<{
        id: string;
        createdAt: Date;
        memberId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        description: string | null;
        date: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        memberId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        description: string | null;
        date: Date;
    }>;
}
