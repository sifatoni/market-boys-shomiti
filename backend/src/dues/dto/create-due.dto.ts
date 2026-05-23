import { IsString, IsOptional, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DueStatus } from '@prisma/client';

export class CreateDueDto {
    @ApiProperty({ example: '500.00' })
    @IsNotEmpty()
    amount: string;

    @ApiProperty({ example: '2026-05-31' })
    @IsDateString()
    @IsNotEmpty()
    dueDate: string;

    @ApiProperty({ example: 'uuid-of-member' })
    @IsString()
    @IsNotEmpty()
    memberId: string;
}

export class UpdateDueStatusDto {
    @ApiProperty({ enum: DueStatus })
    @IsEnum(DueStatus)
    status: DueStatus;

    @ApiProperty({ example: '2026-05-20', required: false })
    @IsDateString()
    @IsOptional()
    paidDate?: string;
}