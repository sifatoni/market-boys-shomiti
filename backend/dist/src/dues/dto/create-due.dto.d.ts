import { DueStatus } from '@prisma/client';
export declare class CreateDueDto {
    amount: string;
    dueDate: string;
    memberId: string;
}
export declare class UpdateDueStatusDto {
    status: DueStatus;
    paidDate?: string;
}
