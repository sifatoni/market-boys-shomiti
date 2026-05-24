import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { Deposit } from '@prisma/client';
export declare class DepositsService {
    private prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
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
