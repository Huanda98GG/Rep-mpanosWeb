import { IsEmail, IsOptional, IsString, IsIn } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['ADMIN', 'SLAVE', 'DEVELOPER'])
  role?: Role | string;
}
