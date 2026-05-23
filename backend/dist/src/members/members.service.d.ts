import { PrismaService } from '../prisma.service';
import { Member } from '@prisma/client';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
export declare class MembersService {
    private prisma;
    constructor(prisma: PrismaService);
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
