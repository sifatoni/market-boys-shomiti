import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@shomiti.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The user password (sent as pass)' })
  @IsNotEmpty()
  @IsString()
  pass: string;
}
