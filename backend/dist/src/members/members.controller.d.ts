import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from '@prisma/client';
export declare class MembersController {
    private readonly membersService;
    constructor(membersService: MembersService);
    create(createMemberDto: CreateMemberDto): Promise<Member>;
    findAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        memberNumber: string;
        fullName: string;
        phone: string | null;
        address: string | null;
        joinedDate: Date;
        status: import("@prisma/client").$Enums.MemberStatus;
        userId: string;
    }[]>;
    findOne(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        memberNumber: string;
        fullName: string;
        phone: string | null;
        address: string | null;
        joinedDate: Date;
        status: import("@prisma/client").$Enums.MemberStatus;
        userId: string;
    }>;
    update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member>;
    remove(id: string): Promise<Member>;
    getBalance(id: string, req: any): Promise<{
        totalDeposits: number;
        totalWithdrawals: number;
        netBalance: number;
    }>;
}
