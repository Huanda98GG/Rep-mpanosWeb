import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVictimDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  skills?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
