import { IsNotEmpty, IsInt } from 'class-validator';

export class AssignRewardDto {
  @IsNotEmpty()
  @IsInt()
  awardedTo: number;
}
