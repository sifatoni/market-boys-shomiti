import { PrismaService } from '../prisma.service';
import { Member } from '@prisma/client';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { EmailService } from '../email/email.service';
export declare class MembersService {
    private prisma;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, emailService: EmailService);
    create(dto: CreateMemberDto): Promise<Member>;
    findAll(): Promise<Member[]>;
    findOne(id: string): Promise<Member>;
    update(id: string, dto: UpdateMemberDto): Promise<Member>;
    remove(id: string): Promise<Member>;
    calculateBalance(memberId: string): Promise<{
        totalDeposits: number;
        totalWithdrawals: number;
        netBalance: number;
    }>;
    findByUserId(userId: string): Promise<Member | null>;
}
