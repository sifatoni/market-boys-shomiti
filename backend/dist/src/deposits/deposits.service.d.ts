import { PrismaService } from '../prisma.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { Deposit } from '@prisma/client';
export declare class DepositsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateDepositDto): Promise<Deposit>;
    findAll(memberId?: string): Promise<Deposit[]>;
    findOne(id: string): Promise<Deposit>;
    update(id: string, dto: UpdateDepositDto): Promise<Deposit>;
    remove(id: string): Promise<Deposit>;
    getTotalDeposits(): Promise<{
        total: number;
        count: number;
    }>;
}
