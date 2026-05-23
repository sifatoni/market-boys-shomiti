import { PrismaService } from '../prisma.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto';
import { Withdrawal } from '@prisma/client';
export declare class WithdrawalsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateWithdrawalDto): Promise<Withdrawal>;
    findAll(memberId?: string): Promise<Withdrawal[]>;
    findOne(id: string): Promise<Withdrawal>;
    update(id: string, dto: UpdateWithdrawalDto): Promise<Withdrawal>;
    remove(id: string): Promise<Withdrawal>;
    getTotalWithdrawals(): Promise<{
        total: number;
        count: number;
    }>;
}
