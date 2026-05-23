import { UserRole } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
}
