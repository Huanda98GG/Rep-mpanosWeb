import { IsOptional, IsString } from 'class-validator';

export class UpdateVictimDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  skills?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
