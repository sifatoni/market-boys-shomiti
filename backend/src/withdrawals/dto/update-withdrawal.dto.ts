import { IsString, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWithdrawalDto {
  @ApiProperty({ example: '300.00', required: false })
  @IsNotEmpty()
  @IsOptional()
  amount?: string;

  @ApiProperty({ example: '2026-05-10', required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: 'Emergency medical expense', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
