import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({ example: 'MEM-001' })
  @IsString()
  @IsNotEmpty()
  memberNumber: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '123 Main St, City', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'uuid-of-user', description: 'ID of the User account to link this member to' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: '1000.00', required: false })
  @IsString()
  @IsOptional()
  monthlyAmount?: string;

  @ApiProperty({ example: 'MyP@ssword', required: false, description: 'Plain password for welcome email only — never stored' })
  @IsString()
  @IsOptional()
  plainPassword?: string;
}
