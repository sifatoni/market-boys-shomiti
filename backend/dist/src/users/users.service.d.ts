import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOneByEmail(email: string): Promise<User | null>;
    findOneById(id: string): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    update(id: string, data: any): Promise<User>;
    delete(id: string): Promise<User>;
}
