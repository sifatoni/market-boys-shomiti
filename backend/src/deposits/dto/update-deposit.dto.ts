import { IsString, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDepositDto {
  @ApiProperty({ example: '750.00', required: false })
  @IsNotEmpty()
  @IsOptional()
  amount?: string;

  @ApiProperty({ example: '2026-05-01', required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: 'Monthly contribution - May 2026', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
