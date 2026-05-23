import { IsString, IsOptional, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepositDto {
    @ApiProperty({ example: '500.00', description: 'Deposit amount' })
    @IsNotEmpty()
    amount: string;

    @ApiProperty({ example: '2026-05-01', required: false })
    @IsDateString()
    @IsOptional()
    date?: string;

    @ApiProperty({ example: 'Monthly contribution - May 2026', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'uuid-of-member' })
    @IsString()
    @IsNotEmpty()
    memberId: string;
}