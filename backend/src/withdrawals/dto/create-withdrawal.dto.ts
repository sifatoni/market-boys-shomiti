import { IsString, IsOptional, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWithdrawalDto {
    @ApiProperty({ example: '200.00', description: 'Withdrawal amount' })
    @IsNotEmpty()
    amount: string;

    @ApiProperty({ example: '2026-05-10', required: false })
    @IsDateString()
    @IsOptional()
    date?: string;

    @ApiProperty({ example: 'Emergency medical expense', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'uuid-of-member' })
    @IsString()
    @IsNotEmpty()
    memberId: string;
}